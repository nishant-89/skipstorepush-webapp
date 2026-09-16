import { useLocation, matchPath } from "react-router-dom";
import { sideNavItems } from "src/components/layout/SideNav";

type NavItem = {
  name: string;
  path: string;
  canExpand?: boolean;
  children?: NavItem[];
};

const replaceParamsInPath = (
  path: string,
  params: Record<string, string>
): string => {
  let resolvedPath = path;
  Object.entries(params).forEach(([key, value]) => {
    resolvedPath = resolvedPath.replace(`:${key}`, value);
  });
  return resolvedPath;
};

const findBreadcrumbTrail = (
  items: NavItem[],
  currentPath: string,
  collectedParams: Record<string, string> = {},
  trail: { name: string; path: string }[] = []
): { name: string; path: string }[] => {
  for (const item of items) {
    const match = matchPath({ path: item.path, end: false }, currentPath);
    if (match) {
      const mergedParams = Object.entries(match?.params ?? {}).reduce(
        (acc, [key, value]) => {
          if (typeof value === "string") {
            acc[key] = value;
          }
          return acc;
        },
        { ...collectedParams } as Record<string, string>
      );
      const resolvedPath = replaceParamsInPath(item.path, mergedParams);

      const newTrail = [...trail, { name: item.name, path: resolvedPath }];

      if (item.children) {
        const childTrail = findBreadcrumbTrail(
          item.children,
          currentPath,
          mergedParams,
          newTrail
        );
        if (childTrail.length > newTrail.length) {
          return childTrail;
        }
      }

      if (matchPath({ path: item.path, end: true }, currentPath)) {
        return newTrail;
      }

      return newTrail;
    }
  }

  return trail;
};

const UseBreadCrumbHelper = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  const breadcrumbTrail = findBreadcrumbTrail(sideNavItems, currentPath);

  return {
    breadcrumbTrail, // array of { name, resolved path }
  };
};

export default UseBreadCrumbHelper;
