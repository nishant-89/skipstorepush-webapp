import { renderHook, act } from "@testing-library/react";
import { useInviteHelper } from "../helper";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import * as api from "src/apis/api";
import * as alertUtils from "src/utils/alert";
import * as globalSlice from "src/redux/slices/globalSlice";
import ROUTES from "src/routes/routesPaths";
import { getErrorMessage } from "src/utils/common/constants";

jest.mock("react-redux", () => ({
  useDispatch: jest.fn(),
}));

jest.mock("react-router-dom", () => ({
  useNavigate: jest.fn(),
}));

jest.mock("src/apis/api", () => ({
  getDataApi: jest.fn(),
}));

jest.mock("src/utils/alert", () => ({
  showAlert: jest.fn(),
}));

jest.mock("src/utils/common/constants", () => ({
  ...jest.requireActual("src/utils/common/constants"),
  getErrorMessage: jest.fn(() => "Error"),
}));

describe("useInviteHelper", () => {
  const mockDispatch = jest.fn();
  const mockNavigate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useDispatch as unknown as jest.Mock).mockReturnValue(mockDispatch);
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
  });

  it("should call acceptInvite after successful checkInvite", async () => {
    const mockResponse = { statusCode: 200 };
    (api.getDataApi as jest.Mock)
      .mockResolvedValueOnce(mockResponse) // checkInvite
      .mockResolvedValueOnce({ statusCode: 200, message: "Invite accepted" }); // acceptInvite

    const { result } = renderHook(() => useInviteHelper("invite-id"));

    await act(async () => {
      await result.current.handleCheckInvite();
    });

    expect(api.getDataApi).toHaveBeenCalledWith({
      path: expect.stringContaining(
        "app-center/v1/users/check-invitation?invitationId=invite-id"
      ),
    });

    expect(api.getDataApi).toHaveBeenCalledWith({
      path: expect.stringContaining(
        "app-center/v1/users/accept-invitation?invitationId=invite-id"
      ),
    });

    expect(mockDispatch).toHaveBeenCalledWith(globalSlice.setLoading(false));
    expect(alertUtils.showAlert).toHaveBeenCalledWith(1, "Invite accepted");
    expect(mockNavigate).toHaveBeenCalledWith(ROUTES.ALL_APPS);
  });

  it("should handle error during checkInvite", async () => {
    (api.getDataApi as jest.Mock).mockRejectedValueOnce(new Error("Network"));

    const { result } = renderHook(() => useInviteHelper("invite-id"));

    await act(async () => {
      await result.current.handleCheckInvite();
    });

    expect(mockDispatch).toHaveBeenCalledWith(globalSlice.setLoading(false));
    expect(alertUtils.showAlert).toHaveBeenCalledWith(2, "Error");
    expect(mockNavigate).toHaveBeenCalledWith(ROUTES.ALL_APPS);
  });

  it("should handle error during acceptInvite", async () => {
    (api.getDataApi as jest.Mock)
      .mockResolvedValueOnce({ statusCode: 200 }) // checkInvite
      .mockRejectedValueOnce(new Error("Server down")); // acceptInvite

    const { result } = renderHook(() => useInviteHelper("invite-id"));

    await act(async () => {
      await result.current.handleCheckInvite();
    });

    expect(mockDispatch).toHaveBeenCalledWith(globalSlice.setLoading(false));
    expect(alertUtils.showAlert).toHaveBeenCalledWith(2, "Error");
    expect(mockNavigate).toHaveBeenCalledWith(ROUTES.ALL_APPS);
  });

  it("should not proceed to acceptInvite if checkInvite response is not 200", async () => {
    (api.getDataApi as jest.Mock).mockResolvedValueOnce({ statusCode: 400 });

    const { result } = renderHook(() => useInviteHelper("invite-id"));

    await act(async () => {
      await result.current.handleCheckInvite();
    });

    expect(api.getDataApi).toHaveBeenCalledTimes(1); // only checkInvite called
    expect(mockDispatch).not.toHaveBeenCalledWith(
      globalSlice.setLoading(false)
    ); // no further action
  });

  it("should show default error message if getErrorMessage returns undefined in handleCheckInvite", async () => {
    (api.getDataApi as jest.Mock).mockRejectedValueOnce(new Error("error"));
    (getErrorMessage as jest.Mock).mockReturnValue(undefined);

    const { result } = renderHook(() => useInviteHelper("invite-id"));

    await act(async () => {
      await result.current.handleCheckInvite();
    });

    expect(alertUtils.showAlert).toHaveBeenCalledWith(2, "Error");
  });
  it("should show default error message if getErrorMessage returns undefined in handleAcceptInvite", async () => {
    // Make checkInvite return 200 so acceptInvite is triggered
    (api.getDataApi as jest.Mock)
      .mockResolvedValueOnce({ statusCode: 200 }) // checkInvite
      .mockRejectedValueOnce(new Error("error")); // acceptInvite
    (getErrorMessage as jest.Mock).mockReturnValue(undefined);

    const { result } = renderHook(() => useInviteHelper("invite-id"));

    await act(async () => {
      await result.current.handleCheckInvite();
    });

    expect(alertUtils.showAlert).toHaveBeenCalledWith(2, "Error");
  });
});
