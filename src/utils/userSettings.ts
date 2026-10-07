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

export type TimeZoneOption = {
  value: string;
  label: string;
  aliases?: string[];
};

export const TIMEZONE_OPTIONS: TimeZoneOption[] = [
  { value: "UTC", label: "Coordinated Universal Time (UTC)" },
  { value: "Pacific/Honolulu", label: "Hawaii Standard Time (HST)" },
  { value: "America/Anchorage", label: "Alaska Standard Time (AKST)" },
  {
    value: "America/Los_Angeles",
    label: "Pacific Standard Time (PST)",
    aliases: ["PST", "America/Vancouver"],
  },
  {
    value: "America/Denver",
    label: "Mountain Standard Time (MST)",
    aliases: ["MST", "America/Edmonton"],
  },
  {
    value: "America/Chicago",
    label: "Central Standard Time (CST)",
    aliases: ["CST", "America/Mexico_City", "America/Winnipeg"],
  },
  {
    value: "America/New_York",
    label: "Eastern Standard Time (EST)",
    aliases: ["EST", "America/Toronto", "America/Detroit"],
  },
  { value: "America/Halifax", label: "Atlantic Standard Time (AST)" },
  { value: "America/Sao_Paulo", label: "Brasilia Time (BRT)" },
  { value: "America/Argentina/Buenos_Aires", label: "Argentina Time (ART)" },
  { value: "Atlantic/Azores", label: "Azores Time (AZOT)" },
  {
    value: "Europe/London",
    label: "Greenwich Mean Time (GMT)",
    aliases: ["GMT", "Etc/GMT", "Europe/Dublin"],
  },
  {
    value: "Europe/Berlin",
    label: "Central European Time (CET)",
    aliases: ["CET", "Europe/Paris", "Europe/Rome", "Europe/Madrid"],
  },
  {
    value: "Europe/Bucharest",
    label: "Eastern European Time (EET)",
    aliases: ["EET", "Europe/Athens", "Europe/Helsinki"],
  },
  { value: "Europe/Moscow", label: "Moscow Standard Time (MSK)" },
  { value: "Africa/Lagos", label: "West Africa Time (WAT)" },
  { value: "Africa/Johannesburg", label: "South Africa Standard Time (SAST)" },
  { value: "Africa/Nairobi", label: "East Africa Time (EAT)" },
  { value: "Asia/Dubai", label: "Gulf Standard Time (GST)" },
  { value: "Asia/Karachi", label: "Pakistan Standard Time (PKT)" },
  {
    value: "Asia/Kolkata",
    label: "Indian Standard Time (IST)",
    aliases: ["IST", "Asia/Calcutta", "Asia/Colombo"],
  },
  { value: "Asia/Dhaka", label: "Bangladesh Standard Time (BST)" },
  { value: "Asia/Bangkok", label: "Indochina Time (ICT)" },
  { value: "Asia/Jakarta", label: "Western Indonesia Time (WIB)" },
  {
    value: "Asia/Shanghai",
    label: "China Standard Time (CST)",
    aliases: ["Asia/Beijing", "PRC"],
  },
  { value: "Asia/Hong_Kong", label: "Hong Kong Time (HKT)" },
  { value: "Asia/Singapore", label: "Singapore Time (SGT)" },
  { value: "Asia/Tokyo", label: "Japan Standard Time (JST)" },
  { value: "Asia/Seoul", label: "Korea Standard Time (KST)" },
  { value: "Australia/Perth", label: "Australian Western Standard Time (AWST)" },
  {
    value: "Australia/Adelaide",
    label: "Australian Central Standard Time (ACST)",
  },
  {
    value: "Australia/Sydney",
    label: "Australian Eastern Standard Time (AEST)",
    aliases: ["Australia/Melbourne"],
  },
  { value: "Pacific/Auckland", label: "New Zealand Standard Time (NZST)" },
];

export const canonicalizeTimeZone = (timezone?: string | null): string => {
  if (!timezone) {
    return "";
  }
  const match = TIMEZONE_OPTIONS.find(
    (option) =>
      option.value === timezone || option.aliases?.includes(timezone)
  );
  return match?.value ?? timezone;
};

export const timezoneSelectOptions = (current?: string | null) => {
  const options = TIMEZONE_OPTIONS.map(({ value, label }) => ({ value, label }));
  const canonical = canonicalizeTimeZone(current);
  if (canonical && !options.some((option) => option.value === canonical)) {
    return [
      { value: canonical, label: canonical.replace(/_/g, " ") },
      ...options,
    ];
  }
  return options;
};

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

export const listTimeZones = (): string[] =>
  TIMEZONE_OPTIONS.map((option) => option.value);

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
