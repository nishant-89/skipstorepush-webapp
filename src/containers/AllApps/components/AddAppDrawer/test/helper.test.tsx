/* eslint-disable @typescript-eslint/no-explicit-any */
import { renderHook, act } from "@testing-library/react";
import { useAllAppsHelper } from "../helper";
import * as api from "src/apis/api";
import { showAlert } from "src/utils/alert";
import { useDispatch, useSelector } from "react-redux";
import { apiRoutes } from "src/utils/common/constants";

jest.mock("src/apis/api", () => ({
  postDataApi: jest.fn(),
  postFormDataApi: jest.fn(),
  patchDataApi: jest.fn(),
}));
jest.mock("src/utils/alert", () => ({
  showAlert: jest.fn(),
}));

jest.mock("react-redux", () => ({
  useDispatch: jest.fn(),
  useSelector: jest.fn(),
}));

jest.mock("react-router-dom", () => ({
  useNavigate: jest.fn(),
}));

describe("useAllAppsHelper", () => {
  const mockDispatch = jest.fn();
  const mockClose = jest.fn();
  const mockAppDetail = {
    id: "123",
    osType: "android",
    name: "Test App",
    appIcon: "http://test.com/icon.png",
    azureAppId: "string",
    azureOwnerId: "string",
    status: "string",
    createdDate: "string",
    updatedDate: "string",
    ownerName: "string",
    isOwner: true,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useDispatch as unknown as jest.Mock).mockReturnValue(mockDispatch);
    (useSelector as unknown as jest.Mock).mockImplementation((cb: any) =>
      cb({
        allApps: { isRefresh: false },
        release: { isRefresh: false },
      })
    );
  });

  it("should initialize with correct initial values in edit mode", () => {
    const { result } = renderHook(() =>
      useAllAppsHelper({
        onClose: mockClose,
        appDetail: mockAppDetail,
        editMode: true,
      })
    );

    expect(result.current.initial).toEqual({
      platform: "android",
      name: "Test App",
    });

    expect(result.current.uploadedImage).toBe("http://test.com/icon.png");
  });

  it("should handle invalid file upload (unsupported type)", () => {
    const { result } = renderHook(() =>
      useAllAppsHelper({
        onClose: mockClose,
        appDetail: undefined,
        editMode: false,
      })
    );

    const invalidFile = new File([""], "image.gif", { type: "image/gif" });

    act(() => {
      result.current.handleFile(invalidFile);
    });

    expect(showAlert).toHaveBeenCalledWith(2, "Unsupported file type.");
  });

  it("should handle image file too large", () => {
    const { result } = renderHook(() =>
      useAllAppsHelper({
        onClose: mockClose,
        appDetail: undefined,
        editMode: false,
      })
    );

    const largeFile = new File(["a".repeat(6 * 1024 * 1024)], "large.png", {
      type: "image/png",
    });

    Object.defineProperty(largeFile, "size", { value: 6 * 1024 * 1024 });

    act(() => {
      result.current.handleFile(largeFile);
    });

    expect(showAlert).toHaveBeenCalledWith(
      2,
      "File too large. Maximum size is 5MB."
    );
  });

  it("should remove uploaded image", () => {
    const { result } = renderHook(() =>
      useAllAppsHelper({
        onClose: mockClose,
        appDetail: undefined,
        editMode: false,
      })
    );

    act(() => {
      result.current.handleRemoveImage();
    });

    expect(result.current.uploadedImage).toBe(null);
  });

  it("should handle drawer close and reset form", () => {
    const { result } = renderHook(() =>
      useAllAppsHelper({
        onClose: mockClose,
        appDetail: undefined,
        editMode: false,
      })
    );

    act(() => {
      result.current.handleDrawerClose();
    });

    expect(mockClose).toHaveBeenCalled();
    expect(result.current.uploadedImage).toBe(null);
  });

  it("should handle submit with image upload and call handleAdd", async () => {
    const previewUrl = "http://localhost:3000/api/uploads/icon.png";

    (api.postFormDataApi as jest.Mock).mockResolvedValueOnce({
      success: true,
      statusCode: 201,
      data: {
        url: previewUrl,
        fileName: "icon.png",
        originalName: "icon.png",
        mimeType: "image/png",
        size: 5,
      },
    });

    (api.postDataApi as jest.Mock).mockResolvedValueOnce({
      statusCode: 201,
      message: "App added successfully",
    });

    const { result } = renderHook(() =>
      useAllAppsHelper({
        onClose: mockClose,
        appDetail: undefined,
        editMode: false,
      })
    );

    const file = new File(["dummy"], "icon.png", { type: "image/png" });

    act(() => {
      result.current.handleFile(file);
    });

    await act(async () => {
      await result.current.handleSubmit({
        name: "New App",
        platform: "ios",
      });
    });

    expect(api.postFormDataApi).toHaveBeenCalledWith(
      expect.objectContaining({
        path: apiRoutes.UploadLogo,
        data: expect.any(FormData),
      })
    );
    const uploadCall = (api.postFormDataApi as jest.Mock).mock.calls[0][0];
    expect(uploadCall.data.get("file")).toBe(file);
    expect(api.postDataApi).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          appIcon: previewUrl,
        }),
      })
    );
    expect(mockDispatch).toHaveBeenCalled();
  });

  it("should handle submit failure", async () => {
    (api.postFormDataApi as jest.Mock).mockRejectedValueOnce(
      new Error("Upload failed")
    );

    const { result } = renderHook(() =>
      useAllAppsHelper({
        onClose: mockClose,
        appDetail: undefined,
        editMode: false,
      })
    );

    const file = new File(["dummy"], "icon.png", { type: "image/png" });

    act(() => {
      result.current.handleFile(file);
    });

    await act(async () => {
      await result.current.handleSubmit({
        name: "Fail App",
        platform: "ios",
      });
    });

    expect(showAlert).toHaveBeenCalledWith(2, "Upload failed");
  });

  it("should handle update successfully", async () => {
    (api.patchDataApi as jest.Mock).mockResolvedValueOnce({
      statusCode: 200,
      message: "Updated successfully",
    });

    const { result } = renderHook(() =>
      useAllAppsHelper({
        onClose: mockClose,
        appDetail: mockAppDetail,
        editMode: true,
      })
    );

    await act(async () => {
      await result.current.handleSubmit({
        name: "Updated App",
        platform: "android",
      });
    });

    expect(showAlert).toHaveBeenCalledWith(1, "Updated successfully");
  });

  it("should handle add app successfully", async () => {
    (api.postDataApi as jest.Mock).mockResolvedValueOnce({
      statusCode: 201,
      message: "App added successfully",
    });

    const { result } = renderHook(() =>
      useAllAppsHelper({
        onClose: mockClose,
        appDetail: undefined,
        editMode: false,
      })
    );

    await act(async () => {
      await result.current.handleSubmit({
        name: "New App",
        platform: "android",
      });
    });

    expect(showAlert).toHaveBeenCalledWith(1, "App added successfully");
    expect(mockDispatch).toHaveBeenCalled();
    expect(mockClose).toHaveBeenCalled();
  });
  it("should handle add app failure", async () => {
    (api.postDataApi as jest.Mock).mockRejectedValueOnce(
      new Error("Add app failed")
    );

    const { result } = renderHook(() =>
      useAllAppsHelper({
        onClose: mockClose,
        appDetail: undefined,
        editMode: false,
      })
    );

    await act(async () => {
      await result.current.handleSubmit({
        name: "New App",
        platform: "ios",
      });
    });

    expect(showAlert).toHaveBeenCalledWith(2, "Add app failed");
  });
  it("should handle update app failure", async () => {
    (api.patchDataApi as jest.Mock).mockRejectedValueOnce(
      new Error("Update failed")
    );

    const { result } = renderHook(() =>
      useAllAppsHelper({
        onClose: mockClose,
        appDetail: mockAppDetail,
        editMode: true,
      })
    );

    await act(async () => {
      await result.current.handleSubmit({
        name: "Updated App",
        platform: "android",
      });
    });

    expect(showAlert).toHaveBeenCalledWith(2, "Update failed");
  });

  it("should call resetForm on formRef when handleDrawerClose is called", () => {
    const { result } = renderHook(() =>
      useAllAppsHelper({
        onClose: mockClose,
        appDetail: undefined,
        editMode: false,
      })
    );
    // @ts-ignore
    result.current.formRef.current = { resetForm: jest.fn() };
    act(() => {
      result.current.handleDrawerClose();
    });
    expect(
      result.current.formRef.current && result.current.formRef.current.resetForm
    ).toHaveBeenCalled();
  });

  it("should call click on fileInputRef when handleUploadClick is called", () => {
    const { result } = renderHook(() =>
      useAllAppsHelper({
        onClose: mockClose,
        appDetail: undefined,
        editMode: false,
      })
    );
    const clickMock = jest.fn();
    // @ts-ignore
    result.current.fileInputRef.current = { click: clickMock };
    act(() => {
      result.current.handleUploadClick();
    });
    expect(clickMock).toHaveBeenCalled();
  });

  it("should set fileInputRef.current.value to '' when handleRemoveImage is called", () => {
    const { result } = renderHook(() =>
      useAllAppsHelper({
        onClose: mockClose,
        appDetail: undefined,
        editMode: false,
      })
    );
    // @ts-ignore
    result.current.fileInputRef.current = { value: "something" };
    act(() => {
      result.current.handleRemoveImage();
    });
    expect(
      result.current.fileInputRef.current &&
        result.current.fileInputRef.current.value
    ).toBe("");
  });

  it("should call handleAdd directly in handleSubmit when uploadFile is null (no image upload)", async () => {
    (api.postDataApi as jest.Mock).mockResolvedValueOnce({
      statusCode: 201,
      message: "App added successfully",
    });
    const { result } = renderHook(() =>
      useAllAppsHelper({
        onClose: mockClose,
        appDetail: undefined,
        editMode: false,
      })
    );
    // Ensure uploadFile is null
    await act(async () => {
      await result.current.handleSubmit({
        name: "No Image App",
        platform: "android",
      });
    });
    expect(api.postDataApi).toHaveBeenCalled();
    expect(showAlert).toHaveBeenCalledWith(1, "App added successfully");
  });

  it("should use uploadedImage in handleUpdate if no previewUrl is provided", async () => {
    (api.patchDataApi as jest.Mock).mockResolvedValueOnce({
      statusCode: 200,
      message: "Updated successfully",
    });
    const customAppDetail = {
      ...mockAppDetail,
      appIcon: "http://test.com/updatedicon.png",
    };
    const { result } = renderHook(() =>
      useAllAppsHelper({
        onClose: mockClose,
        appDetail: customAppDetail,
        editMode: true,
      })
    );
    // No need to set uploadedImage manually
    await act(async () => {
      await result.current.handleSubmit({
        name: "Updated App",
        platform: "android",
      });
    });
    expect(api.patchDataApi).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          appIcon: "http://test.com/updatedicon.png",
        }),
      })
    );
    expect(showAlert).toHaveBeenCalledWith(1, "Updated successfully");
  });
});
