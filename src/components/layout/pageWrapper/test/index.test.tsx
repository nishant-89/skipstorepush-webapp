import { render, screen } from "@testing-library/react";
import PageContainer from "../index";
import { MemoryRouter } from "react-router-dom";
import { Provider } from "react-redux";
import store from "src/redux/store";

describe("PageContainer", () => {
  it("renders children correctly", () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <PageContainer>
            <div data-testid="child">Test Child</div>
          </PageContainer>
        </MemoryRouter>
      </Provider>
    );
    expect(screen.getByTestId("child")).toHaveTextContent("Test Child");
  });
});
