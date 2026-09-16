import { Navigate } from "react-router-dom";
import { ReactNode, ReactElement } from "react";
import { useSelector } from "react-redux";
import { RootReducerType } from "src/redux/rootReducers";
import ROUTES from "./routesPaths";

const PublicRoute = ({ children }: { children: ReactNode }): ReactElement => {
  const { accessToken: access_token } = useSelector((state: RootReducerType) => state.auth);

  if (access_token) {
    const redirectPath = localStorage.getItem("postLoginRedirectPath");
    if (redirectPath?.includes("invitations")) {
      localStorage.removeItem("postLoginRedirectPath");
      return <Navigate to={redirectPath} replace />;
    }

    return <Navigate to={ROUTES.ALL_APPS} replace />;
  }

  return children as ReactElement;
};

export default PublicRoute;
