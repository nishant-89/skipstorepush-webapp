import React from "react";
import { Menu, MenuItem } from "@mui/material";
import { useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import {
  skipstore,
  CodePushLogoImage,
  UserPlaceholderIcon,
} from "src/utils/common/constants";
import "../Header/header.scss";
import ROUTES from "src/routes/routesPaths";
import { RootState } from "src/redux/rootReducers";

interface HeaderProps {
  handleLogoutOpen: () => void;
}
const Header: React.FC<HeaderProps> = ({ handleLogoutOpen }: HeaderProps) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();
  const profile = useSelector((state: RootState) => state.profile.data);
  const avatarSrc = profile?.profileImage || UserPlaceholderIcon;

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleClose();
    handleLogoutOpen();
  };

  const handleMyAccount = () => {
    handleClose();
    navigate(ROUTES.MY_ACCOUNT);
  };

  const handleHelp = () => {
    handleClose();
    navigate(ROUTES.HELP);
  };

  return (
    <header className="header">
      <div className="leftWrapper">
        <figure className="logo">
          <Link to={ROUTES.ALL_APPS}>
            <img src={skipstore} alt="Logo" />
          </Link>
        </figure>
        <div className="logoBox">
          <figure className="logoTxt">
            <img src={CodePushLogoImage} alt="Icon" />
          </figure>
        </div>
      </div>
      <div className="rightWrap">
        <div className="actionBtnWrap">
          <button className="actionBtn ">
            <figure
              className="userImage"
              id="basic-button"
              aria-controls={open ? "basic-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={open ? "true" : undefined}
              onClick={handleClick}
            >
              <img className="avtarImg" src={avatarSrc} alt="Icon" />
            </figure>
          </button>

          <Menu
            className="menuWrapper"
            id="basic-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
          >
            <MenuItem onClick={handleMyAccount}>My Account</MenuItem>
            <MenuItem onClick={handleHelp}>Help</MenuItem>
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </Menu>
        </div>
      </div>
    </header>
  );
};

export default Header;
