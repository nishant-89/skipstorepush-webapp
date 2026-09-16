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
  it("should render app name with correct link", () => {
    renderColumnCell(0);

    const link = screen.getByRole("link", { name: /my test app/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", `/all-apps/details/${mockRow.id}`);
  });

  it("should render empty string when app name is null/undefined", () => {
    const mockRowWithoutName = {
      ...mockRow,
      name: undefined,
    } as unknown as ALL_APPS_RESPONSE_TYPE;
    renderColumnCell(0, mockRowWithoutName);

    const link = screen.getByRole("link");
    expect(link).toBeInTheDocument();
    expect(link).toHaveTextContent("");
    expect(link).toHaveAttribute("href", `/all-apps/details/${mockRow.id}`);
  });

  it("should display iOS if osType is 'IOS'", () => {
    renderColumnCell(1);

    expect(screen.getByText("iOS")).toBeInTheDocument();
  });

  it("should display Android if osType is not 'IOS'", () => {
    const androidRow = { ...mockRow, osType: "android" };
    renderColumnCell(1, androidRow);

    expect(screen.getByText("Android")).toBeInTheDocument();
  });

  it("should have correct column metadata", () => {
    expect(allAppsColumns[0].field).toBe("name");
    expect(allAppsColumns[0].sorting).toBe(true);
    expect(allAppsColumns[0].headerName).toBe("Name");

    expect(allAppsColumns[1].field).toBe("osType");
    expect(allAppsColumns[1].sorting).toBe(false);
    expect(allAppsColumns[1].headerName).toBe("OS");

    expect(allAppsColumns[2].field).toBe("ownerName");
    expect(allAppsColumns[2].sorting).toBe(false);
    expect(allAppsColumns[2].headerName).toBe("Owner");
  });
});
