export const USER_ROLE = {
  CUSTOMER: "CUSTOMER",
  ADMIN: "ADMIN",
} as const;

export type PlatformRole = (typeof USER_ROLE)[keyof typeof USER_ROLE];

export const isAdminRole = (role?: string | null) => role === USER_ROLE.ADMIN;

export const homePathForRole = (role?: string | null) =>
  isAdminRole(role) ? "/admin/overview" : "/dashboard";

export const isAdminPath = (pathname: string) =>
  pathname === "/admin" || pathname.startsWith("/admin/");

const CUSTOMER_ONLY_PREFIXES = [
  "/dashboard",
  "/all-apps",
  "/my-activities",
  "/invitations",
];

export const isCustomerOnlyPath = (pathname: string) =>
  CUSTOMER_ONLY_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );
