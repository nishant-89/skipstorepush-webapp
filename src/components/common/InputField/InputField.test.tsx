import { render, screen, fireEvent } from "@testing-library/react";
import InputField from "./InputField";

const defaultProps = {
  type: "text",
  value: "",
  onChange: jest.fn(),
  placeholder: "Enter your name",
  label: "Name",
  name: "name",
  required: true,
  className: "test-class",
  onBlur: jest.fn(),
  error: false,
};
describe("InputField Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the input with label", () => {
    render(<InputField {...defaultProps} />);
    expect(screen.getByLabelText("Name")).toBeInTheDocument();
  });

  it("calls onChange when typing", () => {
    render(<InputField {...defaultProps} />);
    const input = screen.getByLabelText("Name");
    fireEvent.change(input, { target: { value: "John" } });

    expect(defaultProps.onChange).toHaveBeenCalled();
  });

  it("calls onBlur when input loses focus", () => {
    render(<InputField {...defaultProps} />);
    const input = screen.getByLabelText("Name");
    fireEvent.blur(input);

    expect(defaultProps.onBlur).toHaveBeenCalled();
  });

  it("disables the input when disabled is true", () => {
    render(<InputField {...defaultProps} disabled={true} />);
    const input = screen.getByLabelText("Name");
    expect(input).toBeDisabled();
  });

  it("shows error when error prop is true", () => {
    render(<InputField {...defaultProps} error={true} />);
    const input = screen.getByLabelText("Name");
    expect(input).toHaveAttribute("aria-invalid", "true");
  });

  it("renders phone number input with country code", () => {
    render(<InputField {...defaultProps} name="phoneNumber" />);
    expect(screen.getByText("+1")).toBeInTheDocument();
  });

  it("renders with placeholder", () => {
    render(<InputField {...defaultProps} />);
    expect(screen.getByPlaceholderText("Enter your name")).toBeInTheDocument();
  });

  it("toggles password visibility without moving the caret", () => {
    render(
      <InputField
        {...defaultProps}
        type="password"
        name="password"
        label="Password"
        value="12345678"
        showPasswordToggle
      />
    );
    const input = screen.getByLabelText("Password") as HTMLInputElement;
    input.focus();
    input.setSelectionRange(4, 4);
    fireEvent.click(screen.getByLabelText("Show password"));
    expect(input).toHaveAttribute("type", "text");
    expect(input.selectionStart).toBe(4);
    expect(input.selectionEnd).toBe(4);
    fireEvent.click(screen.getByLabelText("Hide password"));
    expect(input).toHaveAttribute("type", "password");
    expect(input.selectionStart).toBe(4);
  });
});
