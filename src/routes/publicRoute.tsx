import { Navigate } from "react-router-dom";
import { ReactNode, ReactElement } from "react";
import { useSelector } from "react-redux";
import { RootReducerType } from "src/redux/rootReducers";
import { homePathForRole, isAdminRole } from "src/utils/userRole";

const PublicRoute = ({ children }: { children: ReactNode }): ReactElement => {
  const auth = useSelector((state: RootReducerType) => state.auth);
  const profile = useSelector((state: RootReducerType) => state.profile.data);
  const access_token = auth.accessToken;
  const role = profile?.role || auth.user?.role;

  if (access_token) {
    const redirectPath = localStorage.getItem("postLoginRedirectPath");
    if (!isAdminRole(role) && redirectPath?.includes("invitations")) {
      localStorage.removeItem("postLoginRedirectPath");
      return <Navigate to={redirectPath} replace />;
    }

    return <Navigate to={homePathForRole(role)} replace />;
  }

  return children as ReactElement;
};

export default PublicRoute;
