import { render, screen, fireEvent } from "@testing-library/react";
import RolloutUpdateModal from "../rolloutUpdateModal";

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

// Mock RooloutUpdateIcon import
jest.mock("src/utils/common/constants", () => ({
  RooloutUpdateIcon: "rollout-update-icon.svg",
}));

describe("RolloutUpdateModal", () => {
  const defaultProps = {
    open: true,
    title: "Rollout Update",
    description: "Are you sure you want to rollout this update?",
    onSubmit: jest.fn(),
    onClose: jest.fn(),
    mainClass: "custom-class",
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders modal with title, description, and buttons", () => {
    render(<RolloutUpdateModal {...defaultProps} />);
    expect(screen.getByText("Rollout Update")).toBeInTheDocument();
    expect(
      screen.getByText("Are you sure you want to rollout this update?")
    ).toBeInTheDocument();
    expect(screen.getByText("Cancel")).toBeInTheDocument();
    expect(screen.getByText("Confirm")).toBeInTheDocument();
    expect(screen.getByTestId("mui-modal")).toBeInTheDocument();
    expect(screen.getByAltText("Icon")).toHaveAttribute(
      "src",
      "rollout-update-icon.svg"
    );
  });

  it("calls onSubmit when Confirm button is clicked", () => {
    render(<RolloutUpdateModal {...defaultProps} />);
    fireEvent.click(screen.getByText("Confirm"));
    expect(defaultProps.onSubmit).toHaveBeenCalled();
  });

  it("calls onClose when Cancel button is clicked", () => {
    render(<RolloutUpdateModal {...defaultProps} />);
    fireEvent.click(screen.getByText("Cancel"));
    expect(defaultProps.onClose).toHaveBeenCalled();
  });

  it("does not render modal when open is false", () => {
    render(<RolloutUpdateModal {...defaultProps} open={false} />);
    expect(screen.queryByTestId("mui-modal")).not.toBeInTheDocument();
  });

  it("renders modal with minimal props (without optional props)", () => {
    const minimalProps = {
      open: true,
      title: "Test Title",
    };
    render(<RolloutUpdateModal {...minimalProps} />);
    expect(screen.getByText("Test Title")).toBeInTheDocument();
    expect(screen.getByTestId("mui-modal")).toBeInTheDocument();
  });

  it("renders modal without description", () => {
    const propsWithoutDescription = {
      open: true,
      title: "Test Title",
      onSubmit: jest.fn(),
      onClose: jest.fn(),
    };
    render(<RolloutUpdateModal {...propsWithoutDescription} />);
    expect(screen.getByText("Test Title")).toBeInTheDocument();
    expect(screen.getByText("Cancel")).toBeInTheDocument();
    expect(screen.getByText("Confirm")).toBeInTheDocument();
  });

  it("renders modal without mainClass", () => {
    const propsWithoutMainClass = {
      open: true,
      title: "Test Title",
      description: "Test description",
      onSubmit: jest.fn(),
      onClose: jest.fn(),
    };
    render(<RolloutUpdateModal {...propsWithoutMainClass} />);
    expect(screen.getByText("Test Title")).toBeInTheDocument();
    expect(screen.getByText("Test description")).toBeInTheDocument();
  });
});
