import { useNavigate } from "react-router-dom";
import Button from "src/components/common/Button";
import ROUTES from "src/routes/routesPaths";
import { PageNotfound } from "src/utils/common/constants";

import "./notAuthorized.scss";

const NotAuthorized = () => {
  const navigate = useNavigate();

  return (
    <div className="mainContentWrapper">
      <div className="notFoundwrap ">
        <div className="centerWrap">
          <div className="contentWrap">
            <img src={PageNotfound ?? ""} alt="Not Found" />
            <h2>Not Authorized</h2>
            <p>You are not authorized to access this page</p>
            <Button
              label="Go Back"
              className="userActionBtn"
              variant="outlined"
              onClick={() => navigate(-1)}
            />
            <Button
              label="Go to Home"
              className="userActionBtn"
              variant="contained"
              onClick={() => navigate(ROUTES.ALL_APPS)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
export default NotAuthorized;
