export const ALL_APPS_SAVED_FILTERS_KEY = "skipstore_all_apps_filters";
export const ACTIVITIES_SAVED_SEARCH_KEY = "skipstore_activities_search";

export type SavedAppFilters = {
  os: string[];
  search: string;
};

const allowedOs = new Set(["IOS", "ANDROID"]);

export const readSavedAppFilters = (): SavedAppFilters => {
  if (typeof window === "undefined") {
    return { os: [], search: "" };
  }
  try {
    const raw = window.localStorage.getItem(ALL_APPS_SAVED_FILTERS_KEY);
    if (!raw) {
      return { os: [], search: "" };
    }
    const parsed = JSON.parse(raw) as Partial<SavedAppFilters>;
    const os = Array.isArray(parsed.os)
      ? parsed.os.filter((value) => allowedOs.has(value))
      : [];
    return {
      os,
      search: typeof parsed.search === "string" ? parsed.search : "",
    };
  } catch {
    return { os: [], search: "" };
  }
};

export const writeSavedAppFilters = (filters: SavedAppFilters) => {
  if (typeof window === "undefined") {
    return;
  }
  window.localStorage.setItem(
    ALL_APPS_SAVED_FILTERS_KEY,
    JSON.stringify({
      os: filters.os,
      search: filters.search,
    })
  );
};

export const readSavedActivitiesSearch = () => {
  if (typeof window === "undefined") {
    return "";
  }
  return window.localStorage.getItem(ACTIVITIES_SAVED_SEARCH_KEY) || "";
};

export const writeSavedActivitiesSearch = (search: string) => {
  if (typeof window === "undefined") {
    return;
  }
  window.localStorage.setItem(ACTIVITIES_SAVED_SEARCH_KEY, search);
};
