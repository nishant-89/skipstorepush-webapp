import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { allAppsColumns } from "../column"; // Adjust the path as needed
import { ALL_APPS_RESPONSE_TYPE } from "../types";

// Mock Data
const mockRow: ALL_APPS_RESPONSE_TYPE = {
  id: "app123",
  name: "My Test App",
  osType: "IOS",
  ownerName: "John Doe",
  createdDate: "",
  updatedDate: "",
  azureAppId: "",
  azureOwnerId: "",
  appIcon: "",
  status: "",
  ownerId: "",
};

// Helper component to render column cell
const renderColumnCell = (columnIndex: number, rowData = mockRow) => {
  const column = allAppsColumns[columnIndex];
  const Cell = column.renderCell;

  return render(<MemoryRouter>{Cell?.(rowData)}</MemoryRouter>);
};

describe("allAppsColumns config", () => {
  it("should display iOS if osType is 'IOS'", () => {
    renderColumnCell(0);

    expect(screen.getByLabelText("iOS")).toBeInTheDocument();
  });

  it("should display Android if osType is not 'IOS'", () => {
    const androidRow = { ...mockRow, osType: "android" };
    renderColumnCell(0, androidRow);

    expect(screen.getByLabelText("Android")).toBeInTheDocument();
  });

  it("should render app name with correct link", () => {
    renderColumnCell(1);

    const link = screen.getByRole("link", { name: /my test app/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", `/all-apps/details/${mockRow.id}`);
  });

  it("should render empty string when app name is null/undefined", () => {
    const mockRowWithoutName = {
      ...mockRow,
      name: undefined,
    } as unknown as ALL_APPS_RESPONSE_TYPE;
    renderColumnCell(1, mockRowWithoutName);

    const link = screen.getByRole("link");
    expect(link).toBeInTheDocument();
    expect(link).toHaveTextContent("");
    expect(link).toHaveAttribute("href", `/all-apps/details/${mockRow.id}`);
  });

  it("should render created date as Dth Mon YYYY", () => {
    renderColumnCell(3, {
      ...mockRow,
      createdDate: new Date(2026, 8, 30).toISOString(),
    });

    expect(screen.getByText("30th Sept 2026")).toBeInTheDocument();
  });

  it("should have correct column metadata", () => {
    expect(allAppsColumns[0].field).toBe("osType");
    expect(allAppsColumns[0].sorting).toBe(false);
    expect(allAppsColumns[0].headerName).toBe("OS");

    expect(allAppsColumns[1].field).toBe("name");
    expect(allAppsColumns[1].sorting).toBe(true);
    expect(allAppsColumns[1].headerName).toBe("Name");

    expect(allAppsColumns[2].field).toBe("ownerName");
    expect(allAppsColumns[2].sorting).toBe(false);
    expect(allAppsColumns[2].headerName).toBe("Owner");

    expect(allAppsColumns[3].field).toBe("createdDate");
    expect(allAppsColumns[3].sorting).toBe(false);
    expect(allAppsColumns[3].headerName).toBe("Created");
  });
});
