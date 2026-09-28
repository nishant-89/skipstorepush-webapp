import { render, screen, fireEvent } from "@testing-library/react";
import OtpInput from "./index";

describe("OtpInput", () => {
  it("renders six digit boxes", () => {
    render(<OtpInput value="" onChange={jest.fn()} />);
    expect(screen.getAllByRole("textbox")).toHaveLength(6);
  });

  it("moves to the next box after a digit is entered", () => {
    const onChange = jest.fn();
    render(<OtpInput value="" onChange={onChange} />);
    fireEvent.change(screen.getByLabelText("Digit 1"), {
      target: { value: "1" },
    });
    expect(onChange).toHaveBeenCalledWith("1     ");
  });

  it("pastes a full code across the boxes", () => {
    const onChange = jest.fn();
    render(<OtpInput value="" onChange={onChange} />);
    fireEvent.paste(screen.getByLabelText("Digit 1"), {
      clipboardData: { getData: () => "123456" },
    });
    expect(onChange).toHaveBeenCalledWith("123456");
  });

  it("clears a middle digit without shifting the others", () => {
    const onChange = jest.fn();
    render(<OtpInput value="123456" onChange={onChange} />);
    fireEvent.keyDown(screen.getByLabelText("Digit 3"), { key: "Backspace" });
    expect(onChange).toHaveBeenCalledWith("12 456");
  });

  it("marks only empty boxes as invalid", () => {
    render(
      <OtpInput
        value="12"
        onChange={jest.fn()}
        errorIndexes={[false, false, true, true, true, true]}
      />
    );
    expect(screen.getByLabelText("Digit 1")).not.toHaveClass("hasError");
    expect(screen.getByLabelText("Digit 3")).toHaveClass("hasError");
  });
});
