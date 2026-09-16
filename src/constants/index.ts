// Define the type of allowed keys for the status object
export type StatusKeys = 1 | 2 | 3 | 4 | 5;

export const Status: Record<StatusKeys, string> = {
  1: "Invitation Sent",
  2: "Active",
  3: "Inactive",
  4: "Delete",
  5: "Locked",
};

export const saveToLocalStorage = <T>(key: string, data: T): void => {
  localStorage.setItem(key, JSON.stringify(data));
};

export const loadFromLocalStorage = <T>(key: string): T | null => {
  const data = localStorage.getItem(key);

  if (data === "undefined") {
    return null;
  }

  return data ? (JSON.parse(data) as T) : null;
};

export const OWNER_DETAILS_STORAGE_KEY = "ownerDetails";
export const OWNER_PLANS_STORAGE_KEY = "ownerPlans";
