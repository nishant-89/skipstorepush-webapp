import { render, screen, fireEvent } from "@testing-library/react";
import PromoteModal from "../promoteModal";

describe("PromoteModal", () => {
  const defaultProps = {
    open: true,
    title: "Promote Release",
    description: "Are you sure you want to promote this release?",
    onClose: jest.fn(),
    onSubmit: jest.fn(),
    mainClass: "",
    isPrimaryButtonDisable: false,
  };

  it("renders title and description", () => {
    render(<PromoteModal {...defaultProps} />);
    expect(screen.getByText("Promote Release")).toBeInTheDocument();
    expect(
      screen.getByText("Are you sure you want to promote this release?")
    ).toBeInTheDocument();
  });

  it("calls onClose when Cancel is clicked", () => {
    render(<PromoteModal {...defaultProps} />);
    fireEvent.click(screen.getByText("Cancel"));
    expect(defaultProps.onClose).toHaveBeenCalled();
  });

  it("calls onSubmit when Promote is clicked", () => {
    render(<PromoteModal {...defaultProps} />);
    fireEvent.click(screen.getByText("Promote"));
    expect(defaultProps.onSubmit).toHaveBeenCalled();
  });

  it("disables Promote button when isPrimaryButtonDisable is true", () => {
    render(<PromoteModal {...defaultProps} isPrimaryButtonDisable={true} />);
    expect(screen.getByText("Promote")).toBeDisabled();
  });

  it("does not render when open is false", () => {
    render(<PromoteModal {...defaultProps} open={false} />);
    // Modal content should not be in the document
    expect(screen.queryByText("Promote Release")).not.toBeInTheDocument();
  });

  it("applies default props when mainClass and isPrimaryButtonDisable are omitted", () => {
    render(
      <PromoteModal
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
    expect(screen.getByText("Promote")).not.toBeDisabled();
  });
});
