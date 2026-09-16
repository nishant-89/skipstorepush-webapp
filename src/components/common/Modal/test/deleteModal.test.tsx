import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import SettingDeleteModal from "../deleteModal";

describe("SettingDeleteModal", () => {
  const defaultProps = {
    open: true,
    title: "Test Title",
    description: "Test Description",
    onClose: jest.fn(),
    onSubmit: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders modal with title and description when open", () => {
    render(<SettingDeleteModal {...defaultProps} />);

    expect(screen.getByText("Test Title")).toBeInTheDocument();
    expect(screen.getByText("Test Description")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /cancel/i })).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /confirm/i })
    ).toBeInTheDocument();
  });

  it("does not render modal when open is false", () => {
    render(<SettingDeleteModal {...defaultProps} open={false} />);

    expect(screen.queryByText("Test Title")).not.toBeInTheDocument();
    expect(screen.queryByText("Test Description")).not.toBeInTheDocument();
  });

  it("renders delete button text when isCollabModal is true", () => {
    render(<SettingDeleteModal {...defaultProps} isCollabModal={true} />);

    expect(screen.getByRole("button", { name: /delete/i })).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /confirm/i })
    ).not.toBeInTheDocument();
  });

  it("renders confirm button text when isCollabModal is false", () => {
    render(<SettingDeleteModal {...defaultProps} isCollabModal={false} />);

    expect(
      screen.getByRole("button", { name: /confirm/i })
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /delete/i })
    ).not.toBeInTheDocument();
  });

  it("applies m6 class to title when isCollabModal is true", () => {
    render(<SettingDeleteModal {...defaultProps} isCollabModal={true} />);

    const title = screen.getByText("Test Title");
    expect(title).toHaveClass("m6");
  });

  it("does not apply m6 class to title when isCollabModal is false", () => {
    render(<SettingDeleteModal {...defaultProps} isCollabModal={false} />);

    const title = screen.getByText("Test Title");
    expect(title).not.toHaveClass("m6");
  });

  it("disables primary button when isPrimaryButtonDisable is true", () => {
    render(
      <SettingDeleteModal {...defaultProps} isPrimaryButtonDisable={true} />
    );

    const confirmButton = screen.getByRole("button", { name: /confirm/i });
    expect(confirmButton).toBeDisabled();
  });

  it("enables primary button when isPrimaryButtonDisable is false", () => {
    render(
      <SettingDeleteModal {...defaultProps} isPrimaryButtonDisable={false} />
    );

    const confirmButton = screen.getByRole("button", { name: /confirm/i });
    expect(confirmButton).not.toBeDisabled();
  });

  it("applies custom main class", () => {
    render(<SettingDeleteModal {...defaultProps} mainClass="custom-class" />);

    // Verify modal renders and custom class is applied
    expect(screen.getByText("Test Title")).toBeInTheDocument();
    const titleElement = screen.getByText("Test Title");
    const modalWrap = titleElement.closest(".modalWrap");
    expect(modalWrap).toHaveClass("custom-class");
  });

  it("calls onClose when Cancel button is clicked", () => {
    const onCloseMock = jest.fn();
    render(<SettingDeleteModal {...defaultProps} onClose={onCloseMock} />);

    const cancelButton = screen.getByRole("button", { name: /cancel/i });
    fireEvent.click(cancelButton);

    expect(onCloseMock).toHaveBeenCalledTimes(1);
  });

  it("calls onSubmit when Confirm button is clicked", () => {
    const onSubmitMock = jest.fn();
    render(<SettingDeleteModal {...defaultProps} onSubmit={onSubmitMock} />);

    const confirmButton = screen.getByRole("button", { name: /confirm/i });
    fireEvent.click(confirmButton);

    expect(onSubmitMock).toHaveBeenCalledTimes(1);
  });

  it("calls onSubmit when Delete button is clicked (collab modal)", () => {
    const onSubmitMock = jest.fn();
    render(
      <SettingDeleteModal
        {...defaultProps}
        onSubmit={onSubmitMock}
        isCollabModal={true}
      />
    );

    const deleteButton = screen.getByRole("button", { name: /delete/i });
    fireEvent.click(deleteButton);

    expect(onSubmitMock).toHaveBeenCalledTimes(1);
  });

  it("does not call onSubmit when primary button is disabled and clicked", () => {
    const onSubmitMock = jest.fn();
    render(
      <SettingDeleteModal
        {...defaultProps}
        onSubmit={onSubmitMock}
        isPrimaryButtonDisable={true}
      />
    );

    const confirmButton = screen.getByRole("button", { name: /confirm/i });
    fireEvent.click(confirmButton);

    expect(onSubmitMock).not.toHaveBeenCalled();
  });

  it("renders modal with alt text for icon", () => {
    render(<SettingDeleteModal {...defaultProps} />);

    const icon = screen.getByAltText("Icon");
    expect(icon).toBeInTheDocument();
  });

  it("renders without description when description is not provided", () => {
    const { description, ...propsWithoutDescription } = defaultProps;
    render(<SettingDeleteModal {...propsWithoutDescription} />);

    expect(screen.getByText("Test Title")).toBeInTheDocument();
    expect(screen.queryByText("Test Description")).not.toBeInTheDocument();
  });

  it("does not call onClose when onClose is not provided", () => {
    const { onClose, ...propsWithoutOnClose } = defaultProps;
    render(<SettingDeleteModal {...propsWithoutOnClose} />);

    const cancelButton = screen.getByRole("button", { name: /cancel/i });
    expect(() => fireEvent.click(cancelButton)).not.toThrow();
  });

  it("does not call onSubmit when onSubmit is not provided", () => {
    const { onSubmit, ...propsWithoutOnSubmit } = defaultProps;
    render(<SettingDeleteModal {...propsWithoutOnSubmit} />);

    const confirmButton = screen.getByRole("button", { name: /confirm/i });
    expect(() => fireEvent.click(confirmButton)).not.toThrow();
  });

  it("has correct accessibility attributes", () => {
    render(<SettingDeleteModal {...defaultProps} />);

    const modal = screen.getByRole("presentation");
    expect(modal).toHaveAttribute("aria-labelledby", "modal-modal-title");
    expect(modal).toHaveAttribute(
      "aria-describedby",
      "modal-modal-description"
    );

    const title = screen.getByText("Test Title");
    expect(title).toHaveAttribute("id", "modal-modal-title");
  });
});
