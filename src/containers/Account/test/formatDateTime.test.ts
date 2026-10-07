import {
  formatDateTime,
  formatOrdinalDate,
  formatTimeZoneName,
  getOrdinalDay,
} from "src/utils/common/helpers";

describe("getOrdinalDay", () => {
  it("returns the expected English ordinals", () => {
    expect(getOrdinalDay(1)).toBe("1st");
    expect(getOrdinalDay(2)).toBe("2nd");
    expect(getOrdinalDay(3)).toBe("3rd");
    expect(getOrdinalDay(4)).toBe("4th");
    expect(getOrdinalDay(8)).toBe("8th");
    expect(getOrdinalDay(11)).toBe("11th");
    expect(getOrdinalDay(12)).toBe("12th");
    expect(getOrdinalDay(13)).toBe("13th");
    expect(getOrdinalDay(21)).toBe("21st");
    expect(getOrdinalDay(22)).toBe("22nd");
    expect(getOrdinalDay(23)).toBe("23rd");
  });
});

describe("formatTimeZoneName", () => {
  it("uses IST for India Standard Time instead of GMT+5:30", () => {
    const date = new Date(2026, 8, 8, 18, 30, 0);
    const spy = jest.spyOn(date, "getTimezoneOffset").mockReturnValue(-330);
    expect(formatTimeZoneName(date)).toBe("IST");
    spy.mockRestore();
  });
});

describe("formatDateTime", () => {
  it("formats local dates as Month Dth YYYY h:mm AM/PM TZ", () => {
    const localDate = new Date(2026, 8, 8, 18, 30, 0);
    const formatted = formatDateTime(localDate.toISOString());
    const time = new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    }).format(localDate);
    const timeZone = formatTimeZoneName(localDate);

    expect(formatted).toBe(
      `Sept 8th 2026 ${time}${timeZone ? ` ${timeZone}` : ""}`
    );
  });

  it("returns an empty string for missing or invalid values", () => {
    expect(formatDateTime("")).toBe("");
    expect(formatDateTime("not-a-date")).toBe("");
  });
});

describe("formatOrdinalDate", () => {
  it("formats local dates as Dth Mon YYYY", () => {
    const localDate = new Date(2026, 8, 30);
    expect(formatOrdinalDate(localDate.toISOString())).toBe("30th Sept 2026");
  });

  it("returns an empty string for missing or invalid values", () => {
    expect(formatOrdinalDate("")).toBe("");
    expect(formatOrdinalDate("not-a-date")).toBe("");
  });
});
