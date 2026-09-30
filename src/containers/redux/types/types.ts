export type UserData = {
  userId: number;
  email: string;
  userName: string;
  image: string;
  azureUserId: string;
  id: string;
  accessKeyId: string;
  accessKey: string;
};

export type AuthData = {
  userAuthToken: string;
  userData: UserData;
};

export type AuthResponse = {
  statusCode: number;
  success: boolean;
  message: string;
  data: AuthData;
  error: Record<string, unknown>;
  timestamp: string;
};

// profile
export type AuthType = "GITHUB" | "BASIC";

export interface ProfileSession {
  sessionId: string;
  createdDate: string;
}

export type UserTheme = "LIGHT" | "DARK";

export interface UserSettings {
  id?: number;
  userId?: number;
  menuPinned: boolean;
  preservePinnedState: boolean;
  notificationEnabled: boolean;
  defaultTheme: UserTheme;
  emailNotificationEnabled: boolean;
  releaseAlertEnabled: boolean;
  compactMode: boolean;
  language: string;
  timezone: string | null;
  extras?: Record<string, unknown> | null;
  createdDate?: string;
  updatedDate?: string;
}

export type UserSettingsUpdate = Partial<
  Pick<
    UserSettings,
    | "menuPinned"
    | "preservePinnedState"
    | "notificationEnabled"
    | "defaultTheme"
    | "emailNotificationEnabled"
    | "releaseAlertEnabled"
    | "compactMode"
    | "language"
    | "timezone"
  >
>;

export interface Profile {
  id: number;
  azureUserId?: string;
  oauthId?: string;
  email: string;
  fullName: string;
  profileImage?: string;
  authType: AuthType;
  createdDate: string;
  lastLogin?: string;
  session?: ProfileSession | null;
  settings?: UserSettings;
}

export interface ProfileDataState {
  loading: boolean;
  data: Profile | null;
  error: string;
}

export interface ProfileResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: Profile;
  error: object;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export interface FaqGroup {
  id: string;
  title: string;
  items: FaqItem[];
}

export interface FaqStillStuck {
  message: string;
  docsUrl: string;
  supportEmail: string;
}

export interface FaqData {
  groups: FaqGroup[];
  search: string;
  totalItems: number;
  isEmpty: boolean;
  emptyMessage: string | null;
  stillStuck: FaqStillStuck;
}

export interface FaqResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: FaqData;
}

export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
}

export interface ChangePasswordResponse {
  statusCode: number;
  success: boolean;
  message: string;
}

// all apps

export interface AllAppState {
  loading: boolean;
  filteredData: [];
  count: number;
  error: string | null;
  page: number;
  isRefresh: boolean;
  rowsPerPage: number;
}

export interface FetchAllAppStatePayload {
  page: number;
  limit: number;
  type: string[];
  search?: string;
}

export interface AllAppResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: AllApp;
  error: object;
}

export interface AllApp {
  list: AppItem[];
  current_page: number;
  total_items: number;
  page: number;
  page_limit: number;
}

export interface AppItem {
  id: string;
  azureAppId: string;
  azureOwnerId: string;
  name: string;
  ownerId: string;
  osType: string;
  appIcon: string;
  status: string;
  createdDate: string;
  updatedDate: string;
  ownerName: string;
}

// Release

export interface FetchReleaseStatePayload {
  appId: string;
  page: number;
  limit: number;
  type: string;
  search?: string;
}

export interface ReleaseState {
  loading: boolean;
  filteredData: [];
  count: number;
  error: string | null;
  page: number;
  isRefresh: boolean;
  rowsPerPage: number;
  envId: string;
}

export interface ReleaseResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: Release;
  error: object;
}

export interface Release {
  list: ReleaseItem[];
  current_page: number;
  total_items: number;
  page: number;
  page_limit: number;
}

export interface ReleaseItem {
  id: string;
  isMandatory: boolean;
  updatedDate: string;
  releaseNote: string;
  releaseVersion: string;
  rollbackCount: number;
  status: string;
  target_version: string;
  environmentName: string;
  appName: string;
  createdDate: string;
}

//auth
export interface AuthState {
  loading: boolean;
  accessToken: string;
  error: string;
  user: UserData;
}

//profile
export interface ProfileProps {
  loading: boolean;
  data: Profile;
}

//collab
export interface FetchCollaboratorsStatePayload {
  page: number;
  limit: number;
  appId: string;
}

export interface CollaboratorsState {
  loading: boolean;
  filteredData: [];
  count: number;
  error: string | null;
  page: number;
  isRefresh: boolean;
  rowsPerPage: number;
}

export interface CollaboratorsResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: Collaborators;
  error: object;
}

export interface Collaborators {
  list: CollaboratorsItem[];
  current_page: number;
  total_items: number;
  page: number;
  page_limit: number;
}

export interface CollaboratorsItem {
  email: string;
  fullName: string;
  id: string;
  profile_image: string;
  role: string;
  status: string;
}
