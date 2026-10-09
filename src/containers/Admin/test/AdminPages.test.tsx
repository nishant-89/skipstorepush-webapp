import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import AdminOverview from "../AdminOverview";
import AdminCustomers from "../AdminCustomers";
import AdminCustomer from "../AdminCustomer";
import AdminApps from "../AdminApps";
import AdminApp from "../AdminApp";
import AdminActivities from "../AdminActivities";
import {
  useAdminActivitiesHelper,
  useAdminAppHelper,
  useAdminAppsHelper,
  useAdminCustomerHelper,
  useAdminCustomersHelper,
  useAdminOverviewHelper,
} from "../helper";

jest.mock("src/components/common/BreadCrumbs/BreadCrumbs", () => ({
  __esModule: true,
  default: () => <div data-testid="breadcrumbs" />,
}));

jest.mock("src/components/common/Search/Search", () => ({
  __esModule: true,
  default: ({ placeholder }: { placeholder?: string }) => (
    <input placeholder={placeholder} />
  ),
}));

jest.mock("src/components/common/Table/Table", () => ({
  __esModule: true,
  default: () => <div data-testid="table-component">Table</div>,
}));

jest.mock("src/components/common/Loader/tableDataLoader", () => ({
  __esModule: true,
  default: () => <div data-testid="table-loader">Loading...</div>,
}));

jest.mock("src/components/common/NoData/NoData", () => ({
  __esModule: true,
  default: ({ title }: { title: string }) => <div>{title}</div>,
}));

jest.mock("../helper", () => ({
  formatAdminLabel: (value?: string) => value || "—",
  useAdminOverviewHelper: jest.fn(),
  useAdminCustomersHelper: jest.fn(),
  useAdminCustomerHelper: jest.fn(),
  useAdminAppsHelper: jest.fn(),
  useAdminAppHelper: jest.fn(),
  useAdminActivitiesHelper: jest.fn(),
}));

const listHelper = {
  list: [{ id: 1 }],
  count: 1,
  loading: false,
  mainPage: 0,
  rowsPerPage: 10,
  searchTerm: "",
  term: "",
  setTerm: jest.fn(),
  setSearchTerm: jest.fn(),
  handleChangePage: jest.fn(),
  handleChangeRowsPerPage: jest.fn(),
};

describe("admin pages", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useAdminCustomersHelper as jest.Mock).mockReturnValue(listHelper);
    (useAdminAppsHelper as jest.Mock).mockReturnValue(listHelper);
    (useAdminActivitiesHelper as jest.Mock).mockReturnValue(listHelper);
  });

  it("renders overview stats and activity", () => {
    (useAdminOverviewHelper as jest.Mock).mockReturnValue({
      loading: false,
      preset: "last_7_days",
      from: "",
      to: "",
      setPreset: jest.fn(),
      setFrom: jest.fn(),
      setTo: jest.fn(),
      page: 0,
      rowsPerPage: 10,
      handleChangePage: jest.fn(),
      handleChangeRowsPerPage: jest.fn(),
      data: {
        customersActive: 4,
        apps: 11,
        actions7d: 20,
        failed7d: 2,
        actionsByType: {
          App: { successful: 3, failed: 1 },
        },
        customersRegistered: {
          total: 2,
          days: [{ date: "2026-10-08", count: 1 }, { date: "2026-10-09", count: 1 }],
        },
        appsCreated: {
          total: 3,
          days: [{ date: "2026-10-08", count: 3 }],
        },
        actionsByDay: [
          { date: "2026-10-08", App: 3, Release: 0, Collab: 0, Env: 0, Other: 0 },
        ],
        attention: {
          list: [{ id: 1, action: "APP_CREATED", status: "SUCCESS" }],
          total_items: 12,
          page: 1,
          page_limit: 10,
        },
      },
    });
    render(
      <MemoryRouter>
        <AdminOverview />
      </MemoryRouter>
    );
    expect(screen.getByText("Active customer accounts")).toBeInTheDocument();
    expect(screen.getByText("Across all customers")).toBeInTheDocument();
    expect(screen.getByText("11")).toBeInTheDocument();
    expect(screen.getByTestId("table-component")).toBeInTheDocument();
  });

  it("renders customer, app, and activity tables", () => {
    render(
      <MemoryRouter>
        <AdminCustomers />
        <AdminApps />
        <AdminActivities />
      </MemoryRouter>
    );
    expect(screen.getByPlaceholderText("Search customers")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Search apps")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Search activity")).toBeInTheDocument();
    expect(screen.getAllByTestId("table-component")).toHaveLength(3);
  });

  it("renders a customer detail", () => {
    (useAdminCustomerHelper as jest.Mock).mockReturnValue({
      loading: false,
      data: {
        id: 1,
        fullName: "Ada Lovelace",
        email: "ada@example.com",
        status: "ACTIVE",
        authType: "BASIC",
        createdDate: "2026-01-01T00:00:00.000Z",
        apps: [{ id: 2, name: "Store", osType: "IOS", role: "Owner", envCount: 1 }],
        collaborations: [],
        accessKeys: [{ id: 9, friendlyName: "CLI", accessKeyId: "ak_***", isSession: false }],
        recentActivity: [],
      },
    });
    render(
      <MemoryRouter>
        <AdminCustomer />
      </MemoryRouter>
    );
    expect(screen.getByText("Ada Lovelace")).toBeInTheDocument();
    expect(screen.getByText(/ada@example.com/)).toBeInTheDocument();
    expect(screen.getByText(/CLI/)).toBeInTheDocument();
  });

  it("renders an app detail without binary download UI", () => {
    (useAdminAppHelper as jest.Mock).mockReturnValue({
      loading: false,
      data: {
        id: 2,
        name: "Store",
        osType: "IOS",
        status: "ACTIVE",
        createdDate: "2026-01-01T00:00:00.000Z",
        owner: { id: 1, email: "ada@example.com", fullName: "Ada" },
        environments: [{ id: 1, name: "Staging", key: "stg_****", liveVersion: "1.0.0" }],
        collaborators: [{ id: null, email: "dev@example.com", fullName: null, role: "Collaborator", status: "pending" }],
        releases: [{ id: 8, releaseVersion: "1.0.0", targetVersion: "1.0", status: "LIVE", rollout: 100, createdDate: "2026-01-02T00:00:00.000Z" }],
      },
    });
    render(
      <MemoryRouter>
        <AdminApp />
      </MemoryRouter>
    );
    expect(screen.getByText("Store")).toBeInTheDocument();
    expect(screen.getByText(/Release files and download URLs are not shown/)).toBeInTheDocument();
    expect(screen.queryByText(/Pause/)).not.toBeInTheDocument();
    expect(screen.queryByText(/Rollback/)).not.toBeInTheDocument();
  });
});
