import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import SuccessModal from "../successModal";

describe("SuccessModal", () => {
  let setOpenMock: jest.Mock;

  beforeEach(() => {
    setOpenMock = jest.fn();
    jest.clearAllMocks();
  });

  it("renders modal with title and description and icon", () => {
    render(<SuccessModal open={true} setOpen={setOpenMock} />);
    expect(screen.getByText("User Added Successfully")).toBeInTheDocument();
    expect(
      screen.getByText(
        "An email with the account information has been sent to the user."
      )
    ).toBeInTheDocument();
    // Find the icon by alt text
    const img = screen.getByAltText("modal icon");
    expect(img).toBeInTheDocument();
    // Optionally, check src if needed
    // expect(img).toHaveAttribute("src", expect.stringContaining("circlecheck.svg"));
  });

  it("calls setOpen(false) when Exit button is clicked", () => {
    render(<SuccessModal open={true} setOpen={setOpenMock} />);
    const exitButton = screen.getByRole("button", { name: /exit/i });
    fireEvent.click(exitButton);
    expect(setOpenMock).toHaveBeenCalledWith(false);
  });

  it("does not render modal when open is false", () => {
    render(<SuccessModal open={false} setOpen={setOpenMock} />);
    expect(
      screen.queryByText("User Added Successfully")
    ).not.toBeInTheDocument();
  });
});
