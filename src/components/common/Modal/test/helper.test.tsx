import { renderHook, act } from "@testing-library/react";
import { useModalHelper } from "../helper";
import * as reactRedux from "react-redux";
import * as reactRouterDom from "react-router-dom";
import * as api from "src/apis/api";
import * as alertUtils from "src/utils/alert";
import * as constants from "src/utils/common/constants";
import * as authSlice from "src/containers/redux/slices/auth";
import * as globalSlice from "src/redux/slices/globalSlice";
import ROUTES from "src/routes/routesPaths";

jest.mock("react-redux", () => ({ useDispatch: jest.fn() }));
jest.mock("react-router-dom", () => ({ useNavigate: jest.fn() }));
jest.mock("src/apis/api", () => ({ postDataApi: jest.fn() }));
jest.mock("src/utils/alert", () => ({ showAlert: jest.fn() }));
jest.mock("src/utils/common/constants", () => ({
  ...jest.requireActual("src/utils/common/constants"),
  getErrorMessage: jest.fn(),
}));

const mockDispatch = jest.fn();
const mockNavigate = jest.fn();

describe("useModalHelper", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (reactRedux.useDispatch as unknown as jest.Mock).mockReturnValue(
      mockDispatch
    );
    (reactRouterDom.useNavigate as unknown as jest.Mock).mockReturnValue(
      mockNavigate
    );
  });

  it("should format remaining time correctly", () => {
    const { result } = renderHook(() => useModalHelper());
    expect(result.current.formatRemainingTime(65000)).toBe("01:05");
    expect(result.current.formatRemainingTime(0)).toBe("00:00");
    expect(result.current.formatRemainingTime(125000)).toBe("02:05");
  });

  it("should logout user successfully", async () => {
    const fakeResponse = { statusCode: 200, data: { message: "Logged out" } };
    (api.postDataApi as jest.Mock).mockResolvedValue(fakeResponse);
    const resetAccessTokenSpy = jest.spyOn(authSlice, "resetAccessToken");
    const setLoadingSpy = jest.spyOn(globalSlice, "setLoading");
    const showAlertSpy = jest.spyOn(alertUtils, "showAlert");
    const removeItemSpy = jest.spyOn(
      window.localStorage.__proto__,
      "removeItem"
    );

    const { result } = renderHook(() => useModalHelper());
    await act(async () => {
      await result.current.logoutUser();
    });
    expect(setLoadingSpy).toHaveBeenCalledWith(true);
    expect(api.postDataApi).toHaveBeenCalledWith({
      path: constants.apiRoutes.Logout,
    });
    expect(removeItemSpy).toHaveBeenCalledWith("persist:root");
    expect(resetAccessTokenSpy).toHaveBeenCalled();
    expect(showAlertSpy).toHaveBeenCalledWith(1, "Logged out");
    expect(mockNavigate).toHaveBeenCalledWith(ROUTES.LOGIN);
    expect(setLoadingSpy).toHaveBeenCalledWith(false);
  });

  it("should handle logout error", async () => {
    const error = new Error("Logout failed");
    (api.postDataApi as jest.Mock).mockRejectedValue(error);
    const setLoadingSpy = jest.spyOn(globalSlice, "setLoading");
    const showAlertSpy = jest.spyOn(alertUtils, "showAlert");
    (constants.getErrorMessage as jest.Mock).mockReturnValue("Logout failed");

    const { result } = renderHook(() => useModalHelper());
    await act(async () => {
      await result.current.logoutUser();
    });
    expect(setLoadingSpy).toHaveBeenCalledWith(true);
    expect(setLoadingSpy).toHaveBeenCalledWith(false);
    expect(showAlertSpy).toHaveBeenCalledWith(2, "Logout failed");
  });
});
