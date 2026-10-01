import { renderHook, act } from "@testing-library/react";
import { useChangePasswordHelper } from "../changePasswordHelper";
import * as api from "src/apis/api";
import { showAlert } from "src/utils/alert";
import { fetchProfileDataRequest } from "src/containers/redux/slices/profile";

const mockDispatch = jest.fn();

jest.mock("react-redux", () => ({
  useDispatch: () => mockDispatch,
}));

jest.mock("src/apis/api", () => ({
  postDataApi: jest.fn(),
}));

jest.mock("src/utils/alert", () => ({
  showAlert: jest.fn(),
}));

describe("useChangePasswordHelper", () => {
  const onClose = jest.fn();
  const helpers = {
    resetForm: jest.fn(),
  } as any;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("refreshes profile after a successful password change", async () => {
    (api.postDataApi as jest.Mock).mockResolvedValue({
      success: true,
      statusCode: 200,
      message: "Password changed successfully",
    });

    const { result } = renderHook(() => useChangePasswordHelper(onClose));
    await act(async () => {
      await result.current.handleSubmit(
        {
          currentPassword: "oldpass",
          newPassword: "newpass1",
          confirmPassword: "newpass1",
        },
        helpers
      );
    });

    expect(api.postDataApi).toHaveBeenCalledWith({
      path: "api/user/change-password",
      data: {
        currentPassword: "oldpass",
        newPassword: "newpass1",
      },
    });
    expect(onClose).toHaveBeenCalled();
    expect(helpers.resetForm).toHaveBeenCalled();
    expect(mockDispatch).toHaveBeenCalledWith(fetchProfileDataRequest());
    expect(showAlert).toHaveBeenCalledWith(1, "Password changed successfully");
  });

  it("shows an error when the password change fails", async () => {
    (api.postDataApi as jest.Mock).mockRejectedValue(new Error("Nope"));
    const { result } = renderHook(() => useChangePasswordHelper(onClose));
    await act(async () => {
      await result.current.handleSubmit(
        {
          currentPassword: "oldpass",
          newPassword: "newpass1",
          confirmPassword: "newpass1",
        },
        helpers
      );
    });
    expect(showAlert).toHaveBeenCalledWith(2, "Nope");
    expect(onClose).not.toHaveBeenCalled();
  });
});
