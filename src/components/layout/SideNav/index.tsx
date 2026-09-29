import React, { useLayoutEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Activity,
  CircleHelp,
  LayoutGrid,
  Pin,
  type LucideIcon,
} from "lucide-react";
import ROUTES from "src/routes/routesPaths";
import { UserPlaceholderIcon } from "src/utils/common/constants";
import { RootState } from "src/redux/rootReducers";

import "./index.scss";

export const NAV_PIN_STORAGE_KEY = "skipstore_nav_pinned";

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
  {
    name: "My Activities",
    path: ROUTES.MY_ACTIVITIES,
  },
  {
    name: "Help & FAQ",
    path: ROUTES.HELP,
  },
  {
    name: "My Account",
    path: ROUTES.MY_ACCOUNT,
    isHidden: true,
  },
];

const RAIL_ICONS: Record<string, LucideIcon> = {
  [ROUTES.ALL_APPS]: LayoutGrid,
  [ROUTES.MY_ACTIVITIES]: Activity,
  [ROUTES.HELP]: CircleHelp,
};

export const checkChildActive = (path: string, childrens: NavItem[]) => {
  return childrens.some(
    (item) => item.path.split("/")[1] === path.split("/")[1]
  );
};

const isItemActive = (path: string, item: NavItem) =>
  path === item.path || checkChildActive(path, item.children ?? []);

const readPinned = () => {
  if (typeof window === "undefined") {
    return false;
  }
  return window.localStorage.getItem(NAV_PIN_STORAGE_KEY) === "true";
};

const SideNav = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const profile = useSelector((state: RootState) => state.profile.data);
  const avatarSrc = profile?.profileImage || UserPlaceholderIcon;

  const visibleItems = sideNavItems.filter((item) => !item.isHidden);
  const [hovered, setHovered] = useState(false);
  const [pinned, setPinned] = useState(readPinned);
  const [pillY, setPillY] = useState(0);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const listRef = useRef<HTMLDivElement>(null);
  const expanded = pinned || hovered;

  const activeIndex = Math.max(
    0,
    visibleItems.findIndex((item) => isItemActive(pathname, item))
  );
  const ActiveIcon = RAIL_ICONS[visibleItems[activeIndex]?.path] ?? LayoutGrid;

  useLayoutEffect(() => {
    const el = itemRefs.current[activeIndex];
    const list = listRef.current;
    if (!el || !list) return;
    const listRect = list.getBoundingClientRect();
    const elRect = el.getBoundingClientRect();
    setPillY(elRect.top - listRect.top);
  }, [activeIndex, expanded, pathname]);

  const handleSelect = (item: NavItem, idx: number) => {
    const el = itemRefs.current[idx];
    const list = listRef.current;
    if (el && list) {
      const listRect = list.getBoundingClientRect();
      const elRect = el.getBoundingClientRect();
      setPillY(elRect.top - listRect.top);
    }
    navigate(item.path);
  };

  const handleTogglePin = () => {
    setPinned((current) => {
      const next = !current;
      window.localStorage.setItem(NAV_PIN_STORAGE_KEY, String(next));
      return next;
    });
  };

  return (
    <nav
      className={`sideNav${expanded ? " isExpanded" : ""}${pinned ? " isPinned" : ""}`}
      aria-label="Main"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
    >
      <div className="sideNavRail">
        <div className="sideNavCollapsed" aria-hidden={expanded}>
          <ActiveIcon size={16} strokeWidth={1.8} />
        </div>

        <div className="sideNavExpanded" aria-hidden={!expanded}>
          <button
            type="button"
            className={`sideNavItem sideNavPin${pinned ? " isActive" : ""}`}
            onClick={handleTogglePin}
            aria-pressed={pinned}
            aria-label={pinned ? "Unpin menu" : "Pin menu"}
          >
            <Pin size={16} strokeWidth={pinned ? 2.2 : 1.7} />
            <span className="sideNavTooltip">
              {pinned ? "Unpin menu" : "Pin menu"}
            </span>
          </button>

          <div className="sideNavList" ref={listRef}>
            <div
              className="sideNavPill"
              aria-hidden="true"
              style={{ top: pillY }}
            />
            {visibleItems.map((item, idx) => {
              const Icon = RAIL_ICONS[item.path] ?? LayoutGrid;
              const isActive = isItemActive(pathname, item);
              return (
                <button
                  key={item.path}
                  type="button"
                  ref={(el) => {
                    itemRefs.current[idx] = el;
                  }}
                  className={`sideNavItem${isActive ? " isActive" : ""}`}
                  onClick={() => handleSelect(item, idx)}
                  aria-current={isActive ? "page" : undefined}
                  aria-label={item.name}
                >
                  <Icon size={16} strokeWidth={isActive ? 2.2 : 1.7} />
                  {isActive ? (
                    <span className="sideNavActiveDot" aria-hidden="true" />
                  ) : null}
                  <span className="sideNavTooltip">{item.name}</span>
                </button>
              );
            })}
          </div>

          <div className="sideNavDivider" />

          <button
            type="button"
            className={`sideNavProfile${pathname === ROUTES.MY_ACCOUNT ? " isActive" : ""}`}
            aria-label="My Account"
            onClick={() => navigate(ROUTES.MY_ACCOUNT)}
          >
            <img className="sideNavAvatar" src={avatarSrc} alt="" />
            <span className="sideNavTooltip">Profile</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default SideNav;
