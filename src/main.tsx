import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { applyTheme, getPreferredTheme } from "./utils/theme";
import "./index.scss";

applyTheme(getPreferredTheme());

ReactDOM.createRoot(document.getElementById("root")!).render(<App />);
