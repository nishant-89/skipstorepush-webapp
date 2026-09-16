export type ALL_APPS_RESPONSE_TYPE = {
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
};

export type COLLABRATOR_RESPONSE_TYPE = {
  id: string;
  fullName: string;
  email: string;
  role: string;
  profile_image: string;
  status: string;
};

export type RELEASE_RESPONSE_TYPE = {
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
  appId: string;
  appEnvironment: string;
  osType: string;
  releaseCount: number;
  isPromoted: boolean;
  rollout: number;
  released_by: {
    id: string;
    email: string;
    fullName: string;
  };
};

export interface Environment {
  id: string;
  azureEnvId: string;
  name: string;
  key: string;
  appId: string;
  azureAppId: string;
  createdDate: string;
  updatedDate: string;
}
export interface FilteredEnvironment {
  value: string;
  label: string;
  key: string;
}

export interface EnvApiResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: Environment[];
  error: Record<string, unknown>;
  timestamp: string;
}

export type RELEASE_DETAIL_RESPONSE_TYPE = {
  statusCode: number;
  success: boolean;
  message: string;
  data: RELEASE_RESPONSE_TYPE;
  error: Record<string, unknown>;
  timestamp: string;
};

export type ReleaseResponse = {
  statusCode: number;
  success: boolean;
  message: string;
  data: {
    id: string;
    releaseVersion: string;
    target_version: string;
    status: string;
    isMandatory: boolean;
    rollbackCount: number;
    releaseNote: string;
    appName: string;
    environmentName: string;
    appId: string;
    appEnvironment: string;
    createdDate: string;
    updatedDate: string;
  };
  error: Record<string, unknown>;
  timestamp: string;
};

export type ApiResponse = {
  statusCode: number;
  success: boolean;
  message: string;
  error: Record<string, unknown>;
  timestamp: string;
};

export type AppDetailResponse = {
  statusCode: number;
  success: boolean;
  message: string;
  data: AppDetailItem;
  error: Record<string, unknown>;
  timestamp: string;
};

export type AppDetailItem = {
  id: string;
  azureAppId: string;
  azureOwnerId: string;
  name: string;
  osType: string;
  appIcon: string;
  status: string;
  createdDate: string;
  updatedDate: string;
  ownerName: string;
  isOwner: boolean;
};

export type addPayloadType = {
  name: string;
  osType: string;
  appIcon?: string | null;
};

export type uploadPayloadType = {
  name: string;
  appIcon?: string | null;
};

export interface ValueLabelComponentProps {
  children: React.ReactElement;
  value: number;
}

export interface InviteFormValues {
  email: string;
}

export interface UpdateType {
  releaseNote?: string;
  isMandatory?: boolean;
}
