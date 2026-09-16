import { Theme } from "@mui/material";

const styles = {
  loaderContainer: {
    zIndex: (theme: Theme) => theme.zIndex.drawer + 1,
    background: `rgba(0,0,0.0.5)`,
  },
  loaderImage: {
    width: "300px",
    margin: "0 auto",
  },
};

export default styles;
