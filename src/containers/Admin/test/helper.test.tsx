import { ReactNode } from "react";
import { renderHook, waitFor, act } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import * as api from "src/apis/api";
import { showAlert } from "src/utils/alert";
import { apiRoutes } from "src/utils/common/constants/constants";
import {
  adminRangeParams,
  formatAdminLabel,
  formatAdminRangeLabel,
  useAdminActivitiesHelper,
  useAdminAppHelper,
  useAdminAppsHelper,
  useAdminCustomerHelper,
  useAdminCustomersHelper,
  useAdminOverviewHelper,
  useClientTable,
} from "../helper";

jest.mock("src/apis/api", () => ({
  getDataApi: jest.fn(),
}));

jest.mock("src/utils/alert", () => ({
  showAlert: jest.fn(),
}));

describe("formatAdminLabel", () => {
  it("humanizes enum values", () => {
    expect(formatAdminLabel("APP_CREATED")).toBe("App Created");
    expect(formatAdminLabel("")).toBe("—");
    expect(formatAdminLabel(undefined)).toBe("—");
  });
});

describe("admin date range", () => {
  it("formats a resolved range and falls back when dates are missing", () => {
    expect(formatAdminRangeLabel({ from: "2026-10-03", to: "2026-10-09" })).toBe(
      "2026-10-03 – 2026-10-09"
    );
    expect(formatAdminRangeLabel(null)).toBe("Last 7 days");
  });

  it("sends preset and timezone, and blocks an unfinished or oversized custom range", () => {
    expect(adminRangeParams("last_7_days", "", "")).toEqual({
      data: expect.objectContaining({
        preset: "last_7_days",
        timezone: expect.any(String),
      }),
    });
    expect(adminRangeParams("custom", "", "2026-10-09")).toEqual({});
    expect(adminRangeParams("custom", "2026-01-01", "2026-06-01")).toEqual({
      error: "Choose a range of 92 days or fewer.",
    });
    expect(adminRangeParams("custom", "2026-10-01", "2026-10-09").data).toEqual(
      expect.objectContaining({
        preset: "custom",
        from: "2026-10-01",
        to: "2026-10-09",
      })
    );
  });
});

