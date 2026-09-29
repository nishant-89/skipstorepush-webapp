import { skipstore } from "src/utils/common/constants";
import { ReactNode } from "react";
import ThemeToggle from "src/components/common/ThemeToggle";

interface AuthLayoutProps {
  title: string;
  description: ReactNode;
  children: ReactNode;
}

const AuthLayout = ({ title, description, children }: AuthLayoutProps) => {
  return (
    <div className="loginWrap">
      <div className="authThemeSlot">
        <ThemeToggle />
      </div>
      <div className="loginWrapInner">
        <div className="textWrap">
          <div className="topSection">
            <figure className="loginLogoSec">
              <img src={skipstore} alt="skipstore" />
            </figure>
            <h1 className="mainHeading">{title}</h1>
            <p className="headingInfo">{description}</p>
            {children}
          </div>
          <div className="bottomSection">
            <p className="copyRightText">
              &copy; Copyright 2026 skipstorepush.tech
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
