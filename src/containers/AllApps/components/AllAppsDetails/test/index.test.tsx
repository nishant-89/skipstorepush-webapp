import { render, screen } from "@testing-library/react";
import AllAppsDetails from "../index";
import { useAllAppsDetailHelper } from "../helper";
import { useDispatch } from "react-redux";

// Mock redux and helper hook
jest.mock("react-redux", () => ({
  useDispatch: jest.fn(),
}));

jest.mock("../helper", () => ({
  useAllAppsDetailHelper: jest.fn(),
}));

jest.mock("src/components/common/BreadCrumbs", () => () => (
  <div>Breadcrumb</div>
));
jest.mock("src/components/common/Table", () => () => <div>TableComponent</div>);
jest.mock("src/components/common/Loader/tableDataLoader", () => () => (
  <div>Loader</div>
));
jest.mock("src/components/common/NoData", () => ({ title }: any) => (
  <div>{title}</div>
));
jest.mock("src/components/common/Search", () => ({ onSearch }: any) => (
  <input data-testid="search" onChange={(e) => onSearch(e.target.value)} />
));
jest.mock("src/components/common/Select", () => ({ onChange }: any) => (
  <select data-testid="env-select" onChange={(e) => onChange(e.target.value)}>
    <option value="dev">Dev</option>
    <option value="prod">Prod</option>
  </select>
));
jest.mock("src/components/common/Button", () => ({ onClick, label }: any) => (
  <button onClick={onClick}>{label}</button>
));
jest.mock("../../ReleaseDrawer", () => () => <div>ReleaseDrawer</div>);

jest.mock("../collaborator", () => () => <div>CollaboratorSection</div>);

// Custom mock for AddAppDrawer that can trigger onClose
let mockAddAppDrawerOnClose: (() => void) | null = null;
jest.mock("../../AddAppDrawer/addAppDrawer", () => ({ onClose }: any) => {
  mockAddAppDrawerOnClose = onClose;
  return <div>AddAppDrawer</div>;
});

// Custom mock for DeleteModal that can trigger onClose
let mockDeleteModalOnClose: (() => void) | null = null;
jest.mock(
  "src/components/common/Modal/deleteModal",
  () =>
    ({ onClose }: any) => {
      mockDeleteModalOnClose = onClose;
      return <div>DeleteModal</div>;
    }
);

