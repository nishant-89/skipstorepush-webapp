import { render, screen, fireEvent } from "@testing-library/react";
import NoInternetFound from "./index";

interface MockButtonProps {
  label: string;
  onClick: () => void;
}

// Mock Button component
jest.mock("src/components/common/Button", () => (props: MockButtonProps) => {
  const { label, onClick } = props;
  return (
    <button onClick={onClick} data-testid="mock-button">
      {label}
    </button>
  );
});

describe("NoInternetFound Component", () => {
  const mockReload = jest.fn();

  beforeEach(() => {
    // Mock window.location.reload
    Object.defineProperty(window, "location", {
      value: {
        reload: mockReload,
      },
      writable: true,
    });

    // Clear mocks and localStorage before each test
    mockReload.mockClear();
    localStorage.clear();
  });

  it("renders heading and description", () => {
    render(<NoInternetFound />);
    expect(
      screen.getByRole("heading", { name: /No Internet Connection/i })
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        /It seems that you have lost your internet network. Please refresh to continue/i
      )
    ).toBeInTheDocument();
  });

  it("renders the image with localStorage src", () => {
    localStorage.setItem("noInternetImage", "/mock-no-internet.png");
    render(<NoInternetFound />);
    const img = screen.getByAltText("No Internet") as HTMLImageElement;
    expect(img).toBeInTheDocument();
    expect(img.src).toContain("/mock-no-internet.png");
  });

  it("renders image with empty src when localStorage is empty", () => {
    render(<NoInternetFound />);
    const img = screen.getByAltText("No Internet") as HTMLImageElement;
    expect(img).toBeInTheDocument();
  });

  it("renders Refresh button", () => {
    render(<NoInternetFound />);
    expect(screen.getByRole("button", { name: "Refresh" })).toBeInTheDocument();
  });

  it("calls window.location.reload when Refresh is clicked", () => {
    render(<NoInternetFound />);
    fireEvent.click(screen.getByRole("button", { name: "Refresh" }));
    expect(mockReload).toHaveBeenCalledTimes(1);
  });
});
