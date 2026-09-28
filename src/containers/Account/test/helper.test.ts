import { renderHook, act } from "@testing-library/react";
import { useAccountHelper } from "../helper";
import { fetchProfileDataRequest } from "src/containers/redux/slices/profile";

const mockDispatch = jest.fn();
const mockProfile = {
  fullName: "octocat",
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

describe("useAccountHelper", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("fetches profile and exposes github helpers", () => {
    const { result } = renderHook(() => useAccountHelper());
    expect(mockDispatch).toHaveBeenCalledWith(fetchProfileDataRequest());
    expect(result.current.isGithubAuth).toBe(true);
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
});
