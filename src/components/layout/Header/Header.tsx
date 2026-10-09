import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  skipstore,
  CodePushLogoImage,
} from "src/utils/common/constants/constants";
import ThemeToggle from "src/components/common/ThemeToggle/ThemeToggle";
import Notifications from "./Notifications/Notifications";
import "../Header/header.scss";
import { RootState } from "src/redux/rootReducers";
import { homePathForRole, isAdminRole } from "src/utils/userRole";

const Header = () => {
  const authUser = useSelector((state: RootState) => state.auth.user);
  const profile = useSelector((state: RootState) => state.profile.data);
  const role = profile?.role || authUser?.role;
  const homePath = homePathForRole(role);

  return (
    <header className="header">
      <div className="leftWrapper">
        <figure className="logo">
          <Link to={homePath}>
            <img src={skipstore} alt="Logo" />
          </Link>
        </figure>
        <div className="productMark">
          <span className="productName">Skipstore</span>
          <span className="productMeta">
            {isAdminRole(role) ? "Admin console" : "OTA console"}
          </span>
        </div>
        {isAdminRole(role) ? <span className="roleBadge">Admin</span> : null}
        <div className="logoBox">
          <figure className="logoTxt">
            <img src={CodePushLogoImage} alt="Icon" />
          </figure>
        </div>
      </div>
      <div className="rightWrap">
        <div className="actionBtnWrap">
          {isAdminRole(role) ? null : <Notifications />}
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
};

export default Header;
