import React, { lazy } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import LazyLoader from "src/utils/routesContainer";
import PrivateRoute from "./privateRoute";
import PublicRoute from "./publicRoute";
import ROUTES from "./routesPaths";
import PageContainer from "src/components/layout/pageWrapper";
import { useSelector } from "react-redux";
import { RootReducerType } from "src/redux/rootReducers";

import NetworkWrapper from "src/components/common/NetworkWrapper";
import Loader from "src/components/common/Loader/loader";
import { Invite } from "src/containers/AllApps/components/Invitation";

const NotFound = LazyLoader(
  lazy(() => import("src/components/common/NotFound"))
);
const PageNotFound = LazyLoader(
  lazy(() => import("src/components/common/PageNotFound"))
);
const NoInternetFound = LazyLoader(
  lazy(() => import("src/components/common/NoInternetFound"))
);

// code-push-routing-start
const Login = LazyLoader(lazy(() => import("src/containers/Login")));
const AllApps = LazyLoader(lazy(() => import("src/containers/AllApps")));
const AllAppsDetails = LazyLoader(
  lazy(() => import("src/containers/AllApps/components/AllAppsDetails"))
);
const ReleaseDetails = LazyLoader(
  lazy(() => import("src/containers/AllApps/components/ReleaseDetails"))
);

const routesConfig = [
  // code-push-routing
  { path: ROUTES.ALL_APPS, isPrivate: true, component: AllApps },
  { path: ROUTES.ALL_APPS_DETAILS, isPrivate: true, component: AllAppsDetails },
  { path: ROUTES.RELEASE_DETAILS, isPrivate: true, component: ReleaseDetails },
  { path: ROUTES.INVITATION, isPrivate: true, component: Invite },
  {
    path: ROUTES.LOGIN,
    isPrivate: false,
    component: Login,
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
