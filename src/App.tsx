import { Provider } from "react-redux";
import store from "src/redux/store";
import RoutesManager from "./routes";
import { Slide, ToastContainer } from "react-toastify";

function App() {
  return (
    <Provider store={store}>
      <RoutesManager />
      <ToastContainer
        closeButton={false}
        autoClose={3000}
        newestOnTop
        pauseOnHover
        position="top-center"
        transition={Slide}
      />
    </Provider>
  );
}

export default App;
