import { render } from "@testing-library/react";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import Loader from "../loader";

const mockStore = configureStore([]);

describe("Loader Component", () => {
  it("should render Backdrop when loading is true", () => {
    const store = mockStore({ globalState: { loading: true } });
    const { getByTestId } = render(
      <Provider store={store}>
        <Loader />
      </Provider>
    );
    expect(getByTestId("backdrop-loader")).toBeInTheDocument();
  });

  it("should not render Backdrop when loading is false", () => {
    const store = mockStore({ globalState: { loading: false } });
    const { getByTestId } = render(
      <Provider store={store}>
        <Loader />
      </Provider>
    );
    expect(getByTestId("backdrop-loader")).not.toBeVisible();
  });
});
