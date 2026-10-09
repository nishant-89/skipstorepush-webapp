import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import {
  adminActivityColumns,
  adminAppColumns,
  adminCustomerColumns,
} from "../columns";

describe("admin columns", () => {
  it("links a customer name to the customer page", () => {
    const cell = adminCustomerColumns[0].renderCell?.({
      id: 4,
      email: "ada@example.com",
      fullName: "Ada",
      authType: "BASIC",
      status: "ACTIVE",
      createdDate: "2026-01-01T00:00:00.000Z",
      appCount: 2,
    });
    render(<MemoryRouter>{cell}</MemoryRouter>);
    expect(screen.getByRole("link")).toHaveAttribute("href", "/admin/customers/4");
  });

  it("links an app name to the app page", () => {
    const cell = adminAppColumns[0].renderCell?.({
      id: 7,
      name: "Store",
      osType: "IOS",
      status: "ACTIVE",
      ownerId: 1,
      ownerName: "Ada",
      ownerEmail: "ada@example.com",
      collaboratorCount: 1,
      createdDate: "2026-01-01T00:00:00.000Z",
      updatedDate: "2026-01-01T00:00:00.000Z",
    });
    render(<MemoryRouter>{cell}</MemoryRouter>);
    expect(screen.getByRole("link")).toHaveAttribute("href", "/admin/apps/7");
  });

  it("links the app owner to the customer page", () => {
    const cell = adminAppColumns
      .find((column) => column.field === "ownerName")
      ?.renderCell?.({
        id: 7,
        name: "Store",
        osType: "IOS",
        status: "ACTIVE",
        ownerId: 4,
        ownerName: "Ada",
        ownerEmail: "ada@example.com",
        collaboratorCount: 1,
        createdDate: "2026-01-01T00:00:00.000Z",
        updatedDate: "2026-01-01T00:00:00.000Z",
      });
    render(<MemoryRouter>{cell}</MemoryRouter>);
    expect(screen.getByRole("link", { name: "Ada" })).toHaveAttribute(
      "href",
      "/admin/customers/4"
    );
  });

  it("does not link deleted apps in activity", () => {
    const cell = adminActivityColumns
      .find((column) => column.field === "appName")
      ?.renderCell?.({
        id: 1,
        action: "APP_DELETED",
        targetType: "APP",
        targetId: 7,
        appId: 7,
        appName: "Store",
        appExists: false,
        status: "SUCCESS",
        metadata: null,
        createdDate: "2026-01-01T00:00:00.000Z",
      });
    render(<MemoryRouter>{cell}</MemoryRouter>);
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
    expect(screen.getByText("Store")).toBeInTheDocument();
  });
});
