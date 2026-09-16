import { skipstore, GithubIcon } from "src/utils/common/constants";
import ButtonComp from "src/components/common/Button";
import { useLoginHelper } from "./helper";

import "./login.scss";

const LoginComponent = () => {
  const { handleClick } = useLoginHelper();
  return (
    <div className="loginWrap">
      <div className="loginWrapInner">
        <div className="textWrap">
          <div className="topSection">
            <figure className="loginLogoSec">
              <img src={skipstore} alt="skipstore" />
            </figure>
            {/* heading section */}
            <h1 className="mainHeading">Create Account or Sign In</h1>
            <p className="headingInfo">
              Log in with one of these services to get started.
            </p>
            {/* github section */}
            <div className="buttonSection">
              <ButtonComp
                className="githubButton"
                variant="contained"
                label="Continue with GitHub"
                onClick={handleClick}
                isIcon
                icon={GithubIcon}
              />
            </div>
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

export default LoginComponent;
