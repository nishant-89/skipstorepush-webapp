import { render, screen, fireEvent } from "@testing-library/react";
import NotFound from "./index";
import { useNavigate } from "react-router-dom";
import ROUTES from "src/routes/routesPaths";

// Mock dependencies
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: jest.fn(),
}));

jest.mock("src/utils/common/constants", () => ({
  notFound: "/mock-not-found-image.png",
}));

interface MockButtonProps {
  label: string;
  onClick?: () => void;
  disabled?: boolean;
}

jest.mock("../../common/Button", () => (props: MockButtonProps) => {
  const { label, onClick } = props;
  return (
    <button onClick={onClick} data-testid={`button-${label}`}>
      {label}
    </button>
  );
});

describe("NotFound Component", () => {
  const mockNavigate = jest.fn();

  beforeEach(() => {
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
    mockNavigate.mockClear();
  });

  it("renders heading and description", () => {
    render(<NotFound />);
    expect(
      screen.getByRole("heading", { name: "Page Not Found" })
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "The page you are looking for doesn't exist or has been moved."
      )
    ).toBeInTheDocument();
  });

  it("renders not found image", () => {
    render(<NotFound />);
    const img = screen.getByAltText("Not Found") as HTMLImageElement;
    expect(img).toBeInTheDocument();
    expect(img.src).toContain("/mock-not-found-image.png");
  });

  it("renders both buttons", () => {
    render(<NotFound />);
    expect(screen.getByText("Go Back")).toBeInTheDocument();
    expect(screen.getByText("Go to All Apps")).toBeInTheDocument();
  });

  it("calls navigate(-1) on 'Go Back' click", () => {
    render(<NotFound />);
    fireEvent.click(screen.getByText("Go Back"));
    expect(mockNavigate).toHaveBeenCalledWith(-1);
  });

  it("calls navigate to ALL_APPS on 'Go to All Apps' click", () => {
    render(<NotFound />);
    fireEvent.click(screen.getByText("Go to All Apps"));
    expect(mockNavigate).toHaveBeenCalledWith(ROUTES.ALL_APPS);
  });
});
