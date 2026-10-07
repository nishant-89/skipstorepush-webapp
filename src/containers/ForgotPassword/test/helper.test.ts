import { renderHook, act } from "@testing-library/react";
import { PENDING_RESET_EMAIL_KEY, useForgotPasswordHelper } from "../helper";
import * as api from "src/apis/api";
import { showAlert } from "src/utils/alert";

const mockDispatch = jest.fn();
const mockNavigate = jest.fn();
const mockLocation = { state: null as { email?: string } | null };

jest.mock("react-redux", () => ({
  useDispatch: () => mockDispatch,
}));

jest.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
  useLocation: () => mockLocation,
}));

jest.mock("src/apis/api", () => ({
  postDataApi: jest.fn(),
}));

jest.mock("src/utils/alert", () => ({
  showAlert: jest.fn(),
}));

describe("useForgotPasswordHelper", () => {
  const helpers = { resetForm: jest.fn() } as any;

  beforeEach(() => {
    jest.clearAllMocks();
    sessionStorage.clear();
    mockLocation.state = null;
  });

  it("requests a reset OTP and moves to the reset step", async () => {
    (api.postDataApi as jest.Mock).mockResolvedValue({
      success: true,
      message: "OTP sent successfully.",
    });
    const { result } = renderHook(() => useForgotPasswordHelper());

    await act(async () => {
      await result.current.handleRequestOtp(
        { email: "ada@example.com" },
        helpers
      );
    });

    expect(api.postDataApi).toHaveBeenCalledWith({
      path: "api/user/forgot-password",
      data: { email: "ada@example.com" },
    });
    expect(result.current.step).toBe("reset");
    expect(result.current.pendingEmail).toBe("ada@example.com");
    expect(sessionStorage.getItem(PENDING_RESET_EMAIL_KEY)).toBe(
      "ada@example.com"
    );
  });

  it("resets the password and returns to login", async () => {
    sessionStorage.setItem(PENDING_RESET_EMAIL_KEY, "ada@example.com");
    (api.postDataApi as jest.Mock).mockResolvedValue({
      success: true,
      message: "Password reset successfully",
    });
    const { result } = renderHook(() => useForgotPasswordHelper());

    await act(async () => {
      await result.current.handleResetPassword(
        {
          otp: "123456",
          newPassword: "newpass1",
          confirmPassword: "newpass1",
        },
        helpers
      );
    });

    expect(api.postDataApi).toHaveBeenCalledWith({
      path: "api/user/forgot-password/verify",
      data: {
        email: "ada@example.com",
        otp: 123456,
        newPassword: "newpass1",
      },
    });
    expect(mockNavigate).toHaveBeenCalledWith("/login", {
      state: { email: "ada@example.com" },
    });
    expect(sessionStorage.getItem(PENDING_RESET_EMAIL_KEY)).toBeNull();
  });

  it("resends a reset OTP", async () => {
    sessionStorage.setItem(PENDING_RESET_EMAIL_KEY, "ada@example.com");
    (api.postDataApi as jest.Mock).mockResolvedValue({
      success: true,
      message: "OTP sent successfully.",
    });
    const { result } = renderHook(() => useForgotPasswordHelper());

    await act(async () => {
      await result.current.handleResendOtp();
    });

    expect(api.postDataApi).toHaveBeenCalledWith({
      path: "api/user/forgot-password/resend",
      data: { email: "ada@example.com" },
    });
    expect(showAlert).toHaveBeenCalledWith(1, "OTP sent successfully.");
    expect(result.current.otpNonce).toBe(1);
  });
});