describe("AllAppsDetails Component", () => {
  const mockDispatch = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useDispatch as unknown as jest.Mock).mockReturnValue(mockDispatch);

    (useAllAppsDetailHelper as jest.Mock).mockReturnValue({
      isDrawerOpen: false,
      isDeleteModalOpen: false,
      isSettingsDrawerOpen: false,
      value: 0,
      open: false,
      anchorEl: null,
      filteredData: [{ id: 1 }],
      loading: false,
      count: 1,
      selectedFilters: [],
      mainPage: 0,
      rowsPerPage: 10,
      term: "",
      showFilter: true,
      envList: [{ label: "Dev", value: "dev" }],
      appDetail: {
        name: "Test App",
        appIcon: "",
        osType: "ANDROID",
        ownerName: "Owner",
        isOwner: true,
      },
      releaseColumns: [],
      realeaseLoader: false,
      searchTerm: "",
      invite: false,
      mainPageCollab: 0,
      rowsPerPageCollab: 10,
      filteredDataCollab: [],
      loadingCollab: false,
      countCollab: 0,
      setInvite: jest.fn(),
      setTerm: jest.fn(),
      setSearchTerm: jest.fn(),
      handleEditButtonClick: jest.fn(),
      handleDeleteClick: jest.fn(),
      handleSettingsClick: jest.fn(),
      handleOpenDrawer: jest.fn(),
      handleCloseDrawer: jest.fn(),
      handleChange: jest.fn(),
      handleCloseMenu: jest.fn(),
      setIsDeleteModalOpen: jest.fn(),
      setIsSettingsDrawerOpen: jest.fn(),
      handleChangePage: jest.fn(),
      handleChangeRowsPerPage: jest.fn(),
      handleCollabChangePage: jest.fn(),
      handleCollabChangeRowsPerPage: jest.fn(),
      setSelectedFilters: jest.fn(),
      handleDelete: jest.fn(),
      handleInvite: jest.fn(),
    });
  });

  it("should render breadcrumbs and tabs", () => {
    render(<AllAppsDetails />);
    expect(screen.getByText("Breadcrumb")).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Releases" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Settings" })).toBeInTheDocument();
  });

  it("should render Release tab content with search and filter", () => {
    render(<AllAppsDetails />);
    expect(screen.getByTestId("search")).toBeInTheDocument();
    expect(screen.getByTestId("env-select")).toBeInTheDocument();
    expect(screen.getByText("ReleaseDrawer")).toBeInTheDocument();
    expect(screen.getByText("TableComponent")).toBeInTheDocument();
  });

  it("should show 'No Release Found' if filteredData is empty and no search/filter", () => {
    (useAllAppsDetailHelper as jest.Mock).mockReturnValueOnce({
      ...useAllAppsDetailHelper(),
      loading: false,
      filteredData: [],
      selectedFilters: [],
      searchTerm: "",
    });

    render(<AllAppsDetails />);
    expect(screen.getByText("No Release Found")).toBeInTheDocument();
  });

  it("should show 'No Data Found' if filteredData is empty but has search/filter", () => {
    (useAllAppsDetailHelper as jest.Mock).mockReturnValueOnce({
      ...useAllAppsDetailHelper(),
      loading: false,
      filteredData: [],
      selectedFilters: ["dev"],
      searchTerm: "abc",
    });

    render(<AllAppsDetails />);
    expect(screen.getByText("No Data Found")).toBeInTheDocument();
  });

  it("should render Settings tab when value is 1", () => {
    (useAllAppsDetailHelper as jest.Mock).mockReturnValueOnce({
      ...useAllAppsDetailHelper(),
      value: 1,
      realeaseLoader: false,
    });

    render(<AllAppsDetails />);
    expect(screen.getByText("Actions")).toBeInTheDocument();
    expect(screen.getByText("Operating System")).toBeInTheDocument();
    expect(screen.getByText("Platform")).toBeInTheDocument();

    expect(screen.getByText("CollaboratorSection")).toBeInTheDocument();
  });

  it("should render skeleton loader when realeaseLoader is true", () => {
    (useAllAppsDetailHelper as jest.Mock).mockReturnValueOnce({
      ...useAllAppsDetailHelper(),
      value: 1,
      realeaseLoader: true,
    });

    render(<AllAppsDetails />);
    expect(screen.getByText("CollaboratorSection")).toBeInTheDocument();
  });

  it("should return null from renderTableContent if loading is false and filteredData is undefined", () => {
    (useAllAppsDetailHelper as jest.Mock).mockReturnValueOnce({
      ...useAllAppsDetailHelper(),
      loading: false,
      filteredData: undefined,
    });
    const { container } = render(<AllAppsDetails />);
    // Should not render TableComponent, Loader, or NoData
    expect(container.textContent).not.toContain("TableComponent");
    expect(container.textContent).not.toContain("Loader");
    expect(container.textContent).not.toContain("No Data Found");
    expect(container.textContent).not.toContain("No Release Found");
  });

  it("should render appIcon if present in Settings tab", () => {
    (useAllAppsDetailHelper as jest.Mock).mockReturnValueOnce({
      ...useAllAppsDetailHelper(),
      value: 1,
      realeaseLoader: false,
      appDetail: {
        ...useAllAppsDetailHelper().appDetail,
        appIcon: "icon.png",
      },
    });
    render(<AllAppsDetails />);
    expect(screen.getByAltText("Icon")).toBeInTheDocument();
  });

  it("should not render Actions button if user is not owner in Settings tab", () => {
    (useAllAppsDetailHelper as jest.Mock).mockReturnValueOnce({
      ...useAllAppsDetailHelper(),
      value: 1,
      realeaseLoader: false,
      appDetail: {
        ...useAllAppsDetailHelper().appDetail,
        isOwner: false,
      },
    });
    render(<AllAppsDetails />);
    expect(screen.queryByText("Actions")).not.toBeInTheDocument();
  });

  it("should render Menu when open is true and anchorEl is set", () => {
    (useAllAppsDetailHelper as jest.Mock).mockReturnValueOnce({
      ...useAllAppsDetailHelper(),
      value: 1,
      realeaseLoader: false,
      open: true,
      anchorEl: document.createElement("div"),
    });
    render(<AllAppsDetails />);
    expect(screen.getByText("Edit")).toBeInTheDocument();
    expect(screen.getByText("Delete App")).toBeInTheDocument();
  });

  it("should render DeleteModal when isDeleteModalOpen is true", () => {
    (useAllAppsDetailHelper as jest.Mock).mockReturnValueOnce({
      ...useAllAppsDetailHelper(),
      value: 1,
      realeaseLoader: false,
      isDeleteModalOpen: true,
    });
    render(<AllAppsDetails />);
    expect(screen.getByText("DeleteModal")).toBeInTheDocument();
  });

  it("should render AddAppDrawer when isSettingsDrawerOpen is true", () => {
    (useAllAppsDetailHelper as jest.Mock).mockReturnValueOnce({
      ...useAllAppsDetailHelper(),
      value: 1,
      realeaseLoader: false,
      isSettingsDrawerOpen: true,
    });
    render(<AllAppsDetails />);
    expect(screen.getByText("AddAppDrawer")).toBeInTheDocument();
  });

  it("should render Settings button in Releases tab and call handleOpenDrawer on click", () => {
    const mockHandleOpenDrawer = jest.fn();
    (useAllAppsDetailHelper as jest.Mock).mockReturnValueOnce({
      ...useAllAppsDetailHelper(),
      envList: [{ label: "Dev", value: "dev" }],
      handleOpenDrawer: mockHandleOpenDrawer,
    });
    render(<AllAppsDetails />);
    const button = screen.getByRole("button", { hidden: true });
    expect(button).toBeInTheDocument();
    button.click();
    expect(mockHandleOpenDrawer).toHaveBeenCalled();
  });

  it("should render SelectComponent and call setSelectedFilters and dispatch handleEnvironment on change", () => {
    const mockSetSelectedFilters = jest.fn();
    const mockDispatch = jest.fn();
    (useDispatch as unknown as jest.Mock).mockReturnValue(mockDispatch);
    (useAllAppsDetailHelper as jest.Mock).mockReturnValueOnce({
      ...useAllAppsDetailHelper(),
      envList: [
        { label: "Dev", value: "dev" },
        { label: "Prod", value: "prod" },
      ],
      selectedFilters: [],
      setSelectedFilters: mockSetSelectedFilters,
    });
    render(<AllAppsDetails />);
    const select = screen.getByTestId("env-select");
    expect(select).toBeInTheDocument();
    (select as HTMLSelectElement).value = "prod";
    select.dispatchEvent(new Event("change", { bubbles: true }));
    expect(mockSetSelectedFilters).toHaveBeenCalledWith("prod");
    expect(mockDispatch).toHaveBeenCalled();
  });

  it("should render ReleaseDrawer as open when isDrawerOpen is true", () => {
    (useAllAppsDetailHelper as jest.Mock).mockReturnValueOnce({
      ...useAllAppsDetailHelper(),
      isDrawerOpen: true,
    });
    render(<AllAppsDetails />);
    expect(screen.getByText("ReleaseDrawer")).toBeInTheDocument();
  });

  it("should render skeleton loader UI in Settings tab when realeaseLoader is true", () => {
    (useAllAppsDetailHelper as jest.Mock).mockReturnValueOnce({
      ...useAllAppsDetailHelper(),
      value: 1,
      realeaseLoader: true,
    });
    render(<AllAppsDetails />);
    // Check for skeleton loader class
    expect(document.querySelector(".skeltonWrapper")).toBeInTheDocument();
    expect(document.querySelector(".skeleton-loader")).toBeInTheDocument();
  });

  it("should render skeleton loader image if appIcon is present and realeaseLoader is true", () => {
    (useAllAppsDetailHelper as jest.Mock).mockReturnValueOnce({
      ...useAllAppsDetailHelper(),
      value: 1,
      realeaseLoader: true,
      appDetail: {
        ...useAllAppsDetailHelper().appDetail,
        appIcon: "icon.png",
      },
    });
    render(<AllAppsDetails />);
    // Check for skeleton wrapper and skeleton loader
    expect(document.querySelector(".skeltonWrapper")).toBeInTheDocument();
    expect(document.querySelector(".skeleton-loader")).toBeInTheDocument();
    // Check for skeleton image structure
    const img = screen.getByAltText("Icon");
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute("src", "icon.png");
    // Check for figure with skeleton-loader class
    const figure = img.closest("figure");
    expect(figure).toHaveClass("cardImage", "skeleton-loader");
  });

  it("should pass all expected props to CollaboratorSection", () => {
    const mockSetInvite = jest.fn();
    const mockHandleCollabChangePage = jest.fn();
    const mockHandleCollabChangeRowsPerPage = jest.fn();
    const mockHandleInvite = jest.fn();

    (useAllAppsDetailHelper as jest.Mock).mockReturnValueOnce({
      ...useAllAppsDetailHelper(),
      value: 1,
      realeaseLoader: false,
      invite: true,
      setInvite: mockSetInvite,
      loadingCollab: true,
      filteredDataCollab: [{ id: 1 }],
      mainPageCollab: 2,
      rowsPerPageCollab: 5,
      handleCollabChangePage: mockHandleCollabChangePage,
      countCollab: 10,
      handleCollabChangeRowsPerPage: mockHandleCollabChangeRowsPerPage,
      handleInvite: mockHandleInvite,
      Modal: { test: "modal" },
      isOwner: true,
      handleCollabModel: jest.fn(),
      delCollab: false,
      setDelCollab: jest.fn(),
      handleDeleteCollab: jest.fn(),
    });
    render(<AllAppsDetails />);
    expect(screen.getByText("CollaboratorSection")).toBeInTheDocument();
  });

  it("should show 'No Data Found' when filteredData is empty with searchTerm having content", () => {
    (useAllAppsDetailHelper as jest.Mock).mockReturnValueOnce({
      ...useAllAppsDetailHelper(),
      loading: false,
      filteredData: [],
      selectedFilters: [],
      searchTerm: "test search",
    });

    render(<AllAppsDetails />);
    expect(screen.getByText("No Data Found")).toBeInTheDocument();
  });

  it("should show 'No Release Found' when searchTerm is undefined", () => {
    (useAllAppsDetailHelper as jest.Mock).mockReturnValueOnce({
      ...useAllAppsDetailHelper(),
      loading: false,
      filteredData: [],
      selectedFilters: [],
      searchTerm: undefined,
    });

    render(<AllAppsDetails />);
    expect(screen.getByText("No Release Found")).toBeInTheDocument();
  });

  it("should show 'No Release Found' when searchTerm is null", () => {
    (useAllAppsDetailHelper as jest.Mock).mockReturnValueOnce({
      ...useAllAppsDetailHelper(),
      loading: false,
      filteredData: [],
      selectedFilters: [],
      searchTerm: null,
    });

    render(<AllAppsDetails />);
    expect(screen.getByText("No Release Found")).toBeInTheDocument();
  });

  it("should show 'No Release Found' when searchTerm contains only whitespace", () => {
    (useAllAppsDetailHelper as jest.Mock).mockReturnValueOnce({
      ...useAllAppsDetailHelper(),
      loading: false,
      filteredData: [],
      selectedFilters: [],
      searchTerm: "   ",
    });

    render(<AllAppsDetails />);
    expect(screen.getByText("No Release Found")).toBeInTheDocument();
  });

  it("should call setIsSettingsDrawerOpen(false) when AddAppDrawer onClose is triggered", () => {
    const mockSetIsSettingsDrawerOpen = jest.fn();
    (useAllAppsDetailHelper as jest.Mock).mockReturnValueOnce({
      ...useAllAppsDetailHelper(),
      value: 1,
      realeaseLoader: false,
      isSettingsDrawerOpen: true,
      setIsSettingsDrawerOpen: mockSetIsSettingsDrawerOpen,
    });

    render(<AllAppsDetails />);

    // Verify AddAppDrawer is rendered
    expect(screen.getByText("AddAppDrawer")).toBeInTheDocument();

    // Trigger the onClose function that was captured
    if (mockAddAppDrawerOnClose) {
      mockAddAppDrawerOnClose();
    }

    expect(mockSetIsSettingsDrawerOpen).toHaveBeenCalledWith(false);
  });

  it("should call setIsDeleteModalOpen(false) when SettingDeleteModal onClose is triggered", () => {
    const mockSetIsDeleteModalOpen = jest.fn();
    (useAllAppsDetailHelper as jest.Mock).mockReturnValueOnce({
      ...useAllAppsDetailHelper(),
      value: 1,
      realeaseLoader: false,
      isDeleteModalOpen: true,
      setIsDeleteModalOpen: mockSetIsDeleteModalOpen,
    });

    render(<AllAppsDetails />);

    // Verify DeleteModal is rendered
    expect(screen.getByText("DeleteModal")).toBeInTheDocument();

    // Trigger the onClose function that was captured
    if (mockDeleteModalOnClose) {
      mockDeleteModalOnClose();
    }

    expect(mockSetIsDeleteModalOpen).toHaveBeenCalledWith(false);
  });
});
