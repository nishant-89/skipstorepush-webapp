import { ReactNode } from "react";
import { renderHook, waitFor, act } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import * as api from "src/apis/api";
import { showAlert } from "src/utils/alert";
import { apiRoutes } from "src/utils/common/constants/constants";
import {
  formatAdminLabel,
  useAdminActivitiesHelper,
  useAdminAppHelper,
  useAdminAppsHelper,
  useAdminCustomerHelper,
  useAdminCustomersHelper,
  useAdminOverviewHelper,
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
    });
    expect(result.current.data?.name).toBe("Store");
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
    });
    expect(result.current.data?.fullName).toBe("Ada");
  });

  it("alerts when overview fails", async () => {
    (api.getDataApi as jest.Mock).mockRejectedValue(new Error("nope"));
    const { result } = renderHook(() => useAdminOverviewHelper());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(showAlert).toHaveBeenCalled();
    expect(result.current.data).toBeNull();
  });
});
