export type ThemeName = "dark" | "light";

export const THEME_STORAGE_KEY = "skipstore_theme";

export const getPreferredTheme = (): ThemeName => {
  if (typeof window === "undefined") {
    return "dark";
  }
  const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
  if (stored === "light" || stored === "dark") {
    return stored;
  }
  return "dark";
};

export const applyTheme = (theme: ThemeName) => {
  if (typeof document === "undefined") {
    return;
  }
  document.documentElement.setAttribute("data-theme", theme);
  window.localStorage.setItem(THEME_STORAGE_KEY, theme);
};

export const toggleTheme = (theme: ThemeName): ThemeName => {
  const next = theme === "dark" ? "light" : "dark";
  applyTheme(next);
  return next;
};
