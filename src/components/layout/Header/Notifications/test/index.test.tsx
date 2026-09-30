import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import Notifications from "../index";
import { getDataApi, patchDataApi } from "src/apis/api";
import { NOTIFICATION_TYPE } from "../types";
import { NOTIFICATIONS_UNREAD_REFRESH } from "src/utils/notifications";

const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

jest.mock("src/apis/api", () => ({
  getDataApi: jest.fn(),
  patchDataApi: jest.fn(),
}));

jest.mock("src/components/common/Button", () => ({
  __esModule: true,
  default: ({
    label,
    onClick,
    disabled,
  }: {
    label: string;
    onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
    disabled?: boolean;
  }) => (
    <button type="button" disabled={disabled} onClick={onClick}>
      {label}
    </button>
  ),
}));

const mockStore = configureStore([]);

const invite = {
  id: 12,
  type: NOTIFICATION_TYPE.COLLABORATOR_INVITED,
  title: "App invitation",
  message: "Ada invited you to collaborate on Store",
  appId: 9,
  targetType: "COLLABORATOR",
  targetId: 77,
  payload: { actorName: "Ada", appName: "Store" },
  isRead: false,
  readDate: null,
  createdDate: new Date().toISOString(),
};

const release = {
  ...invite,
  id: 13,
  type: NOTIFICATION_TYPE.RELEASE_CREATED,
  title: "Release",
  message: "A release was created",
  targetType: "RELEASE",
  targetId: 44,
};

const renderNotifications = (notificationEnabled = true) =>
  render(
    <Provider
      store={mockStore({
        profile: {
          data: { settings: { notificationEnabled } },
          loading: false,
          error: "",
        },
      })}
    >
      <MemoryRouter>
        <Notifications />
      </MemoryRouter>
    </Provider>
  );

describe("Notifications", () => {
  beforeEach(() => {
    mockNavigate.mockClear();
    (getDataApi as jest.Mock).mockReset();
    (patchDataApi as jest.Mock).mockReset();
    (getDataApi as jest.Mock).mockImplementation(({ path }: { path: string }) => {
      if (path.includes("unread-count")) {
        return Promise.resolve({ success: true, data: { unreadCount: 2 } });
      }
      return Promise.resolve({
        success: true,
        data: {
          list: [invite, release],
          total_items: 2,
          page: 1,
          unreadCount: 2,
        },
      });
    });
    (patchDataApi as jest.Mock).mockResolvedValue({ success: true, data: {} });
  });

  it("loads unread count on mount and refreshes from the dashboard event", async () => {
    renderNotifications();
    await waitFor(() =>
      expect(getDataApi).toHaveBeenCalledWith({
        path: "api/notifications/unread-count",
      })
    );
    window.dispatchEvent(new Event(NOTIFICATIONS_UNREAD_REFRESH));
    await waitFor(() =>
      expect(
        (getDataApi as jest.Mock).mock.calls.filter(
          ([arg]) => arg.path === "api/notifications/unread-count"
        ).length
      ).toBeGreaterThan(1)
    );
  });

  it("marks an invite as read without navigating, then Accept goes to the invite page", async () => {
    renderNotifications();
    fireEvent.click(screen.getByLabelText("Notifications"));
    await screen.findByText("Ada invited you to collaborate on Store");

    fireEvent.click(
      screen.getByText("Ada invited you to collaborate on Store")
    );
    await waitFor(() =>
      expect(patchDataApi).toHaveBeenCalledWith({
        path: "api/notifications/12/read",
      })
    );
    expect(mockNavigate).not.toHaveBeenCalled();

    fireEvent.click(screen.getByRole("button", { name: "Accept" }));
    await waitFor(() =>
      expect(mockNavigate).toHaveBeenCalledWith("/invitations/77")
    );
  });

  it("navigates after marking a non-invite row as read", async () => {
    renderNotifications();
    fireEvent.click(screen.getByLabelText("Notifications"));
    await screen.findByText("A release was created");
    fireEvent.click(screen.getByText("A release was created"));
    await waitFor(() =>
      expect(mockNavigate).toHaveBeenCalledWith(
        "/all-apps/details/9/release/44"
      )
    );
  });

  it("does not navigate when the related app no longer exists", async () => {
    (getDataApi as jest.Mock).mockImplementation(({ path }: { path: string }) => {
      if (path.includes("unread-count")) {
        return Promise.resolve({ success: true, data: { unreadCount: 1 } });
      }
      return Promise.resolve({
        success: true,
        data: {
          list: [{ ...release, appExists: false, payload: { ...release.payload, appExists: false } }],
          total_items: 1,
          page: 1,
          unreadCount: 1,
        },
      });
    });
    renderNotifications();
    fireEvent.click(screen.getByLabelText("Notifications"));
    await screen.findByText("A release was created");
    fireEvent.click(screen.getByText("A release was created"));
    await waitFor(() =>
      expect(patchDataApi).toHaveBeenCalledWith({
        path: "api/notifications/13/read",
      })
    );
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it("disables Accept after the invite is already accepted", async () => {
    (getDataApi as jest.Mock).mockImplementation(({ path }: { path: string }) => {
      if (path.includes("unread-count")) {
        return Promise.resolve({ success: true, data: { unreadCount: 0 } });
      }
      return Promise.resolve({
        success: true,
        data: {
          list: [{ ...invite, accepted: true, inviteOpen: false, isRead: true }],
          total_items: 1,
          page: 1,
          unreadCount: 0,
        },
      });
    });
    renderNotifications();
    fireEvent.click(screen.getByLabelText("Notifications"));
    expect(await screen.findByRole("button", { name: "Accept" })).toBeDisabled();
  });

  it("shows the actor profile image when the API provides one", async () => {
    (getDataApi as jest.Mock).mockImplementation(({ path }: { path: string }) => {
      if (path.includes("unread-count")) {
        return Promise.resolve({ success: true, data: { unreadCount: 0 } });
      }
      return Promise.resolve({
        success: true,
        data: {
          list: [{ ...release, actorProfileImage: "https://cdn/ada.png", isRead: true }],
          total_items: 1,
          page: 1,
          unreadCount: 0,
        },
      });
    });
    renderNotifications();
    fireEvent.click(screen.getByLabelText("Notifications"));
    await screen.findByText("A release was created");
    expect(document.querySelector(".notifyAvatar img")).toHaveAttribute(
      "src",
      "https://cdn/ada.png"
    );
  });

  it("shows a disabled-state banner and faded bell when in-app notifications are off", async () => {
    renderNotifications(false);
    expect(screen.getByLabelText("Notifications")).toHaveClass("isDisabled");
    fireEvent.click(screen.getByLabelText("Notifications"));
    expect(
      await screen.findByText(/new notifications are disabled/i)
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Settings" })).toHaveAttribute(
      "href",
      "/settings"
    );
  });
});
