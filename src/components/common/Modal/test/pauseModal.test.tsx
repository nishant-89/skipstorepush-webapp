import { render, screen, fireEvent } from "@testing-library/react";
import PauseModal from "../pauseModal";

// Mock MUI Modal and Button to avoid portal issues in test
jest.mock("@mui/material", () => {
  const actual = jest.requireActual("@mui/material");
  return {
    ...actual,
    Modal: ({ open, children }: any) =>
      open ? <div data-testid="mui-modal">{children}</div> : null,
    Button: ({ children, ...props }: any) => (
      <button {...props}>{children}</button>
    ),
  };
});

jest.mock("src/utils/common/constants", () => ({
  PauseModalIcon: "pause-icon.svg",
}));

describe("PauseModal", () => {
  const defaultProps = {
    open: true,
    title: "Pause Release",
    description: "Are you sure you want to pause?",
    onSubmit: jest.fn(),
    onClose: jest.fn(),
    mainClass: "",
    isPrimaryButtonDisable: false,
  };

  it("renders modal with title, description, and buttons", () => {
    render(<PauseModal {...defaultProps} />);
    expect(screen.getByText("Pause Release")).toBeInTheDocument();
    expect(
      screen.getByText("Are you sure you want to pause?")
    ).toBeInTheDocument();
    expect(screen.getByText("Cancel")).toBeInTheDocument();
    expect(screen.getByText("Pause")).toBeInTheDocument();
    expect(screen.getByTestId("mui-modal")).toBeInTheDocument();
    expect(screen.getByAltText("Icon")).toHaveAttribute(
      "src",
      "pause-icon.svg"
    );
  });

  it("calls onSubmit when Pause button is clicked", () => {
    render(<PauseModal {...defaultProps} />);
    fireEvent.click(screen.getByText("Pause"));
    expect(defaultProps.onSubmit).toHaveBeenCalled();
  });

  it("calls onClose when Cancel button is clicked", () => {
    render(<PauseModal {...defaultProps} />);
    fireEvent.click(screen.getByText("Cancel"));
    expect(defaultProps.onClose).toHaveBeenCalled();
  });

  it("disables Pause button if isPrimaryButtonDisable is true", () => {
    render(<PauseModal {...defaultProps} isPrimaryButtonDisable={true} />);
    expect(screen.getByText("Pause")).toBeDisabled();
  });
  it("applies default props when mainClass and isPrimaryButtonDisable are omitted", () => {
    render(
      <PauseModal
        open={true}
        title="Default Props Test"
        description="Testing defaults."
        onSubmit={jest.fn()}
        onClose={jest.fn()}
      />
    );
    // mainClass default: "" (should not add extra class)
    expect(screen.getByText("Default Props Test")).toBeInTheDocument();
    // isPrimaryButtonDisable default: false (button should be enabled)
    expect(screen.getByText("Pause")).not.toBeDisabled();
  });
});
