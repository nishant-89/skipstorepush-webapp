/* eslint-disable @typescript-eslint/no-explicit-any */
import { renderHook, act } from "@testing-library/react";
import { useAllAppsHelper } from "../helper";
import * as allAppActions from "../../redux/slices/allApp";
import { useDispatch, useSelector } from "react-redux";

jest.mock("react-redux", () => ({
  useDispatch: jest.fn(),
  useSelector: jest.fn(),
}));

jest.mock("../../redux/slices/allApp", () => ({
  fetchAllAppRequest: jest.fn(),
  handleRefresh: jest.fn(),
}));

jest.mock("../../redux/slices/profile", () => ({
  fetchProfileDataRequest: jest.fn(),
}));

describe("useAllAppsHelper", () => {
  const mockDispatch = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    window.localStorage.clear();

    (useDispatch as unknown as jest.Mock).mockReturnValue(mockDispatch);

    (useSelector as unknown as jest.Mock).mockImplementation((selector: any) =>
      selector({
        allApps: {
          filteredData: [{ id: 1, name: "Test App" }],
          loading: false,
          isRefresh: false,
          count: 20,
        },
        auth: {
          user: {
            name: "Test User",
          },
        },
      })
    );
  });

  it("restores saved app filters", () => {
    window.localStorage.setItem(
      "skipstore_all_apps_filters",
      JSON.stringify({ os: ["IOS"], search: "store" })
    );
    const { result } = renderHook(() => useAllAppsHelper());
    expect(result.current.selectedFilters).toEqual(["IOS"]);
    expect(result.current.searchTerm).toBe("store");
    expect(result.current.isRedIndicator).toBe(true);
  });

  it("should initialize with correct default values", () => {
    const { result } = renderHook(() => useAllAppsHelper());

    expect(result.current.isDrawerOpen).toBe(false);
    expect(result.current.searchTerm).toBe("");
    expect(result.current.term).toBe("");
    expect(result.current.mainPage).toBe(0);
    expect(result.current.rowsPerPage).toBe(10);
    expect(result.current.selectedFilters).toEqual([]);
    expect(result.current.filteredData).toEqual([{ id: 1, name: "Test App" }]);
    expect(result.current.loading).toBe(false);
    expect(result.current.count).toBe(20);
    expect(result.current.user).toEqual({ name: "Test User" });
  });

  it("should open and close drawer correctly", () => {
    const { result } = renderHook(() => useAllAppsHelper());

    act(() => {
      result.current.handleOpenDrawer();
    });
    expect(result.current.isDrawerOpen).toBe(true);

    act(() => {
      result.current.handleCloseDrawer();
    });
    expect(result.current.isDrawerOpen).toBe(false);
  });

  it("should update searchTerm and term", () => {
    const { result } = renderHook(() => useAllAppsHelper());

    act(() => {
      result.current.setSearchTerm("App");
      result.current.setTerm("App");
    });

    expect(result.current.searchTerm).toBe("App");
    expect(result.current.term).toBe("App");
  });

  it("should change page and rows per page", () => {
    const { result } = renderHook(() => useAllAppsHelper());

    act(() => {
      result.current.handleChangePage(2);
    });

    expect(result.current.mainPage).toBe(2);

    act(() => {
      result.current.handleChangeRowsPerPage(25);
    });

    expect(result.current.rowsPerPage).toBe(25);
    expect(result.current.mainPage).toBe(0);
  });

  it("should evaluate showFilter correctly when data is present", () => {
    const { result } = renderHook(() => useAllAppsHelper());
    expect(result.current.showFilter).toBe(true);
  });

  it("should set selectedFilters and isRedIndicator", () => {
    const { result } = renderHook(() => useAllAppsHelper());

    act(() => {
      result.current.setSelectedFilters(["ios"]);
      result.current.setIsRedIndicator(true);
    });

    expect(result.current.selectedFilters).toEqual(["ios"]);
    expect(result.current.isRedIndicator).toBe(true);
  });

  it("should dispatch handleRefresh if search term or filters change and page is already 0", () => {
    (useSelector as unknown as jest.Mock).mockImplementation((selector: any) =>
      selector({
        allApps: {
          filteredData: [],
          loading: false,
          isRefresh: false,
          count: 0,
        },
        auth: {
          user: {},
        },
      })
    );

    const { result } = renderHook(() => useAllAppsHelper());

    act(() => {
      result.current.setSearchTerm("test");
      result.current.setSelectedFilters(["android"]);
    });

    expect(mockDispatch).toHaveBeenCalledWith(
      allAppActions.handleRefresh(true)
    );
  });
});
