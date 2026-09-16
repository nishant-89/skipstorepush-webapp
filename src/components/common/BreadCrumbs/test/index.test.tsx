import { render, screen, within } from "@testing-library/react";
import Breadcrumbs from "../index";

// Mock UseBreadCrumbHelper to control breadcrumbTrail
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
    const { container } = render(<Breadcrumbs title="Release Details" />);
    // Should render two links and one span for the last item
    const links = screen.getAllByRole("link");
    expect(links).toHaveLength(2);
    expect(links[0]).toHaveAttribute("href", "/all-apps");
    expect(links[0]).toHaveTextContent("All Apps");
    expect(links[1]).toHaveAttribute("href", "/all-apps/details/123");
    expect(links[1]).toHaveTextContent("App Details");
    // Last breadcrumb is a span inside the breadcrumbList
    const breadcrumbList = container.querySelector(
      ".breadcrumbList"
    ) as HTMLElement;
    expect(breadcrumbList).toBeInTheDocument();
    const lastBreadcrumb =
      within(breadcrumbList).getAllByText("Release Details")[0];
    expect(lastBreadcrumb.tagName).toBe("SPAN");
    // Should render two separators
    expect(
      within(breadcrumbList).getAllByText((content) => content.trim() === "/")
    ).toHaveLength(2);
  });

  it("renders the title", () => {
    render(<Breadcrumbs title="Release Details" />);
    // The title is in an h1 with class mainTitle
    const title = screen.getByRole("heading", { level: 1 });
    expect(title).toHaveClass("mainTitle");
    expect(title).toHaveTextContent("Release Details");
  });

  it("renders skeleton when loading is true", () => {
    render(<Breadcrumbs title="Release Details" loading={true} />);
    expect(screen.getByTestId("skeleton")).toBeInTheDocument();
  });
});
