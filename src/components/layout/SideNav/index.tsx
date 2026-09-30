import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Activity,
  CircleHelp,
  LayoutDashboard,
  Castle,
  Pin,
  PinOff,
  Settings,
  User,
  type LucideIcon,
} from "lucide-react";
import ROUTES from "src/routes/routesPaths";
import { UserPlaceholderIcon } from "src/utils/common/constants";
import { RootState } from "src/redux/rootReducers";

import { NAV_PIN_STORAGE_KEY } from "src/utils/userSettings";
import { persistUserSettings } from "src/utils/persistUserSettings";
import { mergeProfileSettings } from "src/containers/redux/slices/profile";

import "./index.scss";

export interface NavItem {
  name: string;
  path: string;
  canExpand?: boolean;
  children?: NavItem[];
  icon?: string;
  isHidden?: boolean;
  dockStart?: boolean;
}

export const sideNavItems: NavItem[] = [
  {
    name: "Dashboard",
    path: ROUTES.DASHBOARD,
  },
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
    dockStart: true,
  },
  {
    name: "Settings",
    path: ROUTES.SETTINGS,
  },
  {
    name: "My Account",
    path: ROUTES.MY_ACCOUNT,
    isHidden: true,
  },
];

const RAIL_ICONS: Record<string, LucideIcon> = {
  [ROUTES.DASHBOARD]: LayoutDashboard,
  [ROUTES.ALL_APPS]: Castle,
  [ROUTES.MY_ACTIVITIES]: Activity,
  [ROUTES.HELP]: CircleHelp,
  [ROUTES.SETTINGS]: Settings,
};

const ICON_SIZE = 20;

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
  const dispatch = useDispatch();
  const profile = useSelector((state: RootState) => state.profile.data);
  const avatarSrc = profile?.profileImage || UserPlaceholderIcon;

  const visibleItems = sideNavItems.filter((item) => !item.isHidden);
  const [hovered, setHovered] = useState(false);
  const [pinned, setPinned] = useState(readPinned);
  const expanded = pinned || hovered;

  useEffect(() => {
    if (typeof profile?.settings?.menuPinned === "boolean") {
      setPinned(profile.settings.menuPinned);
    }
  }, [profile?.settings?.menuPinned]);
  const isProfileActive = pathname === ROUTES.MY_ACCOUNT;
  const activeIndex = visibleItems.findIndex((item) =>
    isItemActive(pathname, item)
  );
  const ActiveIcon = isProfileActive
    ? User
    : (RAIL_ICONS[visibleItems[activeIndex]?.path] ?? LayoutDashboard);

  const handleSelect = (item: NavItem) => {
    navigate(item.path);
  };

  const preservePinnedState = Boolean(
    profile?.settings?.preservePinnedState
  );

  const handleTogglePin = () => {
    if (preservePinnedState) {
      return;
    }
    const next = !pinned;
    setPinned(next);
    window.localStorage.setItem(NAV_PIN_STORAGE_KEY, String(next));
    void persistUserSettings({ menuPinned: next })
      .then((saved) => {
        dispatch(mergeProfileSettings(saved));
      })
      .catch(() => {
        setPinned(!next);
        window.localStorage.setItem(NAV_PIN_STORAGE_KEY, String(!next));
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
          <ActiveIcon size={ICON_SIZE} strokeWidth={1.8} />
        </div>

        <div className="sideNavExpanded" aria-hidden={!expanded}>
          <button
            type="button"
            className={`sideNavItem sideNavPin${pinned ? " isActive" : ""}${preservePinnedState ? " isLocked" : ""}`}
            onClick={handleTogglePin}
            disabled={preservePinnedState}
            aria-pressed={pinned}
            aria-label={
              preservePinnedState
                ? "Pinned state is preserved"
                : pinned
                  ? "Unpin menu"
                  : "Pin menu"
            }
          >
            {pinned ? (
              <Pin size={ICON_SIZE} strokeWidth={2.2} />
            ) : (
              <PinOff size={ICON_SIZE} strokeWidth={1.7} />
            )}
            <span className="sideNavTooltip">
              {preservePinnedState
                ? "Pinned state is preserved"
                : pinned
                  ? "Unpin menu"
                  : "Pin menu"}
            </span>
          </button>

          <div className="sideNavList">
            {visibleItems.map((item) => {
              const Icon = RAIL_ICONS[item.path] ?? LayoutDashboard;
              const isActive = isItemActive(pathname, item);
              return (
                <button
                  key={item.path}
                  type="button"
                  className={`sideNavItem${isActive ? " isActive" : ""}${item.dockStart ? " sideNavDock" : ""}`}
                  onClick={() => handleSelect(item)}
                  aria-current={isActive ? "page" : undefined}
                  aria-label={item.name}
                >
                  <Icon size={ICON_SIZE} strokeWidth={isActive ? 2.2 : 1.7} />
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
            className={`sideNavProfile${isProfileActive ? " isActive" : ""}`}
            aria-label="My Account"
            onClick={() => navigate(ROUTES.MY_ACCOUNT)}
          >
            <img className="sideNavAvatar" src={avatarSrc} alt="" />
            {isProfileActive ? (
              <span className="sideNavActiveDot" aria-hidden="true" />
            ) : null}
            <span className="sideNavTooltip">Profile</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default SideNav;
