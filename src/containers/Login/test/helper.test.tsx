import { renderHook, act } from "@testing-library/react";
import { useLoginHelper } from "../helper";
import { useDispatch } from "react-redux";
import {
  fetchAuthenticateToken,
  fetchAuthenticateTokenSuccess,
} from "src/containers/redux/slices/auth";
import { setLoading } from "src/redux/slices/globalSlice";
import { useLocation } from "react-router-dom";
import * as api from "src/apis/api";

jest.mock("react-redux", () => ({
  useDispatch: jest.fn(),
}));

jest.mock("src/containers/redux/slices/auth", () => ({
  fetchAuthenticateToken: jest.fn(),
  fetchAuthenticateTokenSuccess: jest.fn(),
}));

jest.mock("src/redux/slices/globalSlice", () => ({
  setLoading: jest.fn(),
}));

jest.mock("src/apis/api", () => ({
  postDataApi: jest.fn(),
}));

jest.mock("src/utils/alert", () => ({
  showAlert: jest.fn(),
}));

jest.mock("react-router-dom", () => ({
  useLocation: jest.fn(() => ({ state: null, search: "" })),
  useNavigate: () => mockNavigate,
}));

const mockDispatch = jest.fn();
const mockNavigate = jest.fn();

describe("useLoginHelper", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockNavigate.mockClear();
    (useDispatch as unknown as jest.Mock).mockReturnValue(mockDispatch);
    (useLocation as unknown as jest.Mock).mockReturnValue({
      state: null,
      search: "",
    });
    delete (window as any).location;
    window.location = {
      assign: jest.fn(),
      search: "",
    } as any;
    process.env.VITE_CLIENT_ID = "test_client_id";
    process.env.VITE_REDIRECT_URI = "http://localhost/callback";
  });

  it("should dispatch fetchAuthenticateToken and setLoading when code is present in URL", () => {
    const code = "1234";
    window.location.search = `?code=${code}`;

    (fetchAuthenticateToken as unknown as jest.Mock).mockReturnValue({
      type: "FETCH_TOKEN",
    });
    (setLoading as unknown as jest.Mock).mockReturnValue({
      type: "SET_LOADING",
    });

    renderHook(() => useLoginHelper());

    expect(setLoading).toHaveBeenCalledWith(true);
    expect(fetchAuthenticateToken).toHaveBeenCalledWith({ code });
    expect(mockDispatch).toHaveBeenCalledTimes(2);
  });

  it("should not dispatch anything if code is not present in URL", () => {
    window.location.search = "";

    renderHook(() => useLoginHelper());

    expect(setLoading).not.toHaveBeenCalled();
    expect(fetchAuthenticateToken).not.toHaveBeenCalled();
  });

  it("should call window.location.assign with correct GitHub OAuth URL on handleClick", () => {
    const { result } = renderHook(() => useLoginHelper());

    act(() => {
      result.current.handleClick();
    });

    const expectedUrl = `https://github.com/login/oauth/authorize?client_id=test_client_id&redirect_uri=http://localhost/callback&scope=${encodeURIComponent("user:email")}`;
    expect(window.location.assign).toHaveBeenCalledWith(expectedUrl);
  });

  it("persists the session after a successful email login", async () => {
    (api.postDataApi as jest.Mock).mockResolvedValue({
      success: true,
      message: "Successfully logged in",
      data: {
        userAuthToken: "token",
        userData: { email: "a@b.com" },
      },
    });
    (fetchAuthenticateTokenSuccess as unknown as jest.Mock).mockReturnValue({
      type: "AUTH_SUCCESS",
    });
    const helpers = { resetForm: jest.fn() } as any;
    const { result } = renderHook(() => useLoginHelper());

    await act(async () => {
      await result.current.handleEmailLogin(
        { email: "a@b.com", password: "secret1" },
        helpers
      );
    });

    expect(api.postDataApi).toHaveBeenCalledWith({
      path: "api/user/basic/login",
      data: { email: "a@b.com", password: "secret1" },
    });
    expect(helpers.resetForm).toHaveBeenCalled();
    expect(fetchAuthenticateTokenSuccess).toHaveBeenCalledWith({
      accessToken: "token",
      user: { email: "a@b.com" },
    });
  });

  it("prefills email from the navigation state", () => {
    (useLocation as unknown as jest.Mock).mockReturnValue({
      state: { email: "ada@example.com" },
      search: "",
    });
    const { result } = renderHook(() => useLoginHelper());
    expect(result.current.loginFormValues.email).toBe("ada@example.com");
  });

  it("navigates to forgot password with the typed email", () => {
    const { result } = renderHook(() => useLoginHelper());
    act(() => {
      result.current.handleForgotPassword("ada@example.com");
    });
    expect(mockNavigate).toHaveBeenCalledWith("/forgot-password", {
      state: { email: "ada@example.com" },
    });
  });
});
