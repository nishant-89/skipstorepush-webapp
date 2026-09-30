import { render, screen, within } from "@testing-library/react";
import Breadcrumbs from "../index";

jest.mock("../helpers", () => () => ({
  breadcrumbTrail: [
    { name: "All Apps", path: "/all-apps" },
    { name: "App Details", path: "/all-apps/details/123" },
    { name: "Release Details", path: "/all-apps/details/123/release/456" },
  ],
}));

jest.mock("react-router-dom", () => ({
  Link: ({ to, children, ...props }: any) => (
    <a href={to} {...props}>
      {children}
    </a>
  ),
}));

jest.mock("@mui/material", () => ({
  Skeleton: ({ width, height }: any) => (
    <div data-testid="skeleton" style={{ width, height }} />
  ),
}));

describe("Breadcrumbs component", () => {
  it("renders breadcrumb links and separators correctly", () => {
    const { container } = render(<Breadcrumbs />);
    const links = screen.getAllByRole("link");
    expect(links).toHaveLength(2);
    expect(links[0]).toHaveAttribute("href", "/all-apps");
    expect(links[0]).toHaveTextContent("All Apps");
    expect(links[1]).toHaveAttribute("href", "/all-apps/details/123");
    expect(links[1]).toHaveTextContent("App Details");
    const breadcrumbList = container.querySelector(
      ".breadcrumbList"
    ) as HTMLElement;
    expect(breadcrumbList).toBeInTheDocument();
    const lastBreadcrumb =
      within(breadcrumbList).getAllByText("Release Details")[0];
    expect(lastBreadcrumb.tagName).toBe("SPAN");
    expect(
      within(breadcrumbList).getAllByText((content) => content.trim() === "/")
    ).toHaveLength(2);
  });

  it("appends the app name in braces", () => {
    render(<Breadcrumbs contextName="SkipStore" />);
    expect(screen.getByText("{SkipStore}")).toBeInTheDocument();
  });

  it("renders skeleton when loading is true", () => {
    render(<Breadcrumbs loading />);
    expect(screen.getByTestId("skeleton")).toBeInTheDocument();
  });

  it("replaces the current crumb label when currentLabel is set", () => {
    render(<Breadcrumbs currentLabel="Hello, Ada" />);
    expect(screen.getByText("Hello, Ada")).toBeInTheDocument();
    expect(screen.queryByText("Release Details")).not.toBeInTheDocument();
  });
});
