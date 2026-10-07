import {
  ALL_APPS_SAVED_FILTERS_KEY,
  readSavedAppFilters,
  writeSavedAppFilters,
} from "./savedFilters";

describe("savedFilters", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("returns empty filters when nothing is stored", () => {
    expect(readSavedAppFilters()).toEqual({ os: [], search: "" });
  });

  it("persists and reads app filters", () => {
    writeSavedAppFilters({ os: ["IOS"], search: "store" });
    expect(readSavedAppFilters()).toEqual({ os: ["IOS"], search: "store" });
    expect(window.localStorage.getItem(ALL_APPS_SAVED_FILTERS_KEY)).toContain(
      "IOS"
    );
  });

  it("ignores invalid stored os values", () => {
    window.localStorage.setItem(
      ALL_APPS_SAVED_FILTERS_KEY,
      JSON.stringify({ os: ["WINDOWS", "IOS"], search: 12 })
    );
    expect(readSavedAppFilters()).toEqual({ os: ["IOS"], search: "" });
  });
});
