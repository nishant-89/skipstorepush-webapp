import { Provider } from "react-redux";
import store from "src/redux/store";
import RoutesManager from "./routes";
import { Bounce, ToastContainer } from "react-toastify";
import "src/components/common/ToastAlert/toast.scss";

function App() {
  return (
    <Provider store={store}>
      <RoutesManager />
      <ToastContainer
        closeButton={false}
        closeOnClick={false}
        draggable={false}
        autoClose={4000}
        newestOnTop
        pauseOnHover
        hideProgressBar={false}
        position="bottom-right"
        transition={Bounce}
        className="skipToastContainer"
      />
    </Provider>
  );
}

export default App;
