import ROUTES from "src/routes/routesPaths";
import { NOTIFICATION_TYPE, NotificationItem } from "./types";

export const isCollaboratorInvite = (item: NotificationItem) =>
  item.type === NOTIFICATION_TYPE.COLLABORATOR_INVITED;

export const isAppGone = (item: NotificationItem) =>
  item.type === NOTIFICATION_TYPE.APP_DELETED ||
  item.appExists === false ||
  item.payload?.appExists === false;

export const canAcceptInvite = (item: NotificationItem) => {
  if (!isCollaboratorInvite(item)) {
    return false;
  }
  if (item.accepted === true || item.payload?.accepted === true) {
    return false;
  }
  if (item.inviteOpen === false || item.payload?.inviteOpen === false) {
    return false;
  }
  return true;
};

export const getActorImage = (item: NotificationItem) => {
  if (typeof item.actorProfileImage === "string" && item.actorProfileImage.trim()) {
    return item.actorProfileImage.trim();
  }
  if (
    typeof item.payload?.actorProfileImage === "string" &&
    item.payload.actorProfileImage.trim()
  ) {
    return item.payload.actorProfileImage.trim();
  }
  return "";
};

export const getNotificationDestination = (
  item: NotificationItem
): string | null => {
  if (isAppGone(item)) {
    return null;
  }

  if (isCollaboratorInvite(item)) {
    return ROUTES.INVITATION.replace(":id", String(item.targetId));
  }

  if (item.targetType === "RELEASE" && item.appId && item.targetId) {
    return `/all-apps/details/${item.appId}/release/${item.targetId}`;
  }

  const appId = item.appId ?? (item.targetType === "APP" ? item.targetId : null);
  if (appId) {
    return `/all-apps/details/${appId}`;
  }

  return null;
};

export const formatRelativeTime = (dateStr: string): string => {
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const diffMs = Date.now() - date.getTime();
  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;

  if (diffMs < minute) {
    return "Just now";
  }
  if (diffMs < hour) {
    const mins = Math.floor(diffMs / minute);
    return `${mins} min${mins === 1 ? "" : "s"} ago`;
  }
  if (diffMs < day) {
    const hours = Math.floor(diffMs / hour);
    return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  }
  if (diffMs < 7 * day) {
    const days = Math.floor(diffMs / day);
    return `${days} day${days === 1 ? "" : "s"} ago`;
  }

  return date.toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

export const getActorInitials = (item: NotificationItem): string => {
  const actor =
    (typeof item.actorName === "string" && item.actorName) ||
    (typeof item.payload?.actorName === "string" && item.payload.actorName) ||
    item.title ||
    "N";
  const parts = actor.trim().split(/\s+/);
  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }
  return `${parts[0][0] ?? ""}${parts[1][0] ?? ""}`.toUpperCase();
};
