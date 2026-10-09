const ROUTES = {
  USERS: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  FORGOT_PASSWORD: "/forgot-password",

  NOT_FOUND: "*",
  PAGENOTFOUND: "/PageNotFound",
  NOINTERNET: "/NoInternet",
  IP_ROUTE: "https://api.ipify.org?format=json",

  DASHBOARD: "/dashboard",
  ALL_APPS: "/all-apps",
  MY_ACTIVITIES: "/my-activities",
  ALL_APPS_DETAILS: "/all-apps/details/:id",
  RELEASE_DETAILS: "/all-apps/details/:id/release/:releaseId",
  INVITATION: "/invitations/:id",
    MY_ACCOUNT: "/my-account",
    USER_PROFILE: "/users/:id",
    HELP: "/help",
  SETTINGS: "/settings",
  ADMIN_OVERVIEW: "/admin/overview",
  ADMIN_CUSTOMERS: "/admin/customers",
  ADMIN_CUSTOMER: "/admin/customers/:id",
  ADMIN_APPS: "/admin/apps",
  ADMIN_APP: "/admin/apps/:id",
  ADMIN_ACTIVITIES: "/admin/activities",
};

export default ROUTES;
