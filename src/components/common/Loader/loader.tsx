import { Backdrop, Box } from "@mui/material";
import { useSelector } from "react-redux";
import { RootState } from "src/redux/rootReducers";

import "./loader.scss";

const Loader = () => {
  const { loading } = useSelector((state: RootState) => state.globalState);
  return (
    <Backdrop
      className="loaderContainer"
      open={loading}
      data-testid="backdrop-loader"
    >
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
      >
        <div className="circular-loader">
          <div className="loader"></div>
          <div className="loader"></div>
          <div className="loader"></div>
          <div className="loader"></div>
          <div className="loader"></div>
          <div className="loader"></div>
          <div className="loader"></div>
          <div className="loader"></div>
          <div className="loader"></div>
          <div className="loader"></div>
          <div className="loader"></div>
          <div className="loader"></div>
        </div>
      </Box>
    </Backdrop>
  );
};

export default Loader;
