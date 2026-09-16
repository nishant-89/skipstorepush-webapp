import { render, screen, fireEvent } from "@testing-library/react";
import ResumeModal from "../resumeModal";

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

// Mock ResumeModalIcon import
jest.mock("src/utils/common/constants", () => ({
  ResumeModalIcon: "resume-modal-icon.svg",
}));

describe("ResumeModal", () => {
  const defaultProps = {
    open: true,
    title: "Resume Update",
    description: "Are you sure you want to resume?",
    onSubmit: jest.fn(),
    onClose: jest.fn(),
    mainClass: "custom-class",
    isPrimaryButtonDisable: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders modal with title, description, and buttons", () => {
    render(<ResumeModal {...defaultProps} />);
    expect(screen.getByText("Resume Update")).toBeInTheDocument();
    expect(
      screen.getByText("Are you sure you want to resume?")
    ).toBeInTheDocument();
    expect(screen.getByText("Cancel")).toBeInTheDocument();
    expect(screen.getByText("Resume")).toBeInTheDocument();
    expect(screen.getByTestId("mui-modal")).toBeInTheDocument();
    expect(screen.getByAltText("Icon")).toHaveAttribute(
      "src",
      "resume-modal-icon.svg"
    );
  });

  it("calls onSubmit when Resume button is clicked", () => {
    render(<ResumeModal {...defaultProps} />);
    fireEvent.click(screen.getByText("Resume"));
    expect(defaultProps.onSubmit).toHaveBeenCalled();
  });

  it("calls onClose when Cancel button is clicked", () => {
    render(<ResumeModal {...defaultProps} />);
    fireEvent.click(screen.getByText("Cancel"));
    expect(defaultProps.onClose).toHaveBeenCalled();
  });

  it("disables Resume button if isPrimaryButtonDisable is true", () => {
    render(<ResumeModal {...defaultProps} isPrimaryButtonDisable={true} />);
    expect(screen.getByText("Resume")).toBeDisabled();
  });

  it("does not render modal when open is false", () => {
    render(<ResumeModal {...defaultProps} open={false} />);
    expect(screen.queryByTestId("mui-modal")).not.toBeInTheDocument();
  });

  it("applies default props when mainClass and isPrimaryButtonDisable are omitted", () => {
    render(
      <ResumeModal
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
    expect(screen.getByText("Resume")).not.toBeDisabled();
  });
});
