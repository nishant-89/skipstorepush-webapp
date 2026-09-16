import { notFound } from "src/utils/common/constants";
import Button from "../../common/Button";
import { useNavigate } from "react-router-dom";
import ROUTES from "src/routes/routesPaths";

import "./notFound.scss";

const NotFound = () => {
  const navigate = useNavigate();
  return (
    <div className="notFoundwrap">
      <div className="centerWrap">
        <div className="contentWrap">
          <img src={notFound} alt="Not Found" />
          <h2>Page Not Found</h2>
          <p className="subTitle">
            The page you are looking for doesn't exist or has been moved.
          </p>
          <div className="btnWrap">
            <Button
              label="Go Back"
              className="userActionBtn"
              variant="outlined"
              onClick={() => navigate(-1)}
            />
            <Button
              label="Go to All Apps"
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

export default NotFound;
