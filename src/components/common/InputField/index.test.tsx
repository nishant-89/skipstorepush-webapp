import { render, screen, fireEvent } from "@testing-library/react";
import InputField from "../InputField";

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
});
