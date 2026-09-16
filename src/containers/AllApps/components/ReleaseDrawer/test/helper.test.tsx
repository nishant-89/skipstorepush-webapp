import { renderHook, act } from "@testing-library/react";
import { useReleaseDrawerHelper } from "../helper";
import { postDataApi } from "src/apis/api";
import { showAlert } from "src/utils/alert";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setLoading } from "src/redux/slices/globalSlice";
import { handleRefresh } from "src/containers/redux/slices/release";
import { getErrorMessage } from "src/utils/common/constants";

// Mocks
jest.mock("src/apis/api", () => ({
  postDataApi: jest.fn(),
}));
jest.mock("src/utils/alert", () => ({
  showAlert: jest.fn(),
}));
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useParams: jest.fn(),
}));
jest.mock("react-redux", () => ({
  useDispatch: jest.fn(),
  useSelector: jest.fn(),
}));
jest.mock("src/utils/common/constants", () => ({
  ...jest.requireActual("src/utils/common/constants"),
  getErrorMessage: jest.fn(),
}));

const mockDispatch = jest.fn();
const mockOnClose = jest.fn();

describe("useReleaseDrawerHelper", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useDispatch as unknown as jest.Mock).mockReturnValue(mockDispatch);
    (useSelector as unknown as jest.Mock).mockReturnValue({ isRefresh: false });
    (useParams as jest.Mock).mockReturnValue({ id: "123" });
    (getErrorMessage as jest.Mock).mockReturnValue("Error message");
  });

  it("should initialize with newDeployment as true", () => {
    const { result } = renderHook(() =>
      useReleaseDrawerHelper({ onClose: mockOnClose })
    );
    expect(result.current.newDeployment).toBe(true);
  });

  it("should set newDeployment to false on handleAddNewDeployment", () => {
    const { result } = renderHook(() =>
      useReleaseDrawerHelper({ onClose: mockOnClose })
    );

    act(() => {
      result.current.handleAddNewDeployment();
    });

    expect(result.current.newDeployment).toBe(false);
  });

  it("should handle drawer close when formRef is null", () => {
    const { result } = renderHook(() =>
      useReleaseDrawerHelper({ onClose: mockOnClose })
    );

    act(() => {
      result.current.handleDrawerClose();
    });

    expect(mockOnClose).toHaveBeenCalled();
    expect(result.current.newDeployment).toBe(true);
  });

  it("should handle drawer close when formRef has resetForm method", () => {
    // Since formRef is an internal implementation detail not exposed by the hook,
    // we can only test the public behavior. The formRef would be set by Formik in actual usage.
    const { result } = renderHook(() =>
      useReleaseDrawerHelper({ onClose: mockOnClose })
    );

    // Set newDeployment to false first to test the reset behavior
    act(() => {
      result.current.handleAddNewDeployment();
    });
    expect(result.current.newDeployment).toBe(false);

    // Test that handleDrawerClose properly resets state and calls onClose
    act(() => {
      result.current.handleDrawerClose();
    });

    expect(mockOnClose).toHaveBeenCalled();
    expect(result.current.newDeployment).toBe(true);
  });

  it("should not submit when id is undefined", async () => {
    (useParams as jest.Mock).mockReturnValue({ id: undefined });

    const { result } = renderHook(() =>
      useReleaseDrawerHelper({ onClose: mockOnClose })
    );

    await act(async () => {
      await result.current.handleSubmit({ name: "Production" });
    });

    expect(mockDispatch).not.toHaveBeenCalledWith(setLoading(true));
    expect(postDataApi).not.toHaveBeenCalled();
  });

  it("should trim name before submitting", async () => {
    const mockResponse = {
      statusCode: 201,
      message: "Environment added",
    };
    (postDataApi as jest.Mock).mockResolvedValueOnce(mockResponse);

    const { result } = renderHook(() =>
      useReleaseDrawerHelper({ onClose: mockOnClose })
    );

    await act(async () => {
      await result.current.handleSubmit({ name: "  Production  " });
    });

    expect(postDataApi).toHaveBeenCalledWith({
      path: "app-center/v1/apps/environment",
      data: { name: "Production", appId: "123" },
    });
  });

  it("should submit form and call API with success flow", async () => {
    const mockResponse = {
      statusCode: 201,
      message: "Environment added",
    };
    (postDataApi as jest.Mock).mockResolvedValueOnce(mockResponse);

    const { result } = renderHook(() =>
      useReleaseDrawerHelper({ onClose: mockOnClose })
    );

    await act(async () => {
      await result.current.handleSubmit({ name: "Production" });
    });

    expect(mockDispatch).toHaveBeenCalledWith(setLoading(true));
    expect(postDataApi).toHaveBeenCalledWith({
      path: "app-center/v1/apps/environment",
      data: { name: "Production", appId: "123" },
    });
    expect(mockDispatch).toHaveBeenCalledWith(setLoading(false));
    expect(mockDispatch).toHaveBeenCalledWith(handleRefresh(true));
    expect(showAlert).toHaveBeenCalledWith(1, mockResponse.message);
    expect(mockOnClose).toHaveBeenCalled();
  });

  it("should handle API response with non-201 status code", async () => {
    const mockResponse = {
      statusCode: 400,
      message: "Bad request",
    };
    (postDataApi as jest.Mock).mockResolvedValueOnce(mockResponse);

    const { result } = renderHook(() =>
      useReleaseDrawerHelper({ onClose: mockOnClose })
    );

    await act(async () => {
      await result.current.handleSubmit({ name: "Production" });
    });

    expect(mockDispatch).toHaveBeenCalledWith(setLoading(true));
    expect(postDataApi).toHaveBeenCalled();
    // Should not call success handlers for non-201 status
    expect(mockDispatch).not.toHaveBeenCalledWith(handleRefresh(true));
    expect(showAlert).not.toHaveBeenCalledWith(1, mockResponse.message);
    expect(mockOnClose).not.toHaveBeenCalled();
  });

  it("should handle API failure and show error alert", async () => {
    const error = new Error("Network error");
    (postDataApi as jest.Mock).mockRejectedValueOnce(error);
    (getErrorMessage as jest.Mock).mockReturnValue("Custom error message");

    const { result } = renderHook(() =>
      useReleaseDrawerHelper({ onClose: mockOnClose })
    );

    await act(async () => {
      await result.current.handleSubmit({ name: "Invalid" });
    });

    expect(mockDispatch).toHaveBeenCalledWith(setLoading(true));
    expect(mockDispatch).toHaveBeenCalledWith(setLoading(false));
    expect(getErrorMessage).toHaveBeenCalledWith(error);
    expect(showAlert).toHaveBeenCalledWith(2, "Custom error message");
  });

  it("should work with isRefresh true state", async () => {
    (useSelector as unknown as jest.Mock).mockReturnValue({ isRefresh: true });
    const mockResponse = {
      statusCode: 201,
      message: "Environment added",
    };
    (postDataApi as jest.Mock).mockResolvedValueOnce(mockResponse);

    const { result } = renderHook(() =>
      useReleaseDrawerHelper({ onClose: mockOnClose })
    );

    await act(async () => {
      await result.current.handleSubmit({ name: "Production" });
    });

    expect(mockDispatch).toHaveBeenCalledWith(handleRefresh(false)); // !isRefresh
  });

  it("should render the hook without errors", () => {
    const { result } = renderHook(() =>
      useReleaseDrawerHelper({ onClose: jest.fn() })
    );

    expect(result.current).toHaveProperty("newDeployment");
    expect(result.current).toHaveProperty("handleAddNewDeployment");
    expect(result.current).toHaveProperty("handleDrawerClose");
    expect(result.current).toHaveProperty("handleSubmit");
  });
});
