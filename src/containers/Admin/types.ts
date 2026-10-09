export interface AdminListResponse<T> {
  success: boolean;
  data?: {
    list: T[];
    total_items: number;
    page: number;
    page_limit: number;
  };
}

export type AdminDatePreset =
  | "today"
  | "yesterday"
  | "last_7_days"
  | "this_month"
  | "last_month"
  | "custom";

export interface AdminDayPoint {
  date: string;
  count: number;
}

export interface AdminDaySeries {
  total: number;
  days: AdminDayPoint[];
}

export interface AdminActionsDay {
  date: string;
  App: number;
  Release: number;
  Collab: number;
  Env: number;
  Other: number;
}

export interface AdminOverviewMix {
  successful: number;
  failed: number;
}

export interface AdminAttentionItem {
  id: number;
  createdDate: string;
  action: string;
  status: string;
  appId: number | null;
  appName: string | null;
  actorEmail: string | null;
  actorName: string | null;
}

export interface AdminOverviewData {
  range?: {
    preset: AdminDatePreset;
    timezone: string;
    from: string;
    to: string;
  };
  customersActive: number;
  apps: number;
  actions7d?: number;
  failed7d?: number;
  customersRegistered?: AdminDaySeries;
  appsCreated?: AdminDaySeries;
  iosApps?: AdminDaySeries;
  androidApps?: AdminDaySeries;
  releases?: AdminDaySeries;
  environments?: AdminDaySeries;
  invites?: AdminDaySeries;
  actions?: AdminDaySeries;
  failedActions?: AdminDaySeries;
  rollbacks?: AdminDaySeries;
  promotions?: AdminDaySeries;
  pauses?: AdminDaySeries;
  resumes?: AdminDaySeries;
  actors?: AdminDaySeries;
  actionsByType: Record<string, AdminOverviewMix>;
  actionsByDay?: AdminActionsDay[];
  attention?: {
    list: AdminAttentionItem[];
    total_items: number;
    page: number;
    page_limit: number;
  };
}

export interface AdminCustomerRow {
  id: number;
  email: string;
  fullName: string;
  username?: string;
  authType: string;
  status: string;
  createdDate: string;
  appCount: number;
}

export interface AdminCustomerApp {
  id: number;
  name: string;
  osType: string;
  status: string;
  updatedDate: string;
  role: string;
  envCount: number;
}

export interface AdminAccessKey {
  id: number;
  accessKeyId: string;
  friendlyName: string;
  expires: string;
  isSession: boolean;
  createdDate: string;
}

export interface AdminActivityRow {
  id: number;
  action: string;
  targetType: string;
  targetId: number;
  appId: number | null;
  appName: string | null;
  appExists: boolean;
  status: string;
  metadata: Record<string, unknown> | null;
  createdDate: string;
  actor?: {
    id: number;
    email: string | null;
    fullName: string | null;
  };
}

export interface AdminCustomerDetail {
  id: number;
  email: string;
  fullName: string;
  username?: string;
  profileImage?: string;
  authType: string;
  status: string;
  createdDate: string;
  apps: AdminCustomerApp[];
  collaborations: AdminCustomerApp[];
  accessKeys: AdminAccessKey[];
  recentActivity: AdminActivityRow[];
}

export interface AdminAppRow {
  id: number;
  name: string;
  osType: string;
  status: string;
  ownerId: number;
  ownerName: string | null;
  ownerEmail: string | null;
  collaboratorCount: number;
  createdDate: string;
  updatedDate: string;
}

export interface AdminAppDetail {
  id: number;
  name: string;
  osType: string;
  status: string;
  appIcon?: string;
  createdDate: string;
  updatedDate: string;
  owner: { id: number; email: string; fullName: string } | null;
  environments: {
    id: number;
    name: string;
    key: string;
    liveVersion: string | null;
  }[];
  collaborators: {
    id: number | null;
    email: string;
    fullName: string | null;
    role: string;
    status: string;
  }[];
  releases: {
    id: number;
    releaseVersion: string;
    targetVersion: string;
    status: string;
    rollout: number;
    isMandatory: boolean;
    rollbackCount: number;
    releaseCount: number;
    createdDate: string;
    environmentName: string | null;
    releasedByName: string | null;
  }[];
}
