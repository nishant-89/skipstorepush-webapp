import moment from "moment-timezone";

export const specialCharRegex = /[!@#$%^&*(),.?":{}|<>]/;

export const alphabetRegex = /^[a-zA-Z\s]*$/;
export const alphanumericWithSpacesRegex =
  /^[a-zA-Z0-9_\W-][a-zA-Z0-9_\s\W-]*$/;

export const alphabetWithSymbolRegex = /^[a-zA-Z\s\-'._]*$/;

export const DateFormatter = ({
  date,
  time,
  timezone,
}: {
  date: string;
  time?: string | null;
  timezone: string;
}) => {
  if (!date) return;

  const localTimeZone = moment.tz.guess();

  const dateTime = time ? `${date.split("T")[0]}T${time}` : date;

  const sourceDateTime = moment.tz(dateTime, timezone);

  const localDateTime = sourceDateTime.clone().tz(localTimeZone);

  const formattedDate = localDateTime ? localDateTime.format("DD/MM/YYYY") : "";
  const formattedTime = time ? localDateTime.format("HH:mm") : "";

  return (
    <p>{`${formattedDate}${formattedTime ? ` - ${formattedTime}` : ""}`}</p>
  );
};

export const capitalizeFirstLetter = (str: string) => {
  if (!str) return str;

  return str
    .replace(/_/g, " ")
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

export const truncateText = (text: string, maxLength: number) => {
  if (!text) return "";
  return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
};

export const formatDateToYMD = (date: Date | string | null): string | null => {
  if (!date) return null;
  if (typeof date === "string") return date;
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};
