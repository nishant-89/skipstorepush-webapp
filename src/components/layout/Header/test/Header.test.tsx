import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import Header from "../Header";

jest.mock("src/utils/common/constants/constants", () => ({
  skipstore: "mocked-skipstore-logo.svg",
  CodePushLogoImage: "mocked-code-push-logo.svg",
}));

jest.mock("../Notifications/Notifications", () => ({
  __esModule: true,
  default: () => <button type="button" aria-label="Notifications" />,
}));

jest.mock("src/routes/routesPaths", () => ({
  DASHBOARD: "/dashboard",
}));

jest.mock("src/utils/persistUserSettings", () => ({
  persistUserSettings: jest.fn().mockResolvedValue({}),
}));

const mockStore = configureStore([]);

describe("Header Component", () => {
  const renderHeader = (role?: string) =>
    render(
      <Provider
        store={mockStore({
          profile: {
            data: role ? { role } : null,
            loading: false,
            error: "",
          },
          auth: { accessToken: "test-token", user: { role } },
        })}
      >
        <BrowserRouter>
          <Header />
        </BrowserRouter>
      </Provider>
    );

  it("renders logos, notifications, and theme toggle without an account menu", () => {
    renderHeader();
    expect(screen.getByAltText("Logo")).toBeInTheDocument();
    expect(screen.getByAltText("Icon")).toBeInTheDocument();
    expect(screen.getByLabelText("Notifications")).toBeInTheDocument();
    expect(screen.getByLabelText("Switch to light theme")).toBeInTheDocument();
    expect(screen.queryByLabelText("Open account menu")).not.toBeInTheDocument();
  });

  it("navigates to dashboard when logo is clicked", () => {
    renderHeader();
    expect(screen.getByRole("link")).toHaveAttribute("href", "/dashboard");
  });

  it("toggles the color theme", () => {
    renderHeader();
    fireEvent.click(screen.getByLabelText("Switch to light theme"));
    expect(screen.getByLabelText("Switch to dark theme")).toBeInTheDocument();
  });

  it("has the header banner class", () => {
    renderHeader();
    expect(screen.getByRole("banner")).toHaveClass("header");
  });

  it("hides notifications and links home to overview for admins", () => {
    renderHeader("ADMIN");
    expect(screen.queryByLabelText("Notifications")).not.toBeInTheDocument();
    expect(screen.getByRole("link")).toHaveAttribute("href", "/admin/overview");
    expect(screen.getByText("Admin")).toBeInTheDocument();
    expect(screen.getByText("Admin console")).toBeInTheDocument();
  });

  it("does not show the admin marker for customers", () => {
    renderHeader("CUSTOMER");
    expect(screen.queryByText("Admin")).not.toBeInTheDocument();
    expect(screen.getByText("OTA console")).toBeInTheDocument();
  });
});
