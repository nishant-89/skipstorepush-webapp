import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProfileDataRequest } from "src/containers/redux/slices/profile";
import { UserSettings, UserSettingsUpdate } from "src/containers/redux/types";
import { RootState } from "src/redux/rootReducers";
import { persistUserSettings } from "src/utils/persistUserSettings";
import { showAlert } from "src/utils/alert";
import { getErrorMessage } from "src/utils/common/constants";
import {
  LANGUAGE_OPTIONS,
  listTimeZones,
  withDefaultSettings,
} from "src/utils/userSettings";
import { mergeProfileSettings } from "src/containers/redux/slices/profile";

export const useSettingsHelper = () => {
  const dispatch = useDispatch();
  const { data, loading } = useSelector((state: RootState) => state.profile);
  const [savingKey, setSavingKey] = useState<string | null>(null);
  const settings = useMemo(
    () => withDefaultSettings(data?.settings),
    [data?.settings]
  );

  useEffect(() => {
    dispatch(fetchProfileDataRequest());
  }, [dispatch]);

  const save = async (updates: UserSettingsUpdate, key: string) => {
    setSavingKey(key);
    try {
      const saved = await persistUserSettings(updates);
      dispatch(mergeProfileSettings(saved));
      showAlert(1, "Settings saved");
    } catch (error) {
      showAlert(2, getErrorMessage(error));
    } finally {
      setSavingKey(null);
    }
  };

  const toggle = (
    field: keyof Pick<
      UserSettings,
      | "menuPinned"
      | "preservePinnedState"
      | "notificationEnabled"
      | "emailNotificationEnabled"
      | "releaseAlertEnabled"
      | "compactMode"
    >
  ) => {
    void save({ [field]: !settings[field] }, field);
  };

  const setTheme = (theme: "LIGHT" | "DARK") => {
    void save({ defaultTheme: theme }, "defaultTheme");
  };

  const setLanguage = (language: string) => {
    void save({ language }, "language");
  };

  const setTimezone = (timezone: string) => {
    void save({ timezone: timezone || null }, "timezone");
  };

  return {
    settings,
    loading,
    savingKey,
    languageOptions: LANGUAGE_OPTIONS,
    timeZones: listTimeZones(),
    toggle,
    setTheme,
    setLanguage,
    setTimezone,
  };
};
