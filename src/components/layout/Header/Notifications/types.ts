export const NOTIFICATION_TYPE = {
  COLLABORATOR_INVITED: "COLLABORATOR_INVITED",
  COLLABORATOR_ACCEPTED: "COLLABORATOR_ACCEPTED",
  COLLABORATOR_DECLINED: "COLLABORATOR_DECLINED",
  COLLABORATOR_REMOVED: "COLLABORATOR_REMOVED",
  INVITATION_REVOKED: "INVITATION_REVOKED",
  RELEASE_CREATED: "RELEASE_CREATED",
  RELEASE_PROMOTED: "RELEASE_PROMOTED",
  RELEASE_ROLLED_BACK: "RELEASE_ROLLED_BACK",
  APP_DELETED: "APP_DELETED",
} as const;

export type NotificationType =
  (typeof NOTIFICATION_TYPE)[keyof typeof NOTIFICATION_TYPE];

export type NotificationItem = {
  id: number;
  type: string;
  title: string;
  message: string;
  appId: number | null;
  targetType: string;
  targetId: number;
  payload: Record<string, unknown> | null;
  isRead: boolean;
  readDate: string | null;
  createdDate: string;
  actorId?: number | null;
  actorName?: string | null;
  actorProfileImage?: string | null;
  appExists?: boolean;
  accepted?: boolean;
  declined?: boolean;
  inviteOpen?: boolean;
};

export type NotificationsListData = {
  list: NotificationItem[];
  current_page: number;
  total_items: number;
  page: number;
  page_limit: number;
  unreadCount: number;
};
