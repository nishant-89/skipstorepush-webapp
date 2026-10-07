// Moment import
import moment from "moment";
import { getStoredTimeZone } from "src/utils/userSettings";

export const getFirstCharOrDefault = (value?: string | undefined): string => {
  return value ? value?.charAt(0)?.toUpperCase() : "";
};

export const formatDateWithTimezone = (isoDateString: string): string => {
  const date = new Date(isoDateString);

  const day = date.getDate();
  const month = date.toLocaleString("default", { month: "long" });
  const year = date.getFullYear();

  return `${day} ${month}, ${year}`;
};

export const formatPhoneNumber = (phone: string | undefined) => {
  if (phone) {
    const cleaned = phone.replace(/\D/g, "");
    const match = cleaned.match(/^(\d{0,3})(\d{0,3})(\d{0,4})$/);

    if (match) {
      const [, first, second, third] = match;

      if (!first) return "";
      if (!second) return first;
      if (!third) return `${first}-${second}`;
      return `${first}-${second}-${third}`;
    }

    return cleaned;
  }
  return "";
};

// handle date format MM/DD/YYYY
export const DateFormatter = ({ date }: { date: string }) => {
  return <p>{moment(date).format("MM/DD/YYYY")}</p>;
};

export const capitalizeFirstLetter = (str: string): string => {
  if (!str) return "";
  return str?.charAt(0)?.toUpperCase() + str?.slice(1)?.toLowerCase();
};

const MONTHS_SHORT = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sept",
  "Oct",
  "Nov",
  "Dec",
];

export const getOrdinalDay = (day: number): string => {
  const remainder = day % 100;
  if (remainder >= 11 && remainder <= 13) {
    return `${day}th`;
  }
  switch (day % 10) {
    case 1:
      return `${day}st`;
    case 2:
      return `${day}nd`;
    case 3:
      return `${day}rd`;
    default:
      return `${day}th`;
  }
};

export const formatTimeZoneName = (date: Date, timeZone?: string): string => {
  if (!timeZone && -date.getTimezoneOffset() === 330) {
    return "IST";
  }

  const timeZoneName =
    new Intl.DateTimeFormat("en-US", {
      timeZoneName: "short",
      ...(timeZone ? { timeZone } : {}),
    })
      .formatToParts(date)
      .find((part) => part.type === "timeZoneName")?.value || "";

  if (/^(GMT|UTC)\+0?5:30$/.test(timeZoneName)) {
    return "IST";
  }

  return timeZoneName;
};

export const formatDateTime = (dateStr: string): string => {
  try {
    if (!dateStr) {
      return "";
    }

    const date = new Date(dateStr);
    if (Number.isNaN(date.getTime())) {
      return "";
    }

    const storedTimeZone = getStoredTimeZone() || undefined;
    const month = MONTHS_SHORT[date.getMonth()];
    const day = getOrdinalDay(date.getDate());
    const year = date.getFullYear();
    const time = new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
      ...(storedTimeZone ? { timeZone: storedTimeZone } : {}),
    }).format(date);
    const timeZone = formatTimeZoneName(date, storedTimeZone);

    return `${month} ${day} ${year} ${time}${timeZone ? ` ${timeZone}` : ""}`;
  } catch (error) {
    console.log(error);
    return "";
  }
};

export const formatOrdinalDate = (dateStr: string): string => {
  try {
    if (!dateStr) {
      return "";
    }

    const date = new Date(dateStr);
    if (Number.isNaN(date.getTime())) {
      return "";
    }

    const storedTimeZone = getStoredTimeZone() || undefined;
    const parts = new Intl.DateTimeFormat("en-US", {
      day: "numeric",
      month: "numeric",
      year: "numeric",
      ...(storedTimeZone ? { timeZone: storedTimeZone } : {}),
    }).formatToParts(date);
    const day = Number(parts.find((part) => part.type === "day")?.value);
    const month = Number(parts.find((part) => part.type === "month")?.value);
    const year = parts.find((part) => part.type === "year")?.value;

    if (!day || !month || !year) {
      return "";
    }

    return `${getOrdinalDay(day)} ${MONTHS_SHORT[month - 1]} ${year}`;
  } catch (error) {
    console.log(error);
    return "";
  }
};
