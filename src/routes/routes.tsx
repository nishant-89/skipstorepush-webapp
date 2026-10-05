import React, { lazy } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import LazyLoader from "src/utils/routesContainer/routesContainer";
import PrivateRoute from "./privateRoute";
import PublicRoute from "./publicRoute";
import ROUTES from "./routesPaths";
import PageContainer from "src/components/layout/pageWrapper/pageWrapper";
import { useSelector } from "react-redux";
import { RootReducerType } from "src/redux/rootReducers";

import NetworkWrapper from "src/components/common/NetworkWrapper/NetworkWrapper";
import Loader from "src/components/common/Loader/loader";
import { Invite } from "src/containers/AllApps/components/Invitation/Invitation";

const NotFound = LazyLoader(
  lazy(() => import("src/components/common/NotFound/NotFound"))
);
const PageNotFound = LazyLoader(
  lazy(() => import("src/components/common/PageNotFound/PageNotFound"))
);
const NoInternetFound = LazyLoader(
  lazy(() => import("src/components/common/NoInternetFound/NoInternetFound"))
);

const Login = LazyLoader(lazy(() => import("src/containers/Login/Login")));
const Register = LazyLoader(lazy(() => import("src/containers/Register/Register")));
const ForgotPassword = LazyLoader(
  lazy(() => import("src/containers/ForgotPassword/ForgotPassword"))
);
const AllApps = LazyLoader(lazy(() => import("src/containers/AllApps/AllApps")));
const AllAppsDetails = LazyLoader(
  lazy(() => import("src/containers/AllApps/components/AllAppsDetails/AllAppsDetails"))
);
const ReleaseDetails = LazyLoader(
  lazy(() => import("src/containers/AllApps/components/ReleaseDetails/ReleaseDetails"))
);
const Activities = LazyLoader(lazy(() => import("src/containers/Activities/Activities")));
const Account = LazyLoader(lazy(() => import("src/containers/Account/Account")));
const PublicProfile = LazyLoader(
  lazy(() => import("src/containers/Account/PublicProfile"))
);
const Help = LazyLoader(lazy(() => import("src/containers/Help/Help")));
const Dashboard = LazyLoader(lazy(() => import("src/containers/Dashboard/Dashboard")));
const Settings = LazyLoader(lazy(() => import("src/containers/Settings/Settings")));

const routesConfig = [
  { path: ROUTES.DASHBOARD, isPrivate: true, component: Dashboard },
  { path: ROUTES.ALL_APPS, isPrivate: true, component: AllApps },
  { path: ROUTES.MY_ACTIVITIES, isPrivate: true, component: Activities },
  { path: ROUTES.ALL_APPS_DETAILS, isPrivate: true, component: AllAppsDetails },
  { path: ROUTES.RELEASE_DETAILS, isPrivate: true, component: ReleaseDetails },
  { path: ROUTES.MY_ACCOUNT, isPrivate: true, component: Account },
  { path: ROUTES.USER_PROFILE, isPrivate: true, component: PublicProfile },
  { path: ROUTES.HELP, isPrivate: true, component: Help },
  { path: ROUTES.SETTINGS, isPrivate: true, component: Settings },
  { path: ROUTES.INVITATION, isPrivate: true, component: Invite },
  {
    path: ROUTES.LOGIN,
    isPrivate: false,
    component: Login,
  },
  {
    path: ROUTES.REGISTER,
    isPrivate: false,
    component: Register,
  },
  {
    path: ROUTES.FORGOT_PASSWORD,
    isPrivate: false,
    component: ForgotPassword,
  },

  { path: ROUTES.NOT_FOUND, isPrivate: true, component: NotFound },
  { path: ROUTES.PAGENOTFOUND, isPrivate: true, component: PageNotFound },
  { path: ROUTES.NOINTERNET, isPrivate: true, component: NoInternetFound },
];

interface RouteConfig {
  path: string;
  isPrivate: boolean;
  component: React.ComponentType;
}

const EmptyWrapper = ({ children }: { children: React.ReactNode }) => (
  <>{children}</>
);

const LoaderWrapper = ({ children }: { children: React.ReactNode }) => {
  const isLoading = useSelector(
    (state: RootReducerType) => state.globalState.loading
  );

  return (
    <>
      {isLoading && <Loader />}
      {children}
    </>
  );
};

const RoutesManager = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={"/"} element={<Navigate to={ROUTES.LOGIN} />} />
        {routesConfig.map((item: RouteConfig) => {
          const AccessWrapper = item.isPrivate ? PrivateRoute : PublicRoute;
          const LayoutWrapper = item.isPrivate ? PageContainer : EmptyWrapper;
          const Component = item.component;
          return (
            <Route
              key={item.path}
              path={item.path}
              element={
                <NetworkWrapper>
                  <AccessWrapper>
                    <LayoutWrapper>
                      <LoaderWrapper>
                        <Component />
                      </LoaderWrapper>
                    </LayoutWrapper>
                  </AccessWrapper>
                </NetworkWrapper>
              }
            />
          );
        })}
      </Routes>
    </BrowserRouter>
  );
};

export default RoutesManager;
