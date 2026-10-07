import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import LoginComponent from "../Login";
import { useLoginHelper } from "../helper";

jest.mock("src/utils/common/constants/constants", () => ({
  skipstore: "logo.png",
  GithubIcon: () => <svg data-testid="github-icon" />,
}));

jest.mock("src/components/common/ThemeToggle/ThemeToggle", () => ({
  __esModule: true,
  default: () => <button type="button" aria-label="Switch to light theme" />,
}));

interface MockButtonProps {
  label: string;
  onClick?: () => void;
  icon?: React.ElementType;
  type?: string;
}

jest.mock("src/components/common/Button/Button", () => ({
  __esModule: true,
  default: ({ label, onClick, icon: Icon, type }: MockButtonProps) => (
    <button type={type === "submit" ? "submit" : "button"} onClick={onClick}>
      {Icon && <Icon />}
      {label}
    </button>
  ),
}));

const mockHandleClick = jest.fn();
const mockHandleEmailLogin = jest.fn();
const mockHandleForgotPassword = jest.fn();
jest.mock("../helper", () => {
  const actual = jest.requireActual("../helper");
  return {
    ...actual,
    useLoginHelper: jest.fn(),
  };
});

describe("LoginComponent", () => {
  beforeEach(() => {
    (useLoginHelper as jest.Mock).mockReturnValue({
      handleClick: mockHandleClick,
      handleEmailLogin: mockHandleEmailLogin,
      handleForgotPassword: mockHandleForgotPassword,
      loginFormValues: { email: "", password: "" },
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const renderLogin = () =>
    render(
      <MemoryRouter>
        <LoginComponent />
      </MemoryRouter>
    );

  it("renders logo, heading, and description", () => {
    renderLogin();
    expect(screen.getByAltText("skipstore")).toHaveAttribute("src", "logo.png");
    expect(screen.getByRole("heading", { name: "Sign in" })).toBeInTheDocument();
    expect(
      screen.getByText("Use your email and password, or continue with GitHub.")
    ).toBeInTheDocument();
  });

  it("renders email login fields and GitHub button", () => {
    renderLogin();
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Sign in" })).toBeInTheDocument();
    expect(screen.getByText("Continue with GitHub")).toBeInTheDocument();
    expect(screen.getByText("Forgot password")).toBeInTheDocument();
    expect(screen.getByText("Register new user")).toBeInTheDocument();
  });

  it("calls handleClick when GitHub button is clicked", () => {
    renderLogin();
    fireEvent.click(screen.getByText("Continue with GitHub"));
    expect(mockHandleClick).toHaveBeenCalledTimes(1);
  });

  it("calls handleForgotPassword when forgot password is clicked", () => {
    renderLogin();
    fireEvent.click(screen.getByText("Forgot password"));
    expect(mockHandleForgotPassword).toHaveBeenCalledTimes(1);
  });

  it("renders footer text correctly", () => {
    renderLogin();
    expect(
      screen.getByText(/© Copyright 2026 skipstorepush.tech/i)
    ).toBeInTheDocument();
  });
});
