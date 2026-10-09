import { chartTickLabel } from "../chartTicks";

const days = (count: number, start = "2026-09-10") => {
  const startMs = Date.parse(`${start}T00:00:00Z`);
  return Array.from({ length: count }, (_, index) => {
    const date = new Date(startMs + index * 86400000);
    return date.toISOString().slice(0, 10);
  });
};

const labels = (dates: string[]) =>
  dates
    .map((date, index) => chartTickLabel(date, index, dates.length))
    .filter(Boolean);

describe("chartTickLabel", () => {
  it("labels every day in a short range", () => {
    expect(labels(days(7, "2026-10-03"))).toEqual([
      "10/3",
      "10/4",
      "10/5",
      "10/6",
      "10/7",
      "10/8",
      "10/9",
    ]);
  });

  it("keeps month-boundary labels from sitting on neighboring days", () => {
    const shown = labels(days(30, "2026-09-10"));
    expect(shown).toContain("9/10");
    expect(shown).toContain("10/9");
    expect(shown.includes("9/30") && shown.includes("10/1")).toBe(false);
    for (let index = 1; index < shown.length; index += 1) {
      const previous = shown[index - 1].split("/").map(Number);
      const current = shown[index].split("/").map(Number);
      const previousDay = previous[0] * 31 + previous[1];
      const currentDay = current[0] * 31 + current[1];
      expect(currentDay - previousDay).toBeGreaterThanOrEqual(4);
    }
  });

  it("still labels the ends of a 92 day range", () => {
    const shown = labels(days(92, "2026-07-10"));
    expect(shown[0]).toBe("7/10");
    expect(shown[shown.length - 1]).toBe("10/9");
    expect(shown.length).toBeLessThanOrEqual(10);
  });
});
