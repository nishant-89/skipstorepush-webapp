// Moment import
import moment from "moment";

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

export const formatDateTime = (dateStr: string): string => {
  try {
    if (dateStr) {
      const date = new Date(dateStr);

      return new Intl.DateTimeFormat("en-US", {
        month: "2-digit",
        day: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }).format(date);
    }
    return "";
  } catch (error) {
    console.log(error);
    return "";
  }
};
