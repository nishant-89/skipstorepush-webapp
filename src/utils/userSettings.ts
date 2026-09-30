import { UserSettings, UserSettingsUpdate } from "src/containers/redux/types/types";
import { applyTheme, ThemeName } from "src/utils/theme";

export const NAV_PIN_STORAGE_KEY = "skipstore_nav_pinned";
export const PRESERVE_PIN_STORAGE_KEY = "skipstore_preserve_pin";

export const COMPACT_STORAGE_KEY = "skipstore_compact";
export const LANGUAGE_STORAGE_KEY = "skipstore_language";
export const TIMEZONE_STORAGE_KEY = "skipstore_timezone";
export const NOTIFICATIONS_STORAGE_KEY = "skipstore_notifications";

export const LANGUAGE_OPTIONS = [
  { value: "en", label: "English" },
  { value: "es", label: "Spanish" },
  { value: "fr", label: "French" },
  { value: "de", label: "German" },
  { value: "pt", label: "Portuguese" },
  { value: "ja", label: "Japanese" },
  { value: "hi", label: "Hindi" },
];

export const themeFromApi = (theme?: string): ThemeName =>
  theme === "LIGHT" ? "light" : "dark";

export const themeToApi = (theme: ThemeName): "LIGHT" | "DARK" =>
  theme === "light" ? "LIGHT" : "DARK";

export const getStoredTimeZone = (): string | null => {
  if (typeof window === "undefined") {
    return null;
  }
  return window.localStorage.getItem(TIMEZONE_STORAGE_KEY);
};

export const listTimeZones = (): string[] => {
  const supported =
    typeof Intl !== "undefined" && "supportedValuesOf" in Intl
      ? Intl.supportedValuesOf("timeZone")
      : [];
  if (supported.length > 0) {
    return supported;
  }
  return [
    "UTC",
    "America/New_York",
    "America/Los_Angeles",
    "Europe/London",
    "Europe/Paris",
    "Asia/Kolkata",
    "Asia/Tokyo",
    "Australia/Sydney",
  ];
};

export const applyUserSettings = (settings: UserSettings) => {
  if (typeof document === "undefined") {
    return;
  }

  applyTheme(themeFromApi(settings.defaultTheme));
  window.localStorage.setItem(
    NAV_PIN_STORAGE_KEY,
    String(Boolean(settings.menuPinned))
  );
  window.localStorage.setItem(
    PRESERVE_PIN_STORAGE_KEY,
    String(Boolean(settings.preservePinnedState))
  );
  document.documentElement.setAttribute(
    "data-compact",
    settings.compactMode ? "true" : "false"
  );
  window.localStorage.setItem(
    COMPACT_STORAGE_KEY,
    String(Boolean(settings.compactMode))
  );
  const language = settings.language || "en";
  document.documentElement.lang = language;
  window.localStorage.setItem(LANGUAGE_STORAGE_KEY, language);

  if (settings.timezone) {
    window.localStorage.setItem(TIMEZONE_STORAGE_KEY, settings.timezone);
  } else {
    window.localStorage.removeItem(TIMEZONE_STORAGE_KEY);
  }

  window.localStorage.setItem(
    NOTIFICATIONS_STORAGE_KEY,
    JSON.stringify({
      inApp: Boolean(settings.notificationEnabled),
      email: Boolean(settings.emailNotificationEnabled),
      release: Boolean(settings.releaseAlertEnabled),
    })
  );
};

export const DEFAULT_USER_SETTINGS: UserSettings = {
  menuPinned: false,
  preservePinnedState: false,
  notificationEnabled: true,
  defaultTheme: "LIGHT",
  emailNotificationEnabled: true,
  releaseAlertEnabled: true,
  compactMode: false,
  language: "en",
  timezone: null,
};

export const withDefaultSettings = (
  settings?: Partial<UserSettings> | null
): UserSettings => ({
  ...DEFAULT_USER_SETTINGS,
  ...settings,
  timezone: settings?.timezone ?? null,
});

export const settingsFromPartial = (
  current: UserSettings,
  updates: UserSettingsUpdate
): UserSettings => ({
  ...current,
  ...updates,
});
