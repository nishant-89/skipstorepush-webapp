import { Navigate, useLocation } from "react-router-dom";
import { ReactNode } from "react";
import { RootReducerType } from "src/redux/rootReducers";
import { useSelector } from "react-redux";
import ROUTES from "./routesPaths";
import NoData from "src/components/common/NoData";

const PrivateRoute = ({ children }: { children: ReactNode }) => {
  const location = useLocation();
  const { accessToken: access_token } = useSelector((state: RootReducerType) => state.auth);

  if (!access_token) {
    localStorage.setItem("postLoginRedirectPath", location.pathname);
  }

  if (!children) {
    return <NoData />;
  }

  return access_token ? <>{children}</> : <Navigate to={ROUTES.LOGIN} />;
};

export default PrivateRoute;
