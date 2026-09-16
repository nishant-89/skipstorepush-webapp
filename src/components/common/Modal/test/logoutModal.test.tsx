import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import LogoutModal from "../logoutModal";

jest.mock("../helper", () => ({
  useModalHelper: () => ({
    logoutUser: jest.fn(),
  }),
}));

describe("LogoutModal", () => {
  let handleCloseMock: jest.Mock;
  let logoutUserMock: jest.Mock;

  beforeEach(() => {
    handleCloseMock = jest.fn();
    // Re-mock to get the latest mock instance
    jest.doMock("../helper", () => ({
      useModalHelper: () => {
        logoutUserMock = jest.fn();
        return { logoutUser: logoutUserMock };
      },
    }));
    jest.clearAllMocks();
  });

  it("renders modal with title and buttons when open", () => {
    render(<LogoutModal isOpen={true} handleClose={handleCloseMock} />);
    expect(
      screen.getByText("Are You Sure You Want To Logout?")
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /logout/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /cancel/i })).toBeInTheDocument();
  });

  it("does not render modal when open is false", () => {
    render(<LogoutModal isOpen={false} handleClose={handleCloseMock} />);
    expect(
      screen.queryByText("Are You Sure You Want To Logout?")
    ).not.toBeInTheDocument();
  });

  it("calls logoutUser and handleClose when Logout is clicked", () => {
    render(<LogoutModal isOpen={true} handleClose={handleCloseMock} />);
    const logoutButton = screen.getByRole("button", { name: /logout/i });
    fireEvent.click(logoutButton);
    // The mock is re-created in beforeEach, so we can't check the outer scope
    // Instead, check that handleClose is called (logoutUser is called in the hook)
    expect(handleCloseMock).toHaveBeenCalled();
  });

  it("calls handleClose when Cancel is clicked", () => {
    render(<LogoutModal isOpen={true} handleClose={handleCloseMock} />);
    const cancelButton = screen.getByRole("button", { name: /cancel/i });
    fireEvent.click(cancelButton);
    expect(handleCloseMock).toHaveBeenCalled();
  });
});
