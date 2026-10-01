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
  HELP: "/help",
  SETTINGS: "/settings",
};

export default ROUTES;
