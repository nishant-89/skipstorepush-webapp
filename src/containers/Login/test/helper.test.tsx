import { renderHook, act } from "@testing-library/react";
import { useLoginHelper } from "../helper"; // adjust the path if needed
import { useDispatch } from "react-redux";
import { fetchAuthenticateToken } from "src/containers/redux/slices/auth";
import { setLoading } from "src/redux/slices/globalSlice";

jest.mock("react-redux", () => ({
  useDispatch: jest.fn(),
}));

jest.mock("src/containers/redux/slices/auth", () => ({
  fetchAuthenticateToken: jest.fn(),
}));

jest.mock("src/redux/slices/globalSlice", () => ({
  setLoading: jest.fn(),
}));

const mockDispatch = jest.fn();

describe("useLoginHelper", () => {
  beforeEach(() => {
    (useDispatch as unknown as jest.Mock).mockReturnValue(mockDispatch);
    jest.clearAllMocks();
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
    expect(mockDispatch).not.toHaveBeenCalled();
  });

  it("should call window.location.assign with correct GitHub OAuth URL on handleClick", () => {
    const { result } = renderHook(() => useLoginHelper());

    act(() => {
      result.current.handleClick();
    });

    const expectedUrl = `https://github.com/login/oauth/authorize?client_id=test_client_id&redirect_uri=http://localhost/callback&scope=${encodeURIComponent("user:email")}`;
    expect(window.location.assign).toHaveBeenCalledWith(expectedUrl);
  });
});
