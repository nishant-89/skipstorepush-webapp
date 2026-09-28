import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import Header from "../Header";
import SideNav from "../SideNav";
import LogoutModal from "src/components/common/Modal/logoutModal";
import { fetchProfileDataRequest } from "src/containers/redux/slices/profile";

import "./index.scss";

interface Props {
  children: React.ReactNode;
}

export default function PageContainer({ children }: Readonly<Props>) {
  const [isLogoutOpen, setIsLogoutOpen] = useState<boolean>(false);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchProfileDataRequest());
  }, [dispatch]);

  const handleLogoutOpen = () => {
    setIsLogoutOpen(true);
  };
  const handleLogoutClose = () => {
    setIsLogoutOpen(false);
  };
  return (
    <>
      <div className="RootPageMainWrapper">
        <Header handleLogoutOpen={handleLogoutOpen} />
        <div className="RootInnerMainWrapper">
          <SideNav />
          <div className="innerLayoutMainWrapper">{children}</div>
        </div>
      </div>
      <LogoutModal isOpen={isLogoutOpen} handleClose={handleLogoutClose} />
    </>
  );
}
