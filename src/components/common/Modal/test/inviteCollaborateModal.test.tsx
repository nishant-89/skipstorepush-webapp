import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import InviteCollaborateModal from "../inviteCollaborateModal";
import "@testing-library/jest-dom";

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

describe("InviteCollaborateModal", () => {
  const defaultProps = {
    open: true,
    title: "Invite Collaborator",
    description: "Invite a new collaborator to your app.",
    handleSubmit: jest.fn(),
    onClose: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders modal with title, description, and input", () => {
    render(<InviteCollaborateModal {...defaultProps} />);
    expect(screen.getByText("Invite Collaborator")).toBeInTheDocument();
    expect(
      screen.getByText("Invite a new collaborator to your app.")
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Email Address")).toBeInTheDocument();
    expect(screen.getByText("Cancel")).toBeInTheDocument();
    expect(screen.getByText("Invite")).toBeInTheDocument();
    expect(screen.getByTestId("mui-modal")).toBeInTheDocument();
  });

  it("calls onClose when Cancel button is clicked", () => {
    render(<InviteCollaborateModal {...defaultProps} />);
    fireEvent.click(screen.getByText("Cancel"));
    expect(defaultProps.onClose).toHaveBeenCalled();
  });

  it("shows validation error for empty email and disables Invite button", async () => {
    render(<InviteCollaborateModal {...defaultProps} />);
    const input = screen.getByLabelText("Email Address");
    const inviteBtn = screen.getByText("Invite");
    // Simulate user focusing and blurring the input to mark it as touched
    fireEvent.focus(input);
    fireEvent.blur(input);
    // Now try clicking the Invite button
    fireEvent.click(inviteBtn);
    await waitFor(() => {
      expect(
        screen.getByText("Email address is required.")
      ).toBeInTheDocument();
      expect(inviteBtn).toBeDisabled();
    });
  });

  it("shows validation error for invalid email", async () => {
    render(<InviteCollaborateModal {...defaultProps} />);
    const input = screen.getByLabelText("Email Address");
    fireEvent.change(input, { target: { value: "invalidemail" } });
    fireEvent.blur(input);
    await waitFor(() => {
      expect(
        screen.getByText("Please enter a valid email address.")
      ).toBeInTheDocument();
    });
  });

  it("enables Invite button and calls handleSubmit with valid email", async () => {
    render(<InviteCollaborateModal {...defaultProps} />);
    const input = screen.getByLabelText("Email Address");
    const inviteBtn = screen.getByText("Invite");
    fireEvent.change(input, { target: { value: "test@example.com" } });
    fireEvent.blur(input);
    await waitFor(() => {
      expect(inviteBtn).not.toBeDisabled();
    });
    fireEvent.click(inviteBtn);
    await waitFor(() => {
      expect(defaultProps.handleSubmit).toHaveBeenCalledWith({
        email: "test@example.com",
      });
    });
  });

  it("does not render modal when open is false", () => {
    render(<InviteCollaborateModal {...defaultProps} open={false} />);
    expect(screen.queryByTestId("mui-modal")).not.toBeInTheDocument();
  });
});
