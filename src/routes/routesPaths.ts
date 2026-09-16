const ROUTES = {
  USERS: "/",
  LOGIN: "/login",

  NOT_FOUND: "*",
  PAGENOTFOUND: "/PageNotFound",
  NOINTERNET: "/NoInternet",
  IP_ROUTE: "https://api.ipify.org?format=json",

  ALL_APPS: "/all-apps",
  ALL_APPS_DETAILS: "/all-apps/details/:id",
  RELEASE_DETAILS: "/all-apps/details/:id/release/:releaseId",
  INVITATION: "/invitations/:id",
};

export default ROUTES;
