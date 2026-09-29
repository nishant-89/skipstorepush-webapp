import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import SideNav, {
  checkChildActive,
  NAV_PIN_STORAGE_KEY,
  sideNavItems,
} from "../index";

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

jest.mock("src/routes/routesPaths", () => ({
  ALL_APPS: "/all-apps",
  ALL_APPS_DETAILS: "/all-apps-details",
  RELEASE_DETAILS: "/release-details",
  MY_ACTIVITIES: "/my-activities",
  MY_ACCOUNT: "/my-account",
  HELP: "/help",
}));

jest.mock("src/utils/common/constants", () => ({
  UserPlaceholderIcon: "mocked-user-placeholder.svg",
}));

const mockStore = configureStore([]);

const renderSideNav = (path = "/all-apps") => {
  const store = mockStore({
    profile: { data: { profileImage: "" } },
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

  it("navigates when a rail item is clicked", () => {
    renderSideNav();
    fireEvent.click(screen.getByLabelText("All Apps"));
    expect(mockNavigate).toHaveBeenCalledWith("/all-apps");
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
