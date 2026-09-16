import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import AccessKeyModal from "../accessKeyModal";

const mockStore = configureStore([]);

describe("AccessKeyModal", () => {
  let store: ReturnType<typeof mockStore>;
  let onCloseMock: jest.Mock;
  const user = { accessKey: "test-access-key" };

  beforeEach(() => {
    store = mockStore({ auth: { user } });
    onCloseMock = jest.fn();
    jest.clearAllMocks();
  });

  it("renders modal with title and access key", () => {
    render(
      <Provider store={store}>
        <AccessKeyModal open={true} title="Test Title" onClose={onCloseMock} />
      </Provider>
    );
    expect(screen.getByText("Test Title")).toBeInTheDocument();
    expect(screen.getByText("test-access-key")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /copy key/i })
    ).toBeInTheDocument();
  });

  it("calls onClose and copies key to clipboard when button is clicked", async () => {
    const writeTextMock = jest.fn();
    Object.assign(navigator, {
      clipboard: { writeText: writeTextMock },
    });
    render(
      <Provider store={store}>
        <AccessKeyModal open={true} title="Test Title" onClose={onCloseMock} />
      </Provider>
    );
    fireEvent.click(screen.getByRole("button", { name: /copy key/i }));
    expect(writeTextMock).toHaveBeenCalledWith("test-access-key");
    expect(onCloseMock).toHaveBeenCalled();
  });

  it("does not render modal when open is false", () => {
    render(
      <Provider store={store}>
        <AccessKeyModal open={false} title="Test Title" onClose={onCloseMock} />
      </Provider>
    );
    expect(screen.queryByText("Test Title")).not.toBeInTheDocument();
  });
});
