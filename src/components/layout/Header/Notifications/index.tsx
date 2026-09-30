import { useCallback, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { Bell } from "lucide-react";
import Popover from "@mui/material/Popover";
import { getDataApi, patchDataApi } from "src/apis/api";
import ButtonComp from "src/components/common/Button";
import { apiRoutes } from "src/utils/common/constants";
import ROUTES from "src/routes/routesPaths";
import { RootState } from "src/redux/rootReducers";
import {
  NOTIFICATIONS_UNREAD_REFRESH,
} from "src/utils/notifications";
import {
  formatRelativeTime,
  getActorImage,
  getActorInitials,
  getNotificationDestination,
  isCollaboratorInvite,
  canAcceptInvite,
} from "./helper";
import { NotificationItem, NotificationsListData } from "./types";
import "./notifications.scss";

type ApiEnvelope<T> = {
  success?: boolean;
  data?: T;
};

const Notifications = () => {
  const navigate = useNavigate();
  const notificationsEnabled = useSelector(
    (state: RootState) =>
      state.profile.data?.settings?.notificationEnabled !== false
  );
  const [unreadCount, setUnreadCount] = useState(0);
  const [items, setItems] = useState<NotificationItem[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loadingList, setLoadingList] = useState(false);
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const fetchingRef = useRef(false);
  const open = Boolean(anchorEl);

  const fetchUnread = useCallback(async () => {
    try {
      const response = (await getDataApi({
        path: apiRoutes.NotificationsUnread,
      })) as ApiEnvelope<{ unreadCount?: number }>;
      if (response?.success) {
        setUnreadCount(Number(response.data?.unreadCount) || 0);
      }
    } catch {
      // Keep the last known count if the badge request fails.
    }
  }, []);

  const fetchList = useCallback(async (nextPage: number, append = false) => {
    if (fetchingRef.current) {
      return;
    }
    fetchingRef.current = true;
    setLoadingList(true);
    try {
      const response = (await getDataApi({
        path: apiRoutes.Notifications,
        data: { page: nextPage, limit: 20 },
      })) as ApiEnvelope<NotificationsListData>;
      if (response?.success && response.data) {
        const list = response.data.list || [];
        setItems((current) => (append ? [...current, ...list] : list));
        setTotal(response.data.total_items || 0);
        setPage(response.data.page || nextPage);
        setUnreadCount(Number(response.data.unreadCount) || 0);
      }
    } catch {
      if (!append) {
        setItems([]);
      }
    } finally {
      fetchingRef.current = false;
      setLoadingList(false);
    }
  }, []);

  useEffect(() => {
    void fetchUnread();
    const onRefresh = () => {
      void fetchUnread();
    };
    window.addEventListener(NOTIFICATIONS_UNREAD_REFRESH, onRefresh);
    return () => {
      window.removeEventListener(NOTIFICATIONS_UNREAD_REFRESH, onRefresh);
    };
  }, [fetchUnread]);

  const handleOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
    void fetchList(1);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const markRead = async (id: number) => {
    try {
      await patchDataApi({
        path: `${apiRoutes.Notifications}/${id}/read`,
      });
      setItems((current) =>
        current.map((item) =>
          item.id === id ? { ...item, isRead: true } : item
        )
      );
      setUnreadCount((count) => Math.max(0, count - 1));
    } catch {
      // Row can still be clicked again if the read request fails.
    }
  };

  const handleRowClick = async (item: NotificationItem) => {
    if (!item.isRead) {
      await markRead(item.id);
    }
    if (isCollaboratorInvite(item)) {
      return;
    }
    const destination = getNotificationDestination(item);
    if (destination) {
      handleClose();
      navigate(destination);
    }
  };

  const handleAccept = async (item: NotificationItem) => {
    if (!canAcceptInvite(item)) {
      return;
    }
    if (!item.isRead) {
      await markRead(item.id);
    }
    setItems((current) =>
      current.map((row) =>
        row.id === item.id
          ? {
              ...row,
              accepted: true,
              inviteOpen: false,
              payload: { ...(row.payload ?? {}), accepted: true, inviteOpen: false },
            }
          : row
      )
    );
    handleClose();
    navigate(getNotificationDestination(item) || ROUTES.ALL_APPS);
  };

  const handleMarkAll = async () => {
    try {
      await patchDataApi({ path: apiRoutes.NotificationsReadAll });
      setItems((current) => current.map((item) => ({ ...item, isRead: true })));
      setUnreadCount(0);
    } catch {
      // Leave items unread if the bulk update fails.
    }
  };

  const canLoadMore = items.length < total && !loadingList;

  return (
    <>
      <button
        type="button"
        className={`notifyBell${notificationsEnabled ? "" : " isDisabled"}${unreadCount > 0 ? " hasUnread" : ""}`}
        aria-label="Notifications"
        aria-expanded={open}
        onClick={handleOpen}
      >
        <Bell size={20} strokeWidth={1.7} aria-hidden="true" />
        {unreadCount > 0 ? (
          <span className="notifyBadge">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        ) : null}
      </button>
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        slotProps={{
          paper: { className: "notifyPopoverPaper" },
        }}
      >
        <div className="notifyPanel">
          <div className="notifyPanelHead">
            <h2>Notifications</h2>
            <button
              type="button"
              className="notifyMarkAll"
              onClick={() => {
                void handleMarkAll();
              }}
              disabled={unreadCount === 0}
            >
              Mark all as read
            </button>
          </div>
          {!notificationsEnabled ? (
            <p className="notifyDisabledBanner">
              New notifications are disabled unless enabled from{" "}
              <Link to={ROUTES.SETTINGS} onClick={handleClose}>
                Settings
              </Link>
              .
            </p>
          ) : null}
          <ul className="notifyList">
            {items.map((item) => (
              <li
                key={item.id}
                className={`notifyRow${item.isRead ? "" : " isUnread"}`}
              >
                <button
                  type="button"
                  className="notifyMain"
                  onClick={() => {
                    void handleRowClick(item);
                  }}
                >
                  <span className="notifyAvatar" aria-hidden="true">
                    {getActorImage(item) ? (
                      <img src={getActorImage(item)} alt="" />
                    ) : (
                      getActorInitials(item)
                    )}
                  </span>
                  <span className="notifyBody">
                    <span className="notifyMessage">{item.message || item.title}</span>
                    <span className="notifyMeta">
                      {formatRelativeTime(item.createdDate)}
                      {typeof item.payload?.appName === "string"
                        ? ` • ${item.payload.appName}`
                        : ""}
                    </span>
                  </span>
                  {!item.isRead ? (
                    <span className="notifyUnreadDot" aria-hidden="true" />
                  ) : null}
                </button>
                {isCollaboratorInvite(item) ? (
                  <div className="notifyActions">
                    <span title="Coming soon">
                      <ButtonComp
                        label="Decline"
                        variant="outlined"
                        disabled
                        className="notifyDecline"
                      />
                    </span>
                    <ButtonComp
                      label="Accept"
                      variant="contained"
                      className="notifyAccept"
                      disabled={!canAcceptInvite(item)}
                      onClick={() => {
                        void handleAccept(item);
                      }}
                    />
                  </div>
                ) : null}
              </li>
            ))}
          </ul>
          {loadingList && items.length === 0 ? (
            <p className="notifyEmpty">Loading…</p>
          ) : null}
          {!loadingList && items.length === 0 ? (
            <p className="notifyEmpty">No notifications yet</p>
          ) : null}
          {canLoadMore ? (
            <button
              type="button"
              className="notifyLoadMore"
              onClick={() => {
                void fetchList(page + 1, true);
              }}
            >
              Load more
            </button>
          ) : null}
        </div>
      </Popover>
    </>
  );
};

export default Notifications;
