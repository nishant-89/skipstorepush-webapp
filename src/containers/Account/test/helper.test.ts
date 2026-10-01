import { renderHook, act } from "@testing-library/react";
import {
  getProfileImageValidationError,
  PROFILE_IMAGE_SIZE_ERROR,
  PROFILE_IMAGE_TYPE_ERROR,
  useAccountHelper,
} from "../helper";
import { fetchProfileDataRequest } from "src/containers/redux/slices/profile";
import * as api from "src/apis/api";
import { showAlert } from "src/utils/alert";

const mockDispatch = jest.fn();
const mockProfile = {
  fullName: "The Octocat",
  username: "octocat",
  email: "octocat@github.com",
  authType: "GITHUB",
  profileImage: "https://example.com/avatar.png",
  createdDate: "2026-01-01T00:00:00.000Z",
  lastLogin: "2026-01-02T00:00:00.000Z",
  session: {
    sessionId: "session-123",
    createdDate: "2026-01-02T00:00:00.000Z",
  },
};

jest.mock("react-redux", () => ({
  useDispatch: () => mockDispatch,
  useSelector: (selector: (state: unknown) => unknown) =>
    selector({
      profile: { data: mockProfile, loading: false, error: "" },
      auth: { user: { accessKey: "abc-key" } },
    }),
}));

jest.mock("src/apis/api", () => ({
  postFormDataApi: jest.fn(),
}));

jest.mock("src/utils/alert", () => ({
  showAlert: jest.fn(),
}));

describe("useAccountHelper", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("fetches profile and exposes github helpers", () => {
    const { result } = renderHook(() => useAccountHelper());
    expect(mockDispatch).toHaveBeenCalledWith(fetchProfileDataRequest());
    expect(result.current.isGithubAuth).toBe(true);
    expect(result.current.githubUsername).toBe("octocat");
    expect(result.current.githubProfileUrl).toBe("https://github.com/octocat");
  });

  it("opens and closes the access key modal", () => {
    const { result } = renderHook(() => useAccountHelper());
    act(() => {
      result.current.openAccessKeyModal();
    });
    expect(result.current.isAccessKeyModalOpen).toBe(true);
    act(() => {
      result.current.closeAccessKeyModal();
    });
    expect(result.current.isAccessKeyModalOpen).toBe(false);
  });

  it("toggles the password modal", () => {
    const { result } = renderHook(() => useAccountHelper());
    act(() => {
      result.current.openPasswordModal();
    });
    expect(result.current.isPasswordModalOpen).toBe(true);
    act(() => {
      result.current.closePasswordModal();
    });
    expect(result.current.isPasswordModalOpen).toBe(false);
  });

  it("rejects unsupported profile image types", () => {
    expect(
      getProfileImageValidationError(
        new File(["nope"], "notes.txt", { type: "text/plain" })
      )
    ).toBe(PROFILE_IMAGE_TYPE_ERROR);
  });

  it("rejects profile images over 5MB", () => {
    const file = new File(["x"], "photo.png", { type: "image/png" });
    Object.defineProperty(file, "size", { value: 5 * 1024 * 1024 + 1 });
    expect(getProfileImageValidationError(file)).toBe(PROFILE_IMAGE_SIZE_ERROR);
  });

  it("uploads a profile image and refreshes the profile", async () => {
    (api.postFormDataApi as jest.Mock).mockResolvedValue({
      success: true,
      statusCode: 200,
      message: "Profile image updated successfully",
    });
    const file = new File(["avatar"], "photo.png", { type: "image/png" });
    const { result } = renderHook(() => useAccountHelper());

    await act(async () => {
      await result.current.handleProfileImageChange({
        target: { files: [file], value: "photo.png" },
      } as unknown as React.ChangeEvent<HTMLInputElement>);
    });

    expect(api.postFormDataApi).toHaveBeenCalledWith(
      expect.objectContaining({
        path: "api/user/profile-image",
        data: expect.any(FormData),
      })
    );
    const uploadCall = (api.postFormDataApi as jest.Mock).mock.calls[0][0];
    expect(uploadCall.data.get("file")).toBe(file);
    expect(showAlert).toHaveBeenCalledWith(
      1,
      "Profile image updated successfully"
    );
    expect(mockDispatch).toHaveBeenCalledWith(fetchProfileDataRequest());
  });

  it("shows an error when profile image upload fails", async () => {
    (api.postFormDataApi as jest.Mock).mockRejectedValue(new Error("Nope"));
    const file = new File(["avatar"], "photo.png", { type: "image/png" });
    const { result } = renderHook(() => useAccountHelper());

    await act(async () => {
      await result.current.handleProfileImageChange({
        target: { files: [file], value: "photo.png" },
      } as unknown as React.ChangeEvent<HTMLInputElement>);
    });

    expect(showAlert).toHaveBeenCalledWith(2, "Nope");
  });
});
