import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import ForgotPassword from "../ForgotPassword";
import { useForgotPasswordHelper } from "../helper";

jest.mock("src/utils/common/constants/constants", () => ({
  skipstore: "logo.png",
}));

jest.mock("src/components/common/ThemeToggle/ThemeToggle", () => ({
  __esModule: true,
  default: () => <button type="button" aria-label="Switch to light theme" />,
}));

jest.mock("src/components/common/Button/Button", () => ({
  __esModule: true,
  default: ({
    label,
    onClick,
    type,
  }: {
    label: string;
    onClick?: () => void;
    type?: string;
  }) => (
    <button type={type === "submit" ? "submit" : "button"} onClick={onClick}>
      {label}
    </button>
  ),
}));

jest.mock("../helper", () => {
  const actual = jest.requireActual("../helper");
  return {
    ...actual,
    useForgotPasswordHelper: jest.fn(),
  };
});

describe("ForgotPassword", () => {
  const mockHandleRequestOtp = jest.fn();
  const mockHandleResetPassword = jest.fn();
  const mockHandleResendOtp = jest.fn();
  const mockHandleUseDifferentEmail = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders the email request form", () => {
    (useForgotPasswordHelper as jest.Mock).mockReturnValue({
      step: "email",
      pendingEmail: "",
      savedEmail: "",
      otpNonce: 0,
      handleRequestOtp: mockHandleRequestOtp,
      handleResetPassword: mockHandleResetPassword,
      handleResendOtp: mockHandleResendOtp,
      handleUseDifferentEmail: mockHandleUseDifferentEmail,
    });

    render(
      <MemoryRouter>
        <ForgotPassword />
      </MemoryRouter>
    );

    expect(screen.getByText("Forgot password")).toBeInTheDocument();
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByText("Send code")).toBeInTheDocument();
    expect(screen.getByText("Sign in")).toBeInTheDocument();
  });

  it("renders the reset step and resends the code", () => {
    (useForgotPasswordHelper as jest.Mock).mockReturnValue({
      step: "reset",
      pendingEmail: "user@example.com",
      savedEmail: "user@example.com",
      otpNonce: 0,
      handleRequestOtp: mockHandleRequestOtp,
      handleResetPassword: mockHandleResetPassword,
      handleResendOtp: mockHandleResendOtp,
      handleUseDifferentEmail: mockHandleUseDifferentEmail,
    });

    render(
      <MemoryRouter>
        <ForgotPassword />
      </MemoryRouter>
    );

    expect(screen.getByRole("heading", { name: "Reset password" })).toBeInTheDocument();
    expect(screen.getByText("user@example.com")).toBeInTheDocument();
    expect(screen.getAllByLabelText(/Digit \d/)).toHaveLength(6);
    expect(screen.getByLabelText("New password")).toBeInTheDocument();
    fireEvent.click(screen.getByText("Resend OTP"));
    expect(mockHandleResendOtp).toHaveBeenCalledTimes(1);
    fireEvent.click(screen.getByText("Use a different email"));
    expect(mockHandleUseDifferentEmail).toHaveBeenCalledTimes(1);
  });
});
