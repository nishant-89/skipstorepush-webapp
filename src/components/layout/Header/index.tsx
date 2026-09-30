import { Link } from "react-router-dom";
import {
  skipstore,
  CodePushLogoImage,
} from "src/utils/common/constants";
import ThemeToggle from "src/components/common/ThemeToggle";
import "../Header/header.scss";
import ROUTES from "src/routes/routesPaths";

const Header = () => {
  return (
    <header className="header">
      <div className="leftWrapper">
        <figure className="logo">
          <Link to={ROUTES.DASHBOARD}>
            <img src={skipstore} alt="Logo" />
          </Link>
        </figure>
        <div className="productMark">
          <span className="productName">Skipstore</span>
          <span className="productMeta">OTA console</span>
        </div>
        <div className="logoBox">
          <figure className="logoTxt">
            <img src={CodePushLogoImage} alt="Icon" />
          </figure>
        </div>
      </div>
      <div className="rightWrap">
        <div className="actionBtnWrap">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
};

export default Header;
