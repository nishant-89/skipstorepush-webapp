import { Theme } from "@mui/material";

const styles = {
  loaderContainer: {
    zIndex: (theme: Theme) => theme.zIndex.drawer + 1,
    background: "var(--color-overlay)",
  },
  loaderImage: {
    width: "300px",
    margin: "0 auto",
  },
};

export default styles;
