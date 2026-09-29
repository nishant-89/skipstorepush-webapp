import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Header from "../index";

jest.mock("src/utils/common/constants", () => ({
  skipstore: "mocked-skipstore-logo.svg",
  CodePushLogoImage: "mocked-code-push-logo.svg",
}));

jest.mock("src/routes/routesPaths", () => ({
  ALL_APPS: "/all-apps",
}));

describe("Header Component", () => {
  const renderHeader = () =>
    render(
      <BrowserRouter>
        <Header />
      </BrowserRouter>
    );

  it("renders logos and theme toggle without an account menu", () => {
    renderHeader();
    expect(screen.getByAltText("Logo")).toBeInTheDocument();
    expect(screen.getByAltText("Icon")).toBeInTheDocument();
    expect(screen.getByLabelText("Switch to light theme")).toBeInTheDocument();
    expect(screen.queryByLabelText("Open account menu")).not.toBeInTheDocument();
  });

  it("navigates to all apps when logo is clicked", () => {
    renderHeader();
    expect(screen.getByRole("link")).toHaveAttribute("href", "/all-apps");
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
