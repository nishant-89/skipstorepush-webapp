import {
  applyUserSettings,
  COMPACT_STORAGE_KEY,
  LANGUAGE_STORAGE_KEY,
  NAV_PIN_STORAGE_KEY,
  NOTIFICATIONS_STORAGE_KEY,
  PRESERVE_PIN_STORAGE_KEY,
  themeFromApi,
  themeToApi,
  TIMEZONE_STORAGE_KEY,
  withDefaultSettings,
} from "src/utils/userSettings";
import { THEME_STORAGE_KEY } from "src/utils/theme";

describe("user settings helpers", () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute("data-theme");
    document.documentElement.removeAttribute("data-compact");
    document.documentElement.lang = "en";
  });

  it("maps API themes", () => {
    expect(themeFromApi("LIGHT")).toBe("light");
    expect(themeFromApi("DARK")).toBe("dark");
    expect(themeToApi("light")).toBe("LIGHT");
    expect(themeToApi("dark")).toBe("DARK");
  });

  it("fills defaults for missing settings", () => {
    expect(withDefaultSettings(undefined).defaultTheme).toBe("LIGHT");
    expect(withDefaultSettings({ language: "hi" }).language).toBe("hi");
  });

  it("applies account settings to the document", () => {
    applyUserSettings({
      menuPinned: true,
      preservePinnedState: false,
      notificationEnabled: false,
      defaultTheme: "DARK",
      emailNotificationEnabled: true,
      releaseAlertEnabled: false,
      compactMode: true,
      language: "hi",
      timezone: "Asia/Kolkata",
    });

    expect(document.documentElement.getAttribute("data-theme")).toBe("dark");
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe("dark");
    expect(localStorage.getItem(NAV_PIN_STORAGE_KEY)).toBe("true");
    expect(localStorage.getItem(PRESERVE_PIN_STORAGE_KEY)).toBe("false");
    expect(document.documentElement.getAttribute("data-compact")).toBe("true");
    expect(localStorage.getItem(COMPACT_STORAGE_KEY)).toBe("true");
    expect(document.documentElement.lang).toBe("hi");
    expect(localStorage.getItem(LANGUAGE_STORAGE_KEY)).toBe("hi");
    expect(localStorage.getItem(TIMEZONE_STORAGE_KEY)).toBe("Asia/Kolkata");
    expect(JSON.parse(localStorage.getItem(NOTIFICATIONS_STORAGE_KEY) || "{}")).toEqual({
      inApp: false,
      email: true,
      release: false,
    });
  });
});
