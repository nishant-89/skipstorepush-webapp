import { render, screen, fireEvent } from "@testing-library/react";
import SelectField from "../selectField";
import userEvent from "@testing-library/user-event";

describe("SelectField", () => {
  const mockOnChange = jest.fn();
  const mockOnBlur = jest.fn();

  const defaultProps = {
    label: "Test Label",
    name: "testField",
    value: "",
    placeholder: "Select an option",
    onChange: mockOnChange,
    onBlur: mockOnBlur,
    options: [
      { value: "1", label: "Option 1" },
      { value: "2", label: "Option 2" },
    ],
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the label and placeholder", () => {
    render(<SelectField {...defaultProps} />);
    expect(screen.getByText("Test Label")).toBeInTheDocument();
    expect(screen.getByText("Select an option")).toBeInTheDocument();
  });

  it("renders the correct selected value", () => {
    render(<SelectField {...defaultProps} value="2" />);
    expect(screen.getByText("Option 2")).toBeInTheDocument();
  });

  it("calls onChange when a different option is selected", async () => {
    render(<SelectField {...defaultProps} />);
    const selectInput = screen.getByRole("combobox");
    await userEvent.click(selectInput);
    await userEvent.click(screen.getByText("Option 1"));
    expect(mockOnChange).toHaveBeenCalled();
    expect(mockOnChange.mock.calls[0][0].target.value).toBe("1");
  });

  it("calls onBlur when select loses focus", () => {
    render(<SelectField {...defaultProps} />);
    const selectInput = screen.getByRole("combobox");
    fireEvent.blur(selectInput);
    expect(mockOnBlur).toHaveBeenCalled();
  });

  it("renders error message when error is passed", () => {
    render(<SelectField {...defaultProps} error="This field is required" />);
    expect(screen.getByText("This field is required")).toBeInTheDocument();
  });

  it("renders placeholder when value is 0 and 0 is not in options", () => {
    render(<SelectField {...defaultProps} value={0} />);
    expect(screen.getByText("Select an option")).toBeInTheDocument();
  });

  it("renders 0 as a valid selected value if present in options", () => {
    const propsWithZero = {
      ...defaultProps,
      value: 0,
      options: [
        { value: 0, label: "Zero" },
        { value: 1, label: "One" },
      ],
    };
    render(<SelectField {...propsWithZero} />);
    expect(screen.getByText("Zero")).toBeInTheDocument();
  });
});
