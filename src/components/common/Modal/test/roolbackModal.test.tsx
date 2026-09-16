import { render, screen, fireEvent } from "@testing-library/react";
import RoolbackModal from "../roolbackModal";

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

// Mock RoolbackModalIcon import
jest.mock("src/utils/common/constants", () => ({
  RoolbackModalIcon: "roolback-modal-icon.svg",
}));

describe("RoolbackModal", () => {
  const defaultProps = {
    open: true,
    title: "Rollback Update",
    description: "Are you sure you want to rollback this update?",
    onSubmit: jest.fn(),
    onClose: jest.fn(),
    mainClass: "custom-class",
    isPrimaryButtonDisable: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders modal with title, description, and buttons", () => {
    render(<RoolbackModal {...defaultProps} />);
    expect(screen.getByText("Rollback Update")).toBeInTheDocument();
    expect(
      screen.getByText("Are you sure you want to rollback this update?")
    ).toBeInTheDocument();
    expect(screen.getByText("Cancel")).toBeInTheDocument();
    expect(screen.getByText("Rollback")).toBeInTheDocument();
    expect(screen.getByTestId("mui-modal")).toBeInTheDocument();
    expect(screen.getByAltText("Icon")).toHaveAttribute(
      "src",
      "roolback-modal-icon.svg"
    );
  });

  it("calls onSubmit when Rollback button is clicked", () => {
    render(<RoolbackModal {...defaultProps} />);
    fireEvent.click(screen.getByText("Rollback"));
    expect(defaultProps.onSubmit).toHaveBeenCalled();
  });

  it("calls onClose when Cancel button is clicked", () => {
    render(<RoolbackModal {...defaultProps} />);
    fireEvent.click(screen.getByText("Cancel"));
    expect(defaultProps.onClose).toHaveBeenCalled();
  });

  it("does not render modal when open is false", () => {
    render(<RoolbackModal {...defaultProps} open={false} />);
    expect(screen.queryByTestId("mui-modal")).not.toBeInTheDocument();
  });

  it("disables Rollback button when isPrimaryButtonDisable is true", () => {
    render(<RoolbackModal {...defaultProps} isPrimaryButtonDisable={true} />);
    expect(screen.getByText("Rollback")).toBeDisabled();
  });

  it("enables Rollback button when isPrimaryButtonDisable is not provided (default false)", () => {
    const { getByText } = render(
      <RoolbackModal
        {...defaultProps}
        isPrimaryButtonDisable={undefined as any} // simulate not passing the prop
      />
    );
    expect(getByText("Rollback")).not.toBeDisabled();
  });

  it("applies only the default modalWrap class when mainClass is not provided", () => {
    const { container } = render(
      <RoolbackModal
        {...defaultProps}
        mainClass={undefined as any} // simulate not passing mainClass
      />
    );
    const modalWrap = container.querySelector(".modalWrap ");
    expect(modalWrap).toBeInTheDocument();
    expect(modalWrap?.className).toBe("modalWrap ");
  });
});
