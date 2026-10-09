import { Navigate, useLocation } from "react-router-dom";
import { ReactNode } from "react";
import { RootReducerType } from "src/redux/rootReducers";
import { useSelector } from "react-redux";
import ROUTES from "./routesPaths";
import NoData from "src/components/common/NoData/NoData";
import {
  homePathForRole,
  isAdminPath,
  isAdminRole,
  isCustomerOnlyPath,
} from "src/utils/userRole";

const PrivateRoute = ({ children }: { children: ReactNode }) => {
  const location = useLocation();
  const auth = useSelector((state: RootReducerType) => state.auth);
  const profile = useSelector((state: RootReducerType) => state.profile.data);
  const access_token = auth.accessToken;
  const role = profile?.role || auth.user?.role;

  if (!access_token) {
    localStorage.setItem("postLoginRedirectPath", location.pathname);
  }

  if (!children) {
    return <NoData />;
  }

  if (!access_token) {
    return <Navigate to={ROUTES.LOGIN} />;
  }

  if (isAdminRole(role) && isCustomerOnlyPath(location.pathname)) {
    return <Navigate to={ROUTES.ADMIN_OVERVIEW} replace />;
  }

  if (!isAdminRole(role) && isAdminPath(location.pathname)) {
    return <Navigate to={homePathForRole(role)} replace />;
  }

  return <>{children}</>;
};

export default PrivateRoute;
