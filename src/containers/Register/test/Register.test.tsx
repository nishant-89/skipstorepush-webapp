import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Register from "../Register";
import { useRegisterHelper } from "../helper";

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
    useRegisterHelper: jest.fn(),
  };
});

describe("Register", () => {
  const mockHandleRegister = jest.fn();
  const mockHandleVerifyOtp = jest.fn();
  const mockHandleResendOtp = jest.fn();
  const mockHandleUseDifferentEmail = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders the registration form", () => {
    (useRegisterHelper as jest.Mock).mockReturnValue({
      step: "form",
      pendingEmail: "",
      savedFormValues: {
        fullName: "",
        email: "",
        password: "",
        confirmPassword: "",
      },
      otpNonce: 0,
      handleRegister: mockHandleRegister,
      handleVerifyOtp: mockHandleVerifyOtp,
      handleResendOtp: mockHandleResendOtp,
      handleUseDifferentEmail: mockHandleUseDifferentEmail,
    });

    render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    );

    expect(screen.getByText("Create account")).toBeInTheDocument();
    expect(screen.getByLabelText("Full name")).toBeInTheDocument();
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByText("Register")).toBeInTheDocument();
    expect(screen.getByText("Sign in")).toBeInTheDocument();
  });

  it("renders the OTP step and resends the code", () => {
    (useRegisterHelper as jest.Mock).mockReturnValue({
      step: "otp",
      pendingEmail: "user@example.com",
      savedFormValues: {
        fullName: "Ada",
        email: "user@example.com",
        password: "secret1",
        confirmPassword: "secret1",
      },
      otpNonce: 0,
      handleRegister: mockHandleRegister,
      handleVerifyOtp: mockHandleVerifyOtp,
      handleResendOtp: mockHandleResendOtp,
      handleUseDifferentEmail: mockHandleUseDifferentEmail,
    });

    render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    );

    expect(screen.getByText("Verify your email")).toBeInTheDocument();
    expect(screen.getByText(/Enter the 6-digit code sent to/)).toBeInTheDocument();
    expect(screen.getByText("user@example.com")).toBeInTheDocument();
    fireEvent.click(screen.getByText("Resend OTP"));
    expect(mockHandleResendOtp).toHaveBeenCalledTimes(1);
    expect(screen.getAllByLabelText(/Digit \d/)).toHaveLength(6);
    fireEvent.click(screen.getByText("Use a different email"));
    expect(mockHandleUseDifferentEmail).toHaveBeenCalledTimes(1);
  });
});
