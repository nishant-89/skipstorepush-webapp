import React from "react";
import { useNavigate } from "react-router-dom";
import ROUTES from "src/routes/routesPaths";
import { AllappsSidebarIcon } from "src/utils/common/constants";

import "./index.scss";

export interface NavItem {
  name: string;
  path: string;
  canExpand?: boolean;
  children?: NavItem[];
  icon?: string;
  isHidden?: boolean;
}

export const sideNavItems: NavItem[] = [
  {
    name: "All Apps",
    path: ROUTES.ALL_APPS,
    icon: AllappsSidebarIcon,
    children: [
      {
        name: "App Details",
        path: ROUTES.ALL_APPS_DETAILS,
        canExpand: false,
        children: [
          {
            name: "Release Details",
            path: ROUTES.RELEASE_DETAILS,
            canExpand: false,
          },
        ],
      },
    ],
  },
];

const checkChildActive = (path: string, childrens: NavItem[]) => {
  return childrens.some(
    (item) => item.path.split("/")[1] === path.split("/")[1]
  );
};

const SideNav = () => {
  const navigate = useNavigate();
  const path = window.location.pathname;
  const list = sideNavItems;

  return (
    <div className="sideNav">
      <div className="sideWrap">
        <ul>
          {list.map((item: NavItem) => (
            <React.Fragment key={item.name}>
              <li
                key={`${item.name}-${item.path}`}
                className={
                  path === item.path ||
                  checkChildActive(path, item.children ? item.children : [])
                    ? "active"
                    : ""
                }
              >
                <div
                  onClick={() => {
                    navigate(item.path);
                  }}
                >
                  {item.icon && <img src={item.icon} alt={item.name} />}
                  <span className="navText">{item.name}</span>
                </div>
              </li>
            </React.Fragment>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default SideNav;
