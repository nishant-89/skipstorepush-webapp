import { render, screen, fireEvent } from "@testing-library/react";
import NotAuthorized from "./index";
import { useNavigate } from "react-router-dom";
import ROUTES from "src/routes/routesPaths";

// Mocks
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: jest.fn(),
}));

interface MockButtonProps {
  label: string;
  onClick?: () => void;
  disabled?: boolean;
}

jest.mock("src/components/common/Button", () => (props: MockButtonProps) => {
  const { label, onClick } = props;
  return (
    <button onClick={onClick} data-testid={`button-${label}`}>
      {label}
    </button>
  );
});

jest.mock("src/utils/common/constants", () => ({
  PageNotfound: "/mock-not-authorized.png",
}));

describe("NotAuthorized Component", () => {
  const mockNavigate = jest.fn();

  beforeEach(() => {
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
    mockNavigate.mockClear();
  });

  it("renders title and description", () => {
    render(<NotAuthorized />);
    expect(
      screen.getByRole("heading", { name: "Not Authorized" })
    ).toBeInTheDocument();
    expect(
      screen.getByText("You are not authorized to access this page")
    ).toBeInTheDocument();
  });

  it("renders image", () => {
    render(<NotAuthorized />);
    const img = screen.getByAltText("Not Found") as HTMLImageElement;
    expect(img).toBeInTheDocument();
    expect(img.src).toContain("/mock-not-authorized.png");
  });

  it("renders 'Go Back' and 'Go to Home' buttons", () => {
    render(<NotAuthorized />);
    expect(screen.getByText("Go Back")).toBeInTheDocument();
    expect(screen.getByText("Go to Home")).toBeInTheDocument();
  });

  it("navigates -1 when 'Go Back' button is clicked", () => {
    render(<NotAuthorized />);
    fireEvent.click(screen.getByText("Go Back"));
    expect(mockNavigate).toHaveBeenCalledWith(-1);
  });

  it("navigates to home when 'Go to Home' button is clicked", () => {
    render(<NotAuthorized />);
    fireEvent.click(screen.getByText("Go to Home"));
    expect(mockNavigate).toHaveBeenCalledWith(ROUTES.ALL_APPS);
  });
  it("renders image with empty string when PageNotfound is falsy", () => {
    // Import the constants module to spy on it
    const constants = require("src/utils/common/constants");
    const originalPageNotfound = constants.PageNotfound;

    // Temporarily override the PageNotfound value
    Object.defineProperty(constants, "PageNotfound", {
      value: null,
      writable: true,
      configurable: true,
    });

    render(<NotAuthorized />);
    const img = screen.getByAltText("Not Found") as HTMLImageElement;
    expect(img).toBeInTheDocument();
    // When src is empty, browser resolves it to current page URL
    expect(img.getAttribute("src")).toBe("");

    // Restore the original value
    Object.defineProperty(constants, "PageNotfound", {
      value: originalPageNotfound,
      writable: true,
      configurable: true,
    });
  });
});
