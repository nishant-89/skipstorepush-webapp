import { render, screen } from "@testing-library/react";
import ToastAlert from "../index";

describe("ToastAlert", () => {
  it("renders only the available message", () => {
    render(<ToastAlert kind="success" message="Settings saved" />);
    expect(screen.getByText("Settings saved")).toBeInTheDocument();
    expect(screen.queryByText("Success")).not.toBeInTheDocument();
  });

  it("renders an error with a sub message", () => {
    render(
      <ToastAlert
        kind="error"
        message="Unable to save"
        subMessage="Try again"
      />
    );
    expect(screen.getByText("Unable to save")).toBeInTheDocument();
    expect(screen.getByText("Try again")).toBeInTheDocument();
    expect(screen.queryByText("Something went wrong")).not.toBeInTheDocument();
  });
});
