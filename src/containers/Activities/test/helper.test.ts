import { renderHook, act, waitFor } from "@testing-library/react";
import {
  canOpenActivityApp,
  formatActivityDetails,
  formatActivityLabel,
  useActivitiesHelper,
} from "../helper";
import * as api from "src/apis/api";
import { apiRoutes } from "src/utils/common/constants/constants";
import { showAlert } from "src/utils/alert";

jest.mock("src/apis/api", () => ({
  getDataApi: jest.fn(),
}));

jest.mock("src/utils/alert", () => ({
  showAlert: jest.fn(),
}));

const activity = {
  id: 1,
  action: "APP_CREATED",
  targetType: "APP",
  targetId: 9,
  appId: 9,
  status: "SUCCESS",
  metadata: { name: "Store", osType: "IOS" },
  createdDate: "2026-09-29T06:00:00.000Z",
  updatedDate: "2026-09-29T06:00:00.000Z",
};

describe("activity formatters", () => {
  it("humanizes action labels", () => {
    expect(formatActivityLabel("APP_CREATED")).toBe("App Created");
    expect(formatActivityLabel("")).toBe("—");
  });

  it("builds a details summary from metadata", () => {
    expect(formatActivityDetails(null)).toBe("—");
    expect(
      formatActivityDetails({
        appName: "Store",
        osType: "IOS",
        environmentName: "Staging",
        releaseVersion: "1.2.0",
        email: "ada@example.com",
      })
    ).toBe("iOS · Staging · v1.2.0 · ada@example.com");
  });

  it("does not open deleted apps", () => {
    expect(
      canOpenActivityApp({
        ...activity,
        action: "APP_DELETED",
        appExists: false,
      })
    ).toBe(false);
    expect(
      canOpenActivityApp({
        ...activity,
        appExists: true,
      })
    ).toBe(true);
  });
});

describe("useActivitiesHelper", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    window.localStorage.clear();
  });

  it("loads the first page of activities", async () => {
    (api.getDataApi as jest.Mock).mockResolvedValue({
      success: true,
      data: { list: [activity], total_items: 1 },
    });

    const { result } = renderHook(() => useActivitiesHelper());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(api.getDataApi).toHaveBeenCalledWith({
      path: apiRoutes.Activities,
      data: { page: 1, limit: 10 },
    });
    expect(result.current.list).toEqual([activity]);
    expect(result.current.count).toBe(1);
  });

  it("requests the next page", async () => {
    (api.getDataApi as jest.Mock).mockResolvedValue({
      success: true,
      data: { list: [activity], total_items: 12 },
    });

    const { result } = renderHook(() => useActivitiesHelper());
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    act(() => {
      result.current.handleChangePage(1);
    });

    await waitFor(() => {
      expect(api.getDataApi).toHaveBeenCalledWith({
        path: apiRoutes.Activities,
        data: { page: 2, limit: 10 },
      });
    });
  });

  it("sends a search query", async () => {
    (api.getDataApi as jest.Mock).mockResolvedValue({
      success: true,
      data: { list: [activity], total_items: 1 },
    });
    const { result } = renderHook(() => useActivitiesHelper());
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    act(() => {
      result.current.setSearchTerm("store");
    });

    await waitFor(() => {
      expect(api.getDataApi).toHaveBeenCalledWith({
        path: apiRoutes.Activities,
        data: { page: 1, limit: 10, search: "store" },
      });
    });
  });

  it("shows an error when the list request fails", async () => {
    (api.getDataApi as jest.Mock).mockRejectedValue(new Error("Nope"));
    const { result } = renderHook(() => useActivitiesHelper());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(showAlert).toHaveBeenCalledWith(2, "Nope");
    expect(result.current.list).toEqual([]);
  });
});
