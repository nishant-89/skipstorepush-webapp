import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { activityColumns } from "../column";
import { ActivityItem } from "../types";

const mockRow: ActivityItem = {
  id: 1,
  action: "APP_CREATED",
  targetType: "APP",
  targetId: 9,
  appId: 9,
  appExists: true,
  status: "SUCCESS",
  metadata: { name: "Store", osType: "IOS" },
  createdDate: "2026-09-08T13:00:00.000Z",
  updatedDate: "2026-09-08T13:00:00.000Z",
};

const renderColumnCell = (columnIndex: number, rowData = mockRow) => {
  const Cell = activityColumns[columnIndex].renderCell;
  return render(<MemoryRouter>{Cell?.(rowData)}</MemoryRouter>);
};

describe("activityColumns", () => {
  it("links to the app details page for active apps", () => {
    renderColumnCell(0);
    const link = screen.getByRole("link", { name: "Store" });
    expect(link).toHaveAttribute("href", "/all-apps/details/9");
  });

  it("does not link deleted apps", () => {
    renderColumnCell(0, {
      ...mockRow,
      action: "APP_DELETED",
      appExists: false,
    });
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
    expect(screen.getByText("Store")).toBeInTheDocument();
  });

  it("renders target as the title and action as the subtitle", () => {
    renderColumnCell(1);
    expect(screen.getByText("App")).toBeInTheDocument();
    expect(screen.getByText("App Created")).toBeInTheDocument();
  });

  it("renders a dash when there is no app", () => {
    renderColumnCell(0, { ...mockRow, appId: null, metadata: null });
    expect(screen.getByText("—")).toBeInTheDocument();
  });

  it("renders metadata details without repeating the app name", () => {
    renderColumnCell(3);
    expect(screen.getByText("iOS")).toBeInTheDocument();
  });

  it("renders a status indicator instead of plain text", () => {
    renderColumnCell(4);
    expect(screen.queryByText("Success")).not.toBeInTheDocument();
    expect(screen.getByLabelText("Success")).toHaveClass("success");
  });
});
