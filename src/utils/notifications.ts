export const NOTIFICATIONS_UNREAD_REFRESH = "skipstore-notifications-unread-refresh";

export const requestUnreadRefresh = () => {
  if (typeof window === "undefined") {
    return;
  }
  window.dispatchEvent(new Event(NOTIFICATIONS_UNREAD_REFRESH));
};
