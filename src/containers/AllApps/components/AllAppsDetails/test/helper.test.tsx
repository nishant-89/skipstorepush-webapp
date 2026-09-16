import { renderHook, act } from "@testing-library/react";
import { useAllAppsDetailHelper } from "../helper";
import { useDispatch, useSelector } from "react-redux";
import * as api from "src/apis/api";
import * as alertUtils from "src/utils/alert";
import { useNavigate, useParams } from "react-router-dom";
import { setLoading } from "src/redux/slices/globalSlice";

jest.mock("react-redux", () => ({
  useDispatch: jest.fn(),
  useSelector: jest.fn(),
}));

jest.mock("react-router-dom", () => ({
  useNavigate: jest.fn(),
  useParams: jest.fn(),
}));

jest.mock("src/apis/api", () => ({
  getDataApi: jest.fn(),
  deleteDataApi: jest.fn(),
  postDataApi: jest.fn(),
}));

jest.mock("src/utils/alert", () => ({
  showAlert: jest.fn(),
}));

jest.mock("../column", () => ({
  getReleaseColumns: jest.fn(() => []),
}));

describe("useAllAppsDetailHelper", () => {
  const mockDispatch = jest.fn();
  const mockNavigate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    (useDispatch as unknown as jest.Mock).mockReturnValue(mockDispatch);
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
    (useParams as jest.Mock).mockReturnValue({ id: "test-id" });

    (useSelector as unknown as jest.Mock).mockImplementation((selector: any) =>
      selector({
        release: {
          filteredData: [],
          loading: false,
          isRefresh: false,
          count: 10,
          envId: "env-id",
        },
        collabrators: {
          filteredData: [],
          loading: false,
          isRefresh: false,
          count: 2,
        },
      })
    );
  });

  it("should return default values on mount", () => {
    const { result } = renderHook(() => useAllAppsDetailHelper());

    expect(result.current.value).toBe(0);
    expect(result.current.searchTerm).toBe("");
    expect(result.current.filteredData).toEqual([]);
    expect(result.current.loading).toBe(false);
    expect(result.current.rowsPerPage).toBe(10);
    expect(result.current.envList).toEqual([]);
    expect(result.current.showFilter).toBe(false);
  });

  it("should set tab value correctly", () => {
    const { result } = renderHook(() => useAllAppsDetailHelper());

    act(() => {
      result.current.handleChange({} as any, 1);
    });

    expect(result.current.value).toBe(1);
  });

  it("should open and close drawers correctly", () => {
    const { result } = renderHook(() => useAllAppsDetailHelper());

    act(() => {
      result.current.handleOpenDrawer();
    });
    expect(result.current.isDrawerOpen).toBe(true);

    act(() => {
      result.current.handleCloseDrawer();
    });
    expect(result.current.isDrawerOpen).toBe(false);
  });

  it("should set and clear menu anchor", () => {
    const { result } = renderHook(() => useAllAppsDetailHelper());

    const fakeElement = document.createElement("button");

    act(() => {
      result.current.handleEditButtonClick({
        currentTarget: fakeElement,
      } as any);
    });

    expect(result.current.anchorEl).toBe(fakeElement);
    expect(result.current.open).toBe(true);

    act(() => {
      result.current.handleCloseMenu();
    });

    expect(result.current.anchorEl).toBe(null);
  });

  it("should trigger setIsDeleteModalOpen and setIsSettingsDrawerOpen", () => {
    const { result } = renderHook(() => useAllAppsDetailHelper());

    act(() => {
      result.current.handleDeleteClick();
    });

    expect(result.current.isDeleteModalOpen).toBe(true);

    act(() => {
      result.current.handleSettingsClick();
    });

    expect(result.current.isSettingsDrawerOpen).toBe(true);
  });

  it("should handle pagination correctly", () => {
    const { result } = renderHook(() => useAllAppsDetailHelper());

    act(() => {
      result.current.handleChangePage(3);
    });
    expect(result.current.mainPage).toBe(3);

    act(() => {
      result.current.handleChangeRowsPerPage(50);
    });
    expect(result.current.rowsPerPage).toBe(50);
    expect(result.current.mainPage).toBe(0);
  });

  it("should handle collaborator pagination", () => {
    const { result } = renderHook(() => useAllAppsDetailHelper());

    act(() => {
      result.current.handleCollabChangePage(2);
    });
    expect(result.current.mainPageCollab).toBe(2);

    act(() => {
      result.current.handleCollabChangeRowsPerPage(25);
    });
    expect(result.current.rowsPerPageCollab).toBe(25);
    expect(result.current.mainPageCollab).toBe(0);
  });

  it("should call delete API and navigate on successful delete", async () => {
    (api.deleteDataApi as jest.Mock).mockResolvedValue({
      statusCode: 200,
      message: "Deleted successfully",
    });

    const { result } = renderHook(() => useAllAppsDetailHelper());

    await act(async () => {
      await result.current.handleDelete();
    });

    expect(mockDispatch).toHaveBeenCalled();
    expect(alertUtils.showAlert).toHaveBeenCalledWith(
      1,
      "Deleted successfully"
    );
    expect(mockNavigate).toHaveBeenCalled();
  });

  it("should handle error on delete failure", async () => {
    (api.deleteDataApi as jest.Mock).mockRejectedValue("error");

    const { result } = renderHook(() => useAllAppsDetailHelper());

    await act(async () => {
      await result.current.handleDelete();
    });

    expect(alertUtils.showAlert).toHaveBeenCalledWith(
      2,
      "An unexpected error occurred"
    );
  });

  it("should handle invite flow successfully", async () => {
    (api.postDataApi as jest.Mock).mockResolvedValue({
      statusCode: 200,
      message: "Invite sent",
    });

    const { result } = renderHook(() => useAllAppsDetailHelper());

    await act(async () => {
      await result.current.handleInvite({ email: "test@example.com" });
    });

    expect(alertUtils.showAlert).toHaveBeenCalledWith(1, "Invite sent");
    expect(result.current.invite).toBe(false);
  });

  it("should handle error on invite failure", async () => {
    (api.postDataApi as jest.Mock).mockRejectedValue("error");

    const { result } = renderHook(() => useAllAppsDetailHelper());

    await act(async () => {
      await result.current.handleInvite({ email: "fail@example.com" });
    });
    expect(alertUtils.showAlert).toHaveBeenCalledWith(
      2,
      "An unexpected error occurred"
    );
  });

  it("should fetch and set environment list successfully", async () => {
    (api.getDataApi as jest.Mock).mockResolvedValue({
      statusCode: 200,
      data: [
        { id: "env-1", name: "Staging", key: "stg" },
        { id: "env-2", name: "Production", key: "prod" },
      ],
    });

    const { result } = renderHook(() => useAllAppsDetailHelper());

    await act(async () => {
      await result.current.handleOpenDrawer(); // trigger re-render to expose hook
    });

    expect(result.current.envList).toEqual([
      { value: "env-1", label: "Staging", key: "stg" },
      { value: "env-2", label: "Production", key: "prod" },
    ]);
    expect(result.current.selectedFilters).toBe("env-id"); // from mocked useSelector
  });

  it("should set selectedFilters to envId if present", async () => {
    // Override envId explicitly
    (useSelector as unknown as jest.Mock).mockImplementation((selector: any) =>
      selector({
        release: {
          filteredData: [],
          loading: false,
          isRefresh: false,
          count: 0,
          envId: "env-from-store",
        },
        collabrators: {
          filteredData: [],
          loading: false,
          isRefresh: false,
          count: 0,
        },
      })
    );

    (api.getDataApi as jest.Mock).mockResolvedValue({
      statusCode: 200,
      data: [{ id: "env-1", name: "Staging", key: "stg" }],
    });

    const { result } = renderHook(() => useAllAppsDetailHelper());

    await act(async () => {
      await result.current.handleOpenDrawer(); // triggers getEnvironments
    });

    expect(result.current.selectedFilters).toBe("env-from-store");
  });

  it("should set selectedFilters to 'Staging' env if envId is not present", async () => {
    // Override envId as empty string
    (useSelector as unknown as jest.Mock).mockImplementation((selector: any) =>
      selector({
        release: {
          filteredData: [],
          loading: false,
          isRefresh: false,
          count: 0,
          envId: "",
        },
        collabrators: {
          filteredData: [],
          loading: false,
          isRefresh: false,
          count: 0,
        },
      })
    );

    (api.getDataApi as jest.Mock).mockResolvedValue({
      statusCode: 200,
      data: [
        { id: "env-staging", name: "Staging", key: "stg" },
        { id: "env-prod", name: "Production", key: "prod" },
      ],
    });

    const { result } = renderHook(() => useAllAppsDetailHelper());

    await act(async () => {
      await result.current.handleOpenDrawer(); // triggers getEnvironments
    });

    expect(result.current.selectedFilters).toBe("env-staging");
  });

  it("should set selectedFilters to empty string if envId is not present and no Staging env exists", async () => {
    // Override envId as empty string
    (useSelector as unknown as jest.Mock).mockImplementation((selector: any) =>
      selector({
        release: {
          filteredData: [],
          loading: false,
          isRefresh: false,
          count: 0,
          envId: "",
        },
        collabrators: {
          filteredData: [],
          loading: false,
          isRefresh: false,
          count: 0,
        },
      })
    );

    (api.getDataApi as jest.Mock).mockResolvedValue({
      statusCode: 200,
      data: [
        { id: "env-dev", name: "Development", key: "dev" },
        { id: "env-prod", name: "Production", key: "prod" },
      ],
    });

    const { result } = renderHook(() => useAllAppsDetailHelper());

    await act(async () => {
      await result.current.handleOpenDrawer(); // triggers getEnvironments
    });

    expect(result.current.selectedFilters).toBe("");
  });

  it("should handle error during getEnvironments call", async () => {
    (api.getDataApi as jest.Mock).mockRejectedValue("API error");

    const { result } = renderHook(() => useAllAppsDetailHelper());

    await act(async () => {
      await result.current.handleOpenDrawer(); // expose hook, triggers getEnv via useEffect
    });

    expect(alertUtils.showAlert).toHaveBeenCalledWith(
      2,
      "An unexpected error occurred"
    );
  });

  it("should fetch and set app detail successfully", async () => {
    (api.getDataApi as jest.Mock).mockResolvedValue({
      statusCode: 200,
      data: {
        name: "Test App",
        osType: "IOS",
        appIcon: "icon.png",
        ownerName: "Jane Doe",
      },
    });

    const { result } = renderHook(() => useAllAppsDetailHelper());

    await act(async () => {
      await result.current.handleOpenDrawer(); // triggers useEffect -> getAppDetail
    });

    expect(result.current.appDetail).toEqual({
      name: "Test App",
      osType: "IOS",
      appIcon: "icon.png",
      ownerName: "Jane Doe",
    });
    expect(result.current.realeaseLoader).toBe(false);
  });

  it("should handle error during getAppDetail call", async () => {
    (api.getDataApi as jest.Mock).mockRejectedValue("Some error");

    const { result } = renderHook(() => useAllAppsDetailHelper());

    await act(async () => {
      await result.current.handleOpenDrawer(); // triggers getAppDetail via useEffect
    });

    expect(alertUtils.showAlert).toHaveBeenCalledWith(
      2,
      "An unexpected error occurred"
    );
    expect(result.current.realeaseLoader).toBe(false);
  });

  it("should handle term state update and affect search behavior", () => {
    const { result } = renderHook(() => useAllAppsDetailHelper());
    const searchText = "search term";

    // First render - set the term
    act(() => {
      result.current.setTerm(searchText);
    });

    expect(result.current.term).toBe(searchText);

    // Second render - verify term affects search
    act(() => {
      result.current.setSearchTerm(result.current.term);
    });

    expect(result.current.searchTerm).toBe(searchText);
    expect(mockDispatch).toHaveBeenCalled();
  });

  it("should handle collaborator model state updates", () => {
    const { result } = renderHook(() => useAllAppsDetailHelper());
    const testEmail = "test@example.com";

    act(() => {
      result.current.handleCollabModel(testEmail);
    });

    expect(result.current.delCollab).toBe(true);
  });

  it("should handle delete collaborator successfully", async () => {
    const testEmail = "test@example.com";
    (api.deleteDataApi as jest.Mock).mockResolvedValue({
      statusCode: 200,
      message: "Collaborator deleted successfully",
    });

    const { result } = renderHook(() => useAllAppsDetailHelper());

    // Set up the email first
    act(() => {
      result.current.handleCollabModel(testEmail);
    });

    await act(async () => {
      await result.current.handleDeleteCollab();
    });

    expect(api.deleteDataApi).toHaveBeenCalledWith({
      path: expect.stringContaining(
        `appId=test-id&email=${encodeURIComponent(testEmail)}`
      ),
    });
    expect(mockDispatch).toHaveBeenCalled();
    expect(alertUtils.showAlert).toHaveBeenCalledWith(
      1,
      "Collaborator deleted successfully"
    );
    expect(result.current.delCollab).toBe(false);
  });

  it("should handle delete collaborator failure", async () => {
    const testEmail = "test@example.com";
    (api.deleteDataApi as jest.Mock).mockRejectedValue("API error");

    const { result } = renderHook(() => useAllAppsDetailHelper());

    // Set up the email first
    act(() => {
      result.current.handleCollabModel(testEmail);
    });

    await act(async () => {
      await result.current.handleDeleteCollab();
    });

    expect(mockDispatch).toHaveBeenCalledWith(setLoading(false));
    expect(result.current.delCollab).toBe(false);
    expect(alertUtils.showAlert).toHaveBeenCalledWith(
      2,
      "An unexpected error occurred"
    );
  });

  it("should not call delete collaborator API if email or id is missing", async () => {
    const { result } = renderHook(() => useAllAppsDetailHelper());

    await act(async () => {
      await result.current.handleDeleteCollab();
    });

    expect(api.deleteDataApi).not.toHaveBeenCalled();
  });
});
