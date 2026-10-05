import { renderHook, waitFor } from "@testing-library/react";
import { usePublicProfileHelper } from "../publicProfileHelper";
import { getDataApi } from "src/apis/api";

const mockNavigate = jest.fn();
let mockParams = { id: "2" };

jest.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
  useParams: () => mockParams,
  useLocation: () => ({ pathname: "/users/2", state: null }),
}));

const mockDispatch = jest.fn();
jest.mock("react-redux", () => ({
  useDispatch: () => mockDispatch,
  useSelector: (selector: (state: unknown) => unknown) =>
    selector({
      profile: { data: { id: 1 } },
      auth: { user: { userId: 1 } },
    }),
}));

jest.mock("src/apis/api", () => ({
  getDataApi: jest.fn(),
}));

jest.mock("src/redux/slices/globalSlice", () => ({
  setLoading: (value: boolean) => ({ type: "loading", payload: value }),
}));

jest.mock("src/utils/alert", () => ({
  showAlert: jest.fn(),
}));

describe("usePublicProfileHelper", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockParams = { id: "2" };
  });

  it("loads a public profile", async () => {
    (getDataApi as jest.Mock).mockResolvedValue({
      success: true,
      data: {
        id: 2,
        fullName: "Sam",
        email: "sam@example.com",
        profileImage: "photo.png",
      },
    });

    const { result } = renderHook(() => usePublicProfileHelper());
    await waitFor(() => {
      expect(result.current.profile?.email).toBe("sam@example.com");
    });
    expect(getDataApi).toHaveBeenCalledWith({
      path: "api/collaborators/profile/2",
    });
  });

  it("redirects to My Profile when the id is the current user", async () => {
    mockParams = { id: "1" };
    renderHook(() => usePublicProfileHelper());
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/my-account", {
        replace: true,
      });
    });
    expect(getDataApi).not.toHaveBeenCalled();
  });
});
