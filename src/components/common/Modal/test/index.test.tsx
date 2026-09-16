import { render, screen, fireEvent } from "@testing-library/react";
import CustomModal from "../index";

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

describe("CustomModal", () => {
  const defaultProps = {
    open: true,
    title: "Test Modal",
    actionTitle: "Submit",
    onSubmit: jest.fn(),
    onSecondaryClick: jest.fn(),
    onClose: jest.fn(),
    icon: "test-icon.svg",
    description: "Test description",
  };

  it("renders modal with title, description, and buttons", () => {
    render(<CustomModal {...defaultProps} />);
    expect(screen.getByText("Test Modal")).toBeInTheDocument();
    expect(screen.getByText("Test description")).toBeInTheDocument();
    expect(screen.getByText("Submit")).toBeInTheDocument();
    expect(screen.getByText("Exit")).toBeInTheDocument();
    expect(screen.getByTestId("mui-modal")).toBeInTheDocument();
  });

  it("calls onSubmit when primary button is clicked", () => {
    render(<CustomModal {...defaultProps} />);
    fireEvent.click(screen.getByText("Submit"));
    expect(defaultProps.onSubmit).toHaveBeenCalled();
  });

  it("calls onSecondaryClick when secondary button is clicked", () => {
    render(<CustomModal {...defaultProps} />);
    fireEvent.click(screen.getByText("Exit"));
    expect(defaultProps.onSecondaryClick).toHaveBeenCalled();
  });

  it("does not render secondary button if isSecondaryButton is false", () => {
    render(<CustomModal {...defaultProps} isSecondaryButton={false} />);
    expect(screen.queryByText("Exit")).not.toBeInTheDocument();
  });

  it("renders descriptionElement if provided", () => {
    render(
      <CustomModal
        {...defaultProps}
        descriptionElement={<div data-testid="desc-element">Custom Desc</div>}
      />
    );
    expect(screen.getByTestId("desc-element")).toBeInTheDocument();
    expect(screen.queryByText("Test description")).not.toBeInTheDocument();
  });

  it("disables primary button if isPrimaryButtonDisable is true", () => {
    render(<CustomModal {...defaultProps} isPrimaryButtonDisable={true} />);
    expect(screen.getByText("Submit")).toBeDisabled();
  });
});
