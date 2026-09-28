import { renderHook, act } from "@testing-library/react";
import { PENDING_VERIFY_EMAIL_KEY, useRegisterHelper } from "../helper";
import * as api from "src/apis/api";
import { showAlert } from "src/utils/alert";

const mockDispatch = jest.fn();
const mockNavigate = jest.fn();

jest.mock("react-redux", () => ({
  useDispatch: () => mockDispatch,
}));

jest.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
}));

jest.mock("src/apis/api", () => ({
  postDataApi: jest.fn(),
}));

jest.mock("src/utils/alert", () => ({
  showAlert: jest.fn(),
}));

describe("useRegisterHelper", () => {
  const helpers = { resetForm: jest.fn() } as any;

  beforeEach(() => {
    jest.clearAllMocks();
    sessionStorage.clear();
  });

  it("registers a user and moves to the OTP step", async () => {
    (api.postDataApi as jest.Mock).mockResolvedValue({
      success: true,
      message: "User registered successfully. Please verify your email.",
    });
    const { result } = renderHook(() => useRegisterHelper());

    await act(async () => {
      await result.current.handleRegister(
        {
          fullName: "Ada",
          email: "ada@example.com",
          password: "secret1",
          confirmPassword: "secret1",
        },
        helpers
      );
    });

    expect(api.postDataApi).toHaveBeenCalledWith({
      path: "api/user/register",
      data: {
        fullName: "Ada",
        email: "ada@example.com",
        password: "secret1",
      },
    });
    expect(result.current.step).toBe("otp");
    expect(result.current.pendingEmail).toBe("ada@example.com");
    expect(sessionStorage.getItem(PENDING_VERIFY_EMAIL_KEY)).toBe(
      "ada@example.com"
    );
  });

  it("verifies the OTP and sends the user back to login", async () => {
    sessionStorage.setItem(PENDING_VERIFY_EMAIL_KEY, "ada@example.com");
    (api.postDataApi as jest.Mock).mockResolvedValue({
      success: true,
      message: "OTP verified successfully.",
    });
    const { result } = renderHook(() => useRegisterHelper());

    await act(async () => {
      await result.current.handleVerifyOtp({ otp: "123456" }, helpers);
    });

    expect(api.postDataApi).toHaveBeenCalledWith({
      path: "api/user/verify-otp",
      data: { email: "ada@example.com", otp: 123456 },
    });
    expect(mockNavigate).toHaveBeenCalledWith("/login", {
      state: { email: "ada@example.com" },
    });
    expect(sessionStorage.getItem(PENDING_VERIFY_EMAIL_KEY)).toBeNull();
  });

  it("resends an OTP to the pending email", async () => {
    sessionStorage.setItem(PENDING_VERIFY_EMAIL_KEY, "ada@example.com");
    (api.postDataApi as jest.Mock).mockResolvedValue({
      success: true,
      message: "OTP sent successfully.",
    });
    const { result } = renderHook(() => useRegisterHelper());

    await act(async () => {
      await result.current.handleResendOtp();
    });

    expect(api.postDataApi).toHaveBeenCalledWith({
      path: "api/user/send-otp",
      data: { email: "ada@example.com" },
    });
    expect(showAlert).toHaveBeenCalledWith(1, "OTP sent successfully.");
    expect(result.current.otpNonce).toBe(1);
  });

  it("keeps name and passwords when switching back to a different email", async () => {
    (api.postDataApi as jest.Mock).mockResolvedValue({ success: true });
    const { result } = renderHook(() => useRegisterHelper());

    await act(async () => {
      await result.current.handleRegister(
        {
          fullName: "Ada",
          email: "ada@example.com",
          password: "secret1",
          confirmPassword: "secret1",
        },
        helpers
      );
    });

    act(() => {
      result.current.handleUseDifferentEmail();
    });

    expect(result.current.step).toBe("form");
    expect(result.current.savedFormValues).toEqual({
      fullName: "Ada",
      email: "",
      password: "secret1",
      confirmPassword: "secret1",
    });
  });
});
