import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import SideNav, {
  checkChildActive,
  sideNavItems,
} from "../index";
import { persistUserSettings } from "src/utils/persistUserSettings";
import { NAV_PIN_STORAGE_KEY } from "src/utils/userSettings";

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

jest.mock("src/routes/routesPaths", () => ({
  DASHBOARD: "/dashboard",
  ALL_APPS: "/all-apps",
  ALL_APPS_DETAILS: "/all-apps-details",
  RELEASE_DETAILS: "/release-details",
  MY_ACTIVITIES: "/my-activities",
  MY_ACCOUNT: "/my-account",
  HELP: "/help",
  SETTINGS: "/settings",
}));

jest.mock("src/utils/common/constants", () => ({
  UserPlaceholderIcon: "mocked-user-placeholder.svg",
}));

jest.mock("src/utils/persistUserSettings", () => ({
  persistUserSettings: jest.fn().mockResolvedValue({
    menuPinned: true,
    preservePinnedState: false,
    notificationEnabled: true,
    defaultTheme: "DARK",
    emailNotificationEnabled: true,
    releaseAlertEnabled: true,
    compactMode: false,
    language: "en",
    timezone: null,
  }),
}));

const mockStore = configureStore([]);

const renderSideNav = (
  path = "/all-apps",
  settings?: { menuPinned?: boolean; preservePinnedState?: boolean }
) => {
  const store = mockStore({
    profile: { data: { profileImage: "", settings } },
  });
  return render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[path]}>
        <SideNav />
      </MemoryRouter>
    </Provider>
  );
};

describe("SideNav Component", () => {
  beforeEach(() => {
    mockNavigate.mockClear();
    localStorage.clear();
    (persistUserSettings as jest.Mock).mockClear();
  });

  it("renders the overlay rail", () => {
    renderSideNav();
    expect(screen.getByLabelText("Main")).toHaveClass("sideNav");
  });

  it("renders visible items from sideNavItems", () => {
    renderSideNav();
    sideNavItems
      .filter((item) => !item.isHidden)
      .forEach((item) => {
        expect(screen.getByLabelText(item.name)).toBeInTheDocument();
        expect(screen.getByText(item.name)).toBeInTheDocument();
      });
  });

  it("expands when the hover strip is entered", () => {
    renderSideNav();
    const nav = screen.getByLabelText("Main");
    fireEvent.mouseEnter(nav);
    expect(nav).toHaveClass("isExpanded");
    fireEvent.mouseLeave(nav);
    expect(nav).not.toHaveClass("isExpanded");
  });

  it("stays expanded when pinned", () => {
    renderSideNav();
    const nav = screen.getByLabelText("Main");
    fireEvent.click(screen.getByLabelText("Pin menu"));
    expect(nav).toHaveClass("isPinned");
    expect(nav).toHaveClass("isExpanded");
    fireEvent.mouseLeave(nav);
    expect(nav).toHaveClass("isExpanded");
    expect(localStorage.getItem(NAV_PIN_STORAGE_KEY)).toBe("true");
  });

  it("does not pin or unpin when pinned state is preserved", () => {
    renderSideNav("/all-apps", {
      menuPinned: false,
      preservePinnedState: true,
    });
    const nav = screen.getByLabelText("Main");
    fireEvent.mouseEnter(nav);
    const pin = screen.getByLabelText("Pinned state is preserved");
    expect(pin).toBeDisabled();
    fireEvent.click(pin);
    expect(nav).not.toHaveClass("isPinned");
    expect(persistUserSettings).not.toHaveBeenCalled();
  });

  it("navigates when a rail item is clicked", () => {
    renderSideNav();
    fireEvent.click(screen.getByLabelText("All Apps"));
    expect(mockNavigate).toHaveBeenCalledWith("/all-apps");
  });

  it("places Dashboard above All Apps and Settings below Help", () => {
    const visibleNames = sideNavItems
      .filter((item) => !item.isHidden)
      .map((item) => item.name);
    expect(visibleNames.indexOf("Dashboard")).toBeLessThan(
      visibleNames.indexOf("All Apps")
    );
    expect(visibleNames.indexOf("Help & FAQ")).toBeLessThan(
      visibleNames.indexOf("Settings")
    );
    renderSideNav();
    expect(screen.getByLabelText("Help & FAQ")).toHaveClass("sideNavDock");
  });

  it("navigates to Dashboard and Settings", () => {
    renderSideNav();
    fireEvent.click(screen.getByLabelText("Dashboard"));
    expect(mockNavigate).toHaveBeenCalledWith("/dashboard");
    fireEvent.click(screen.getByLabelText("Settings"));
    expect(mockNavigate).toHaveBeenCalledWith("/settings");
  });

  it("asks the header to refresh unread notifications when Dashboard is clicked", () => {
    const dispatchSpy = jest.spyOn(window, "dispatchEvent");
    renderSideNav();
    fireEvent.click(screen.getByLabelText("Dashboard"));
    expect(dispatchSpy).toHaveBeenCalledWith(
      expect.objectContaining({ type: "skipstore-notifications-unread-refresh" })
    );
    dispatchSpy.mockRestore();
  });

  it("navigates to Help & FAQ", () => {
    renderSideNav();
    fireEvent.click(screen.getByLabelText("Help & FAQ"));
    expect(mockNavigate).toHaveBeenCalledWith("/help");
  });

  it("opens profile on avatar click", () => {
    renderSideNav();
    fireEvent.click(screen.getByLabelText("My Account"));
    expect(mockNavigate).toHaveBeenCalledWith("/my-account");
  });

  it("marks All Apps active on a child route", () => {
    renderSideNav("/all-apps-details");
    expect(screen.getByLabelText("All Apps")).toHaveClass("isActive");
  });

  it("does not mark All Apps active on the profile route", () => {
    renderSideNav("/my-account");
    expect(screen.getByLabelText("All Apps")).not.toHaveClass("isActive");
    expect(screen.getByLabelText("My Account")).toHaveClass("isActive");
  });
});

describe("checkChildActive", () => {
  it("returns true when a child path matches", () => {
    expect(
      checkChildActive("/all-apps-details", [
        { name: "App Details", path: "/all-apps-details" },
      ])
    ).toBe(true);
  });

  it("returns false when no child matches", () => {
    expect(
      checkChildActive("/other", [
        { name: "App Details", path: "/all-apps-details" },
      ])
    ).toBe(false);
  });
});
