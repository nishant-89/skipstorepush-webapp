import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SelectComponent from "../index";

// Mock uuid to have unique values in tests
jest.mock("uuid", () => ({
  v4: jest.fn(() => Math.random().toString(36).substr(2, 9)),
}));

describe("SelectComponent", () => {
  const mockOnChange = jest.fn();
  const mockSetPage = jest.fn();
  const mockFetchOptions = jest.fn();

  const defaultProps = {
    title: "Test Select",
    label: "Select Label",
    placeholder: "Choose an option",
    options: [
      { value: "1", label: "Option 1" },
      { value: "2", label: "Option 2" },
      { value: "3", label: "Option 3" },
    ],
    value: "",
    onChange: mockOnChange,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the component with title and label", () => {
    render(<SelectComponent {...defaultProps} />);

    expect(screen.getByText("Test Select")).toBeInTheDocument();
    expect(screen.getByText("Select Label")).toBeInTheDocument();
  });

  it("displays placeholder when no value is selected", () => {
    render(<SelectComponent {...defaultProps} />);

    expect(screen.getByText("Choose an option")).toBeInTheDocument();
  });

  it("displays selected option label when value is provided", () => {
    render(<SelectComponent {...defaultProps} value="2" />);

    expect(screen.getByText("Option 2")).toBeInTheDocument();
  });

  it("opens dropdown and displays options when clicked", async () => {
    const user = userEvent.setup();
    render(<SelectComponent {...defaultProps} />);

    const selectElement = screen.getByRole("combobox");
    await user.click(selectElement);

    expect(screen.getByText("Option 1")).toBeInTheDocument();
    expect(screen.getByText("Option 2")).toBeInTheDocument();
    expect(screen.getByText("Option 3")).toBeInTheDocument();
  });

  it("calls onChange when an option is selected", async () => {
    const user = userEvent.setup();
    render(<SelectComponent {...defaultProps} />);

    const selectElement = screen.getByRole("combobox");
    await user.click(selectElement);

    const option = screen.getByText("Option 2");
    await user.click(option);

    expect(mockOnChange).toHaveBeenCalledWith("2");
  });

  it("calls fetchOptions when dropdown is opened", async () => {
    const user = userEvent.setup();
    render(
      <SelectComponent {...defaultProps} fetchOptions={mockFetchOptions} />
    );

    const selectElement = screen.getByRole("combobox");
    await user.click(selectElement);

    expect(mockFetchOptions).toHaveBeenCalled();
  });

  it("displays loading state when loading prop is true", async () => {
    const user = userEvent.setup();
    render(<SelectComponent {...defaultProps} options={[]} loading={true} />);

    const selectElement = screen.getByRole("combobox");
    await user.click(selectElement);

    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("displays no data message when no options are available", async () => {
    const user = userEvent.setup();
    render(<SelectComponent {...defaultProps} options={[]} loading={false} />);

    const selectElement = screen.getByRole("combobox");
    await user.click(selectElement);

    expect(screen.getByText("No data")).toBeInTheDocument();
  });

  it("applies custom styles when provided", () => {
    const customStyles = { backgroundColor: "red" };
    const customSelectStyles = { color: "blue" };
    const customMenuItemStyles = { padding: "10px" };

    render(
      <SelectComponent
        {...defaultProps}
        styles={customStyles}
        selectStyles={customSelectStyles}
        menuItemStyles={customMenuItemStyles}
      />
    );

    const formControl = document.querySelector(".custom-select-wrapper");
    const select = document.querySelector(".custom-select");

    expect(formControl).toHaveStyle("background-color: red");
    expect(select).toHaveStyle("color: blue");
  });

  it("adds select-open class when dropdown is open", async () => {
    const user = userEvent.setup();
    render(<SelectComponent {...defaultProps} />);

    const formControl = document.querySelector(".custom-select-wrapper");
    const selectElement = screen.getByRole("combobox");

    expect(formControl).not.toHaveClass("select-open");

    await user.click(selectElement);

    expect(formControl).toHaveClass("select-open");
  });

  it("handles scroll event and calls setPage when scrolled to bottom", async () => {
    const propsWithPagination = {
      ...defaultProps,
      setPage: mockSetPage,
      page: 0,
      limit: 5,
      count: 15,
      loading: false,
    };

    const user = userEvent.setup();
    render(<SelectComponent {...propsWithPagination} />);

    const selectElement = screen.getByRole("combobox");
    await user.click(selectElement);

    // Get the Paper element which has the scroll handler
    const paper = document.querySelector(".MuiPaper-root");

    if (paper) {
      // Create and dispatch scroll event with proper currentTarget
      const scrollEvent = new Event("scroll", { bubbles: true });
      Object.defineProperty(scrollEvent, "currentTarget", {
        value: {
          scrollTop: 190,
          scrollHeight: 200,
          clientHeight: 200,
        },
        writable: false,
      });

      fireEvent(paper, scrollEvent);

      // Wait for debounced function to execute (300ms + buffer)
      await waitFor(
        () => {
          expect(mockSetPage).toHaveBeenCalled();
        },
        { timeout: 1000 }
      );
    }
  });

  it("does not call setPage when loading is true", async () => {
    const propsWithPagination = {
      ...defaultProps,
      setPage: mockSetPage,
      page: 0,
      limit: 5,
      count: 15,
      loading: true,
    };

    const user = userEvent.setup();
    render(<SelectComponent {...propsWithPagination} />);

    const selectElement = screen.getByRole("combobox");
    await user.click(selectElement);

    const paper = document.querySelector(".MuiPaper-root");

    if (paper) {
      const scrollEvent = new Event("scroll", { bubbles: true });
      Object.defineProperty(scrollEvent, "currentTarget", {
        value: {
          scrollTop: 190,
          scrollHeight: 200,
          clientHeight: 200,
        },
        writable: false,
      });

      fireEvent(paper, scrollEvent);

      // Wait to ensure debounced function doesn't execute
      await new Promise((resolve) => setTimeout(resolve, 400));

      expect(mockSetPage).not.toHaveBeenCalled();
    }
  });

  it("does not call setPage when all pages are loaded", async () => {
    const propsWithPagination = {
      ...defaultProps,
      setPage: mockSetPage,
      page: 2,
      limit: 5,
      count: 15,
      loading: false,
    };

    const user = userEvent.setup();
    render(<SelectComponent {...propsWithPagination} />);

    const selectElement = screen.getByRole("combobox");
    await user.click(selectElement);

    const paper = document.querySelector(".MuiPaper-root");

    if (paper) {
      const scrollEvent = new Event("scroll", { bubbles: true });
      Object.defineProperty(scrollEvent, "currentTarget", {
        value: {
          scrollTop: 190,
          scrollHeight: 200,
          clientHeight: 200,
        },
        writable: false,
      });

      fireEvent(paper, scrollEvent);

      await new Promise((resolve) => setTimeout(resolve, 400));

      expect(mockSetPage).not.toHaveBeenCalled();
    }
  });

  it("uses fallback placeholder when selected option is not found", () => {
    // Test with empty string which is a valid but non-matching value
    render(<SelectComponent {...defaultProps} value="" />);

    expect(screen.getByText("Choose an option")).toBeInTheDocument();
  });

  it("handles empty title and label", () => {
    render(<SelectComponent {...defaultProps} title="" label="" />);

    // Component should still render without errors
    expect(screen.getByRole("combobox")).toBeInTheDocument();
  });

  it("uses default prop values when optional props are not provided", () => {
    const minimalProps = {
      title: "Minimal Select",
      options: [{ value: "1", label: "Option 1" }],
      value: "",
      onChange: mockOnChange,
    };

    render(<SelectComponent {...minimalProps} />);

    expect(screen.getByText("Minimal Select")).toBeInTheDocument();
    expect(screen.getByText("Select an option")).toBeInTheDocument(); // default placeholder
  });

  it("closes dropdown when onClose is triggered", async () => {
    const user = userEvent.setup();
    render(<SelectComponent {...defaultProps} />);

    const formControl = document.querySelector(".custom-select-wrapper");
    const selectElement = screen.getByRole("combobox");

    // Open dropdown
    await user.click(selectElement);
    expect(formControl).toHaveClass("select-open");

    // Close dropdown by clicking outside or pressing escape
    await user.keyboard("{Escape}");

    await waitFor(() => {
      expect(formControl).not.toHaveClass("select-open");
    });
  });

  it("uses default placeholder when placeholder prop is not provided", () => {
    const propsWithoutPlaceholder = {
      title: "Test Select",
      options: [{ value: "1", label: "Option 1" }],
      value: "",
      onChange: mockOnChange,
      // No placeholder prop provided - should use default "Select an option"
    };

    render(<SelectComponent {...propsWithoutPlaceholder} />);

    expect(screen.getByText("Select an option")).toBeInTheDocument();
  });

  it("uses default loading value when loading prop is not provided", async () => {
    const propsWithoutLoading = {
      title: "Test Select",
      options: [],
      value: "",
      onChange: mockOnChange,
      // No loading prop provided - should use default false
    };

    const user = userEvent.setup();
    render(<SelectComponent {...propsWithoutLoading} />);

    const selectElement = screen.getByRole("combobox");
    await user.click(selectElement);

    // Should show "No data" instead of "Loading..." since default loading is false
    expect(screen.getByText("No data")).toBeInTheDocument();
    expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
  });

  it("uses default setPage function when setPage prop is not provided", async () => {
    const propsWithoutSetPage = {
      title: "Test Select",
      options: [
        { value: "1", label: "Option 1" },
        { value: "2", label: "Option 2" },
      ],
      value: "",
      onChange: mockOnChange,
      page: 0,
      limit: 1,
      count: 10,
      loading: false,
      // No setPage prop provided - should use default empty function
    };

    const user = userEvent.setup();
    render(<SelectComponent {...propsWithoutSetPage} />);

    const selectElement = screen.getByRole("combobox");
    await user.click(selectElement);

    const paper = document.querySelector(".MuiPaper-root");

    if (paper) {
      const scrollEvent = new Event("scroll", { bubbles: true });
      Object.defineProperty(scrollEvent, "currentTarget", {
        value: {
          scrollTop: 190,
          scrollHeight: 200,
          clientHeight: 200,
        },
        writable: false,
      });

      fireEvent(paper, scrollEvent);

      // Should not throw error even with default setPage function
      await new Promise((resolve) => setTimeout(resolve, 400));
    }
  });

  it("sets open state to true and calls fetchOptions when dropdown is opened", async () => {
    const user = userEvent.setup();
    render(
      <SelectComponent {...defaultProps} fetchOptions={mockFetchOptions} />
    );

    const formControl = document.querySelector(".custom-select-wrapper");
    const selectElement = screen.getByRole("combobox");

    // Initially should not have select-open class
    expect(formControl).not.toHaveClass("select-open");

    // Open dropdown
    await user.click(selectElement);

    // Should have select-open class (indicating setOpen(true) was called)
    expect(formControl).toHaveClass("select-open");

    // Should call fetchOptions
    expect(mockFetchOptions).toHaveBeenCalled();
  });
});
