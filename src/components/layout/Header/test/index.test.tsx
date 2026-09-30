import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import Header from "../index";

jest.mock("src/utils/common/constants", () => ({
  skipstore: "mocked-skipstore-logo.svg",
  CodePushLogoImage: "mocked-code-push-logo.svg",
}));

jest.mock("src/routes/routesPaths", () => ({
  DASHBOARD: "/dashboard",
}));

jest.mock("src/utils/persistUserSettings", () => ({
  persistUserSettings: jest.fn().mockResolvedValue({}),
}));

const mockStore = configureStore([]);

describe("Header Component", () => {
  const renderHeader = () =>
    render(
      <Provider
        store={mockStore({
          profile: { data: null, loading: false, error: "" },
        })}
      >
        <BrowserRouter>
          <Header />
        </BrowserRouter>
      </Provider>
    );

  it("renders logos and theme toggle without an account menu", () => {
    renderHeader();
    expect(screen.getByAltText("Logo")).toBeInTheDocument();
    expect(screen.getByAltText("Icon")).toBeInTheDocument();
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
});
