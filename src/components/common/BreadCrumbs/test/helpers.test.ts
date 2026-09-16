import UseBreadCrumbHelper from "../helpers";
import { matchPath, useLocation } from "react-router-dom";
import * as SideNav from "src/components/layout/SideNav";
import { renderHook } from "@testing-library/react";

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useLocation: jest.fn(),
  matchPath: jest.fn(),
}));

const mockSideNavItems = [
  {
    name: "Apps",
    path: "/apps",
    children: [
      {
        name: "App Details",
        path: "/apps/:appId",
        children: [
          {
            name: "Releases",
            path: "/apps/:appId/releases",
          },
        ],
      },
    ],
  },
  { name: "Profile", path: "/profile" },
];

describe("UseBreadCrumbHelper", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (SideNav as any).sideNavItems = mockSideNavItems;
  });

  it("returns Apps > App Details for /apps/123", () => {
    (useLocation as jest.Mock).mockReturnValue({ pathname: "/apps/123" });
    (matchPath as jest.Mock).mockImplementation(({ path }, pathname) => {
      if (path === "/apps" && pathname.startsWith("/apps"))
        return { params: {} };
      if (path === "/apps/:appId" && /^\/apps\/\w+$/.test(pathname))
        return { params: { appId: "123" } };
      return null;
    });
    const { result } = renderHook(() => UseBreadCrumbHelper());
    expect(result.current.breadcrumbTrail).toEqual([
      { name: "Apps", path: "/apps" },
      { name: "App Details", path: "/apps/123" },
    ]);
  });

  it("returns Apps > App Details > Releases for /apps/123/releases", () => {
    (useLocation as jest.Mock).mockReturnValue({
      pathname: "/apps/123/releases",
    });
    (matchPath as jest.Mock).mockImplementation(({ path }, pathname) => {
      if (path === "/apps" && pathname.startsWith("/apps"))
        return { params: {} };
      if (path === "/apps/:appId" && /^\/apps\/\w+/.test(pathname))
        return { params: { appId: "123" } };
      if (
        path === "/apps/:appId/releases" &&
        /^\/apps\/\w+\/releases$/.test(pathname)
      )
        return { params: { appId: "123" } };
      return null;
    });
    const { result } = renderHook(() => UseBreadCrumbHelper());
    expect(result.current.breadcrumbTrail).toEqual([
      { name: "Apps", path: "/apps" },
      { name: "App Details", path: "/apps/123" },
      { name: "Releases", path: "/apps/123/releases" },
    ]);
  });

  it("returns Profile breadcrumb for /profile", () => {
    (useLocation as jest.Mock).mockReturnValue({ pathname: "/profile" });
    (matchPath as jest.Mock).mockImplementation(({ path }, pathname) => {
      if (path === "/profile" && pathname === "/profile") return { params: {} };
      return null;
    });
    const { result } = renderHook(() => UseBreadCrumbHelper());
    expect(result.current.breadcrumbTrail).toEqual([
      { name: "Profile", path: "/profile" },
    ]);
  });

  it("returns empty array for unknown path", () => {
    (useLocation as jest.Mock).mockReturnValue({ pathname: "/unknown" });
    (matchPath as jest.Mock).mockReturnValue(null);
    const { result } = renderHook(() => UseBreadCrumbHelper());
    expect(result.current.breadcrumbTrail).toEqual([]);
  });
});
