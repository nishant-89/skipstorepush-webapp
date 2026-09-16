import "../PageNotFound/noDataFound.scss";
import Button from "src/components/common/Button";

const NoInternetFound = () => {
  const handleRefresh = () => {
    window.location.reload();
  };
  const noInternetImage = localStorage.getItem("noInternetImage");
  return (
    <div className="notFoundwrap">
      <div className="centerWrap">
        <div className="contentWrap">
          <img src={noInternetImage ?? ""} alt="No Internet" />
          <h2>No Internet Connection</h2>
          <p>
            It seems that you have lost your internet network. Please refresh to
            continue
          </p>
          <Button variant="contained" label="Refresh" onClick={handleRefresh} />
        </div>
      </div>
    </div>
  );
};
export default NoInternetFound;
