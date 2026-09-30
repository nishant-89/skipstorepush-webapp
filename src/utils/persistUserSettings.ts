import { patchDataApi } from "src/apis/api";
import { UserSettings, UserSettingsUpdate } from "src/containers/redux/types/types";
import { apiRoutes } from "src/utils/common/constants/constants";
import { applyUserSettings } from "src/utils/userSettings";

type SettingsResponse = {
  success?: boolean;
  message?: string;
  data?: UserSettings;
};

export const persistUserSettings = async (
  updates: UserSettingsUpdate
): Promise<UserSettings> => {
  const response = (await patchDataApi({
    path: apiRoutes.UserSettings,
    data: updates,
  })) as SettingsResponse;

  if (!response?.success || !response.data) {
    throw new Error(response?.message || "Unable to save settings");
  }

  applyUserSettings(response.data);
  return response.data;
};
