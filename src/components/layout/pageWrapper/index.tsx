import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Header from "../Header";
import SideNav from "../SideNav";
import { fetchProfileDataRequest } from "src/containers/redux/slices/profile";
import { RootState } from "src/redux/rootReducers";
import { applyUserSettings } from "src/utils/userSettings";

import "./index.scss";

interface Props {
  children: React.ReactNode;
}

export default function PageContainer({ children }: Readonly<Props>) {
  const dispatch = useDispatch();
  const settings = useSelector(
    (state: RootState) => state.profile.data?.settings
  );

  useEffect(() => {
    dispatch(fetchProfileDataRequest());
  }, [dispatch]);

  useEffect(() => {
    if (settings) {
      applyUserSettings(settings);
    }
  }, [settings]);

  return (
    <div className="RootPageMainWrapper">
      <Header />
      <div className="RootInnerMainWrapper">
        <SideNav />
        <div className="innerLayoutMainWrapper">{children}</div>
      </div>
    </div>
  );
}
