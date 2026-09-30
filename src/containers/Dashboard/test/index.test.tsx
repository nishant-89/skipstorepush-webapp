import { render, screen } from "@testing-library/react";
import Dashboard from "../index";

jest.mock("src/components/common/BreadCrumbs", () => ({
  __esModule: true,
  default: ({ title }: { title: string }) => <h1>{title}</h1>,
}));

describe("Dashboard", () => {
  it("renders a blank dashboard shell", () => {
    render(<Dashboard />);
    expect(screen.getByRole("heading", { name: "Dashboard" })).toBeInTheDocument();
  });
});
