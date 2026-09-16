import { render, screen } from "@testing-library/react";
import PageNotFound from "./index";

// Mock the constants and Button component
jest.mock("src/utils/common/constants", () => ({
  PageNotfound: "/mock-404-image.png",
}));

interface MockButtonProps {
  label: string;
  onClick?: () => void;
  disabled?: boolean;
}

jest.mock("src/components/common/Button", () => (props: MockButtonProps) => {
  const { label } = props;
  return <button data-testid={`button-${label}`}>{label}</button>;
});

describe("PageNotFound Component", () => {
  it("renders heading and description", () => {
    render(<PageNotFound />);
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
    render(<PageNotFound />);
    const img = screen.getByAltText("Not found") as HTMLImageElement;
    expect(img).toBeInTheDocument();
    expect(img.src).toContain("/mock-404-image.png");
  });

  it("renders both buttons", () => {
    render(<PageNotFound />);
    expect(screen.getByTestId("button-Go Back")).toBeInTheDocument();
    expect(screen.getByTestId("button-Go to Home")).toBeInTheDocument();
  });
});