describe("admin helpers", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("loads overview data", async () => {
    (api.getDataApi as jest.Mock).mockResolvedValue({
      success: true,
      data: { customersActive: 3, apps: 8, actions7d: 12, failed7d: 1 },
    });
    const { result } = renderHook(() => useAdminOverviewHelper());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(api.getDataApi).toHaveBeenCalledWith(
      expect.objectContaining({
        path: apiRoutes.AdminOverview,
        data: expect.objectContaining({
          preset: "last_7_days",
          page: 1,
          limit: 10,
        }),
      })
    );
    expect(result.current.data?.customersActive).toBe(3);
  });

  it("loads a paged customer list and resets page on search", async () => {
    (api.getDataApi as jest.Mock).mockResolvedValue({
      success: true,
      data: { list: [{ id: 1, email: "a@b.com" }], total_items: 1 },
    });
    const { result } = renderHook(() => useAdminCustomersHelper());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(api.getDataApi).toHaveBeenCalledWith({
      path: apiRoutes.AdminCustomers,
      data: { page: 1, limit: 10 },
    });

    act(() => {
      result.current.handleChangePage(2);
    });
    act(() => {
      result.current.setSearchTerm("ada");
    });
    await waitFor(() =>
      expect(api.getDataApi).toHaveBeenCalledWith({
        path: apiRoutes.AdminCustomers,
        data: { page: 1, limit: 10, search: "ada" },
      })
    );
  });

  it("loads apps and activities lists", async () => {
    (api.getDataApi as jest.Mock).mockResolvedValue({
      success: true,
      data: { list: [], total_items: 0 },
    });
    const apps = renderHook(() => useAdminAppsHelper());
    const activities = renderHook(() => useAdminActivitiesHelper());
    await waitFor(() => expect(apps.result.current.loading).toBe(false));
    await waitFor(() => expect(activities.result.current.loading).toBe(false));
    expect(api.getDataApi).toHaveBeenCalledWith({
      path: apiRoutes.AdminApps,
      data: { page: 1, limit: 10 },
    });
    expect(api.getDataApi).toHaveBeenCalledWith({
      path: apiRoutes.AdminActivities,
      data: { page: 1, limit: 10 },
    });
  });

  it("loads customer and app details from the route id", async () => {
    (api.getDataApi as jest.Mock).mockResolvedValue({
      success: true,
      data: { id: 9, name: "Store" },
    });
    const wrapper = ({ children }: { children: ReactNode }) => (
      <MemoryRouter initialEntries={["/admin/apps/9"]}>
        <Routes>
          <Route path="/admin/apps/:id" element={children} />
        </Routes>
      </MemoryRouter>
    );
    const { result } = renderHook(() => useAdminAppHelper(), { wrapper });
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(api.getDataApi).toHaveBeenCalledWith({
      path: `${apiRoutes.AdminApps}/9`,
      data: expect.objectContaining({
        preset: "last_7_days",
        timezone: expect.any(String),
      }),
    });
    expect(result.current.data?.name).toBe("Store");

    act(() => {
      result.current.setPreset("today");
    });
    await waitFor(() =>
      expect(api.getDataApi).toHaveBeenCalledWith({
        path: `${apiRoutes.AdminApps}/9`,
        data: expect.objectContaining({ preset: "today" }),
      })
    );
  });

  it("loads a customer detail", async () => {
    (api.getDataApi as jest.Mock).mockResolvedValue({
      success: true,
      data: { id: 4, fullName: "Ada" },
    });
    const wrapper = ({ children }: { children: ReactNode }) => (
      <MemoryRouter initialEntries={["/admin/customers/4"]}>
        <Routes>
          <Route path="/admin/customers/:id" element={children} />
        </Routes>
      </MemoryRouter>
    );
    const { result } = renderHook(() => useAdminCustomerHelper(), { wrapper });
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(api.getDataApi).toHaveBeenCalledWith({
      path: `${apiRoutes.AdminCustomers}/4`,
      data: expect.objectContaining({
        preset: "last_7_days",
        timezone: expect.any(String),
      }),
    });
    expect(result.current.data?.fullName).toBe("Ada");

    const calls = (api.getDataApi as jest.Mock).mock.calls.length;
    act(() => {
      result.current.setPreset("custom");
    });
    expect(api.getDataApi).toHaveBeenCalledTimes(calls);

    act(() => {
      result.current.setFrom("2026-01-01");
      result.current.setTo("2026-06-01");
    });
    await waitFor(() =>
      expect(showAlert).toHaveBeenCalledWith(
        2,
        "Choose a range of 92 days or fewer."
      )
    );
    expect(api.getDataApi).toHaveBeenCalledTimes(calls);
  });

  it("pages detail tables on the client", () => {
    const rows = Array.from({ length: 12 }, (_, index) => ({ id: index + 1 }));
    const { result } = renderHook(() => useClientTable(rows));
    expect(result.current.count).toBe(12);
    expect(result.current.pageRows).toHaveLength(10);
    act(() => {
      result.current.onPageChange(1);
    });
    expect(result.current.page).toBe(1);
    expect(result.current.pageRows.map((row) => row.id)).toEqual([11, 12]);
    act(() => {
      result.current.onRowsPerPageChange(25);
    });
    expect(result.current.page).toBe(0);
    expect(result.current.pageRows).toHaveLength(12);
  });

  it("alerts when overview fails", async () => {
    (api.getDataApi as jest.Mock).mockRejectedValue(new Error("nope"));
    const { result } = renderHook(() => useAdminOverviewHelper());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(showAlert).toHaveBeenCalled();
    expect(result.current.data).toBeNull();
  });
});
