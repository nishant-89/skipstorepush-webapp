import { render, screen, fireEvent } from "@testing-library/react";
import LoginComponent from "../index"; // adjust the path if needed
import { useLoginHelper } from "../helper";

// Mock external imports
jest.mock("src/utils/common/constants", () => ({
  skipstore: "logo.png",
  GithubIcon: () => <svg data-testid="github-icon" />,
}));

interface MockButtonProps {
  label: string;
  onClick?: () => void;
  icon?: React.ElementType;
}

jest.mock("src/components/common/Button", () => ({
  __esModule: true,
  default: ({ label, onClick, icon: Icon }: MockButtonProps) => (
    <button onClick={onClick}>
      {Icon && <Icon />}
      {label}
    </button>
  ),
}));

// Mock the useLoginHelper hook
const mockHandleClick = jest.fn();
jest.mock("../helper", () => ({
  useLoginHelper: jest.fn(),
}));

describe("LoginComponent", () => {
  beforeEach(() => {
    (useLoginHelper as jest.Mock).mockReturnValue({
      handleClick: mockHandleClick,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders logo, heading, and description", () => {
    render(<LoginComponent />);
    expect(screen.getByAltText("skipstore")).toHaveAttribute("src", "logo.png");
    expect(screen.getByText("Create Account or Sign In")).toBeInTheDocument();
    expect(
      screen.getByText("Log in with one of these services to get started.")
    ).toBeInTheDocument();
  });

  it("renders GitHub button with icon and label", () => {
    render(<LoginComponent />);
    expect(screen.getByText("Continue with GitHub")).toBeInTheDocument();
    expect(screen.getByTestId("github-icon")).toBeInTheDocument();
  });

  it("calls handleClick when GitHub button is clicked", () => {
    render(<LoginComponent />);
    const button = screen.getByText("Continue with GitHub");
    fireEvent.click(button);
    expect(mockHandleClick).toHaveBeenCalledTimes(1);
  });

  it("renders footer text correctly", () => {
    render(<LoginComponent />);
    expect(
      screen.getByText(/© Copyright 2026 skipstorepush.tech/i)
    ).toBeInTheDocument();
  });
});
