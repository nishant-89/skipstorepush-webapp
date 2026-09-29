import { useEffect } from "react";
import { useDispatch } from "react-redux";
import Header from "../Header";
import SideNav from "../SideNav";
import { fetchProfileDataRequest } from "src/containers/redux/slices/profile";

import "./index.scss";

interface Props {
  children: React.ReactNode;
}

export default function PageContainer({ children }: Readonly<Props>) {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchProfileDataRequest());
  }, [dispatch]);

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
