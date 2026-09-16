import { render, screen } from "@testing-library/react";
import AllApps from "../index";
import { useAllAppsHelper } from "../helper";

interface MockProps {
  title?: string;
  placeholder?: string;
}

// Mocks for children components
jest.mock("src/components/common/BreadCrumbs", () => ({
  __esModule: true,
  default: ({ title }: MockProps) => <div>{title}</div>,
}));

jest.mock("src/components/common/Search", () => ({
  __esModule: true,
  default: ({ placeholder }: MockProps) => <input placeholder={placeholder} />,
}));

interface MockButtonProps {
  label: string;
  onClick?: () => void;
  disabled?: boolean;
}

jest.mock("src/components/common/Button", () => ({
  __esModule: true,
  default: ({ label, onClick }: MockButtonProps) => (
    <button onClick={onClick}>{label}</button>
  ),
}));

jest.mock("src/components/common/Table", () => ({
  __esModule: true,
  default: () => <div data-testid="table-component">Table</div>,
}));

jest.mock("src/components/common/Loader/tableDataLoader", () => ({
  __esModule: true,
  default: () => <div data-testid="table-loader">Loading...</div>,
}));

interface MockButtonProps {
  title: string;
  buttonLabel: string;
  buttonAction?: () => void;
}

interface MockProps {
  open: boolean;
}

jest.mock("src/components/common/NoData", () => ({
  __esModule: true,
  default: ({ title, buttonLabel, buttonAction }: MockButtonProps) => (
    <div>
      <p>{title}</p>
      {buttonLabel && <button onClick={buttonAction}>{buttonLabel}</button>}
    </div>
  ),
}));

jest.mock("../components/AddAppDrawer/addAppDrawer", () => ({
  __esModule: true,
  default: ({ open }: MockProps) =>
    open ? <div data-testid="app-drawer">Drawer Open</div> : null,
}));

jest.mock("src/components/common/Filter/allAppFilter", () => ({
  __esModule: true,
  default: () => <div data-testid="filter-popup">Filter Popup</div>,
}));

jest.mock("../helper", () => ({
  useAllAppsHelper: jest.fn(),
}));

// Setup mock values
const mockHelperValues = {
  handleOpenDrawer: jest.fn(),
  handleCloseDrawer: jest.fn(),
  isDrawerOpen: false,
  filteredData: [],
  loading: false,
  setSearchTerm: jest.fn(),
  setTerm: jest.fn(),
  term: "",
  mainPage: 0,
  count: 0,
  rowsPerPage: 10,
  handleChangePage: jest.fn(),
  handleChangeRowsPerPage: jest.fn(),
  selectedFilters: [],
  setSelectedFilters: jest.fn(),
  setIsRedIndicator: jest.fn(),
  isRedIndicator: false,
  showFilter: true,
  searchTerm: "",
  user: { userName: "Test User" },
};

describe("AllApps Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useAllAppsHelper as jest.Mock).mockReturnValue(mockHelperValues);
  });

  it("renders breadcrumbs and UI controls", () => {
    render(<AllApps />);
    expect(screen.getByText("Hello, Test User")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Search")).toBeInTheDocument();
    expect(screen.getByTestId("filter-popup")).toBeInTheDocument();
  });

  it("shows loading state", () => {
    (useAllAppsHelper as jest.Mock).mockReturnValue({
      ...mockHelperValues,
      loading: true,
    });
    render(<AllApps />);
    expect(screen.getByTestId("table-loader")).toBeInTheDocument();
  });

  it("shows 'No App Found' when no data, no filters, and no search", () => {
    render(<AllApps />);
    expect(screen.getByText("No App Found")).toBeInTheDocument();
  });

  it("shows 'No Data Found' when no data, but with filters or search term", () => {
    (useAllAppsHelper as jest.Mock).mockReturnValue({
      ...mockHelperValues,
      selectedFilters: ["someFilter"],
    });
    render(<AllApps />);
    expect(screen.getByText("No Data Found")).toBeInTheDocument();
  });

  it("shows table when data is available", () => {
    (useAllAppsHelper as jest.Mock).mockReturnValue({
      ...mockHelperValues,
      filteredData: [{ id: 1, name: "Test App" }],
    });
    render(<AllApps />);
    expect(screen.getByTestId("table-component")).toBeInTheDocument();
  });

  //   it("opens drawer when 'Add App' button is clicked", () => {
  //     render(<AllApps />);
  //     const addButton = screen.getByText("Add App");
  //     fireEvent.click(addButton);
  //     expect(mockHelperValues.handleOpenDrawer).toHaveBeenCalled();
  //   });

  it("renders drawer when isDrawerOpen is true", () => {
    (useAllAppsHelper as jest.Mock).mockReturnValue({
      ...mockHelperValues,
      isDrawerOpen: true,
    });
    render(<AllApps />);
    expect(screen.getByTestId("app-drawer")).toBeInTheDocument();
  });
});
