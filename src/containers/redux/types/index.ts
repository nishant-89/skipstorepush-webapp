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
export interface Profile {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  is_2FA_enabled: boolean;
  status: string | number;
  user_type: string | number;
  organization_id: string;
  organization_name: string;
  organization_site_id?: string | null;
  organization_site_name?: string | null;
  access_group_id?: string | null;
  access_group_name?: string | null;
  access_group_status?: string | number;
  domain: string;
  pos_api_key: string | null;
  pos_api_id: string | null;
  datawarehouse_key: string | null;
  client_type: string | number | null;
  is_pos_configured: boolean | null;
  is_access_group_updated?: boolean | null;
  reminder_2FA?: boolean | null;
  master_domain?: string | null;
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
