import React from "react";
import { Menu, MenuItem } from "@mui/material";
import {
  skipstore,
  CodePushLogoImage,
  UserPlaceholderIcon,
} from "src/utils/common/constants";
import "../Header/header.scss";
import AccessKeyModal from "src/components/common/Modal/accessKeyModal";
import { Link } from "react-router-dom";
import ROUTES from "src/routes/routesPaths";

interface HeaderProps {
  handleLogoutOpen: () => void;
}
const Header: React.FC<HeaderProps> = ({ handleLogoutOpen }: HeaderProps) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [accessModal, setAccessModal] = React.useState<boolean>(false);
  const open = Boolean(anchorEl);

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

  const handleAccesskey = () => {
    handleClose();
    setAccessModal(true);
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
              <img src={UserPlaceholderIcon} alt="Icon" />
            </figure>
          </button>

          <Menu
            className="menuWrapper"
            id="basic-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
          >
            <MenuItem onClick={handleAccesskey}>Access Key</MenuItem>
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </Menu>
        </div>
      </div>
      <AccessKeyModal
        open={accessModal}
        title={"Access Key"}
        onClose={() => setAccessModal(false)}
      />
    </header>
  );
};

export default Header;
