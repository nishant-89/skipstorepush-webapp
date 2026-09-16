import { PageNotfound } from "src/utils/common/constants";
import Button from "src/components/common/Button";

import "./noDataFound.scss";

const PageNotFound = () => {
  return (
    <div className="notFoundwrap">
      <div className="centerWrap">
        <div className="contentWrap">
          <img src={PageNotfound} alt="Not found" />
          <h2>Page Not Found</h2>
          <p>The page you are looking for doesn't exist or has been moved.</p>
          <Button variant="outlined" label="Go Back" className="btnOutline" />
          <Button variant="contained" label="Go to Home" />
        </div>
      </div>
    </div>
  );
};

export default PageNotFound;
