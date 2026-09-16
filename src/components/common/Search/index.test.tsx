import {
  render,
  fireEvent,
  screen,
  waitFor,
  createEvent,
} from "@testing-library/react";
import DebounceSearch from "./index";

// Mock image constant
jest.mock("src/utils/common/constants", () => ({
  Search: "/mock-search-icon.png",
  regex: {
    Emojis: /[\u{1F600}-\u{1F64F}]/gu, // Emoji regex for test mocking
  },
}));

describe("DebounceSearch Component", () => {
  let mockOnSearch: jest.Mock;
  let mockSetSearchTerm: jest.Mock;

  beforeEach(() => {
    jest.useFakeTimers();
    mockOnSearch = jest.fn();
    mockSetSearchTerm = jest.fn();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
    jest.clearAllMocks();
  });

  const setup = (props = {}) => {
    render(
      <DebounceSearch
        onSearch={mockOnSearch}
        setSearchTerm={mockSetSearchTerm}
        searchTerm=""
        {...props}
      />
    );
  };

  it("renders input with placeholder", () => {
    setup({ placeholder: "Search users..." });
    expect(screen.getByPlaceholderText("Search users...")).toBeInTheDocument();
  });

  it("updates value and triggers debounced search for alphanumeric input", async () => {
    setup();

    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "hello123" } });

    expect(mockSetSearchTerm).toHaveBeenCalledWith("hello123");

    jest.advanceTimersByTime(1000);

    await waitFor(() => {
      expect(mockOnSearch).toHaveBeenCalledWith("hello123");
    });
  });

  it("does not trigger search for less than 2 characters", () => {
    setup();

    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "h" } });

    jest.advanceTimersByTime(1000);

    expect(mockSetSearchTerm).toHaveBeenCalledWith("h");
    expect(mockOnSearch).not.toHaveBeenCalled();
  });

  it("allows empty value and calls search", () => {
    setup({ searchTerm: "abc" }); // 👈 simulate initial non-empty value

    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "" } });

    jest.advanceTimersByTime(1000);

    expect(mockSetSearchTerm).toHaveBeenCalledWith("");
    expect(mockOnSearch).toHaveBeenCalledWith("");
  });

  //   it("filters emojis from input", () => {
  //     setup({ searchTerm: "", alphanumericOnly: false });

  //     const input = screen.getByRole("textbox");
  //     fireEvent.change(input, { target: { value: "🔥test" } });

  //     jest.advanceTimersByTime(1000);

  //     expect(mockSetSearchTerm).toHaveBeenCalledWith("test");
  //     expect(mockOnSearch).toHaveBeenCalledWith("test");
  //   });

  it("blocks non-alphanumeric input if alphanumericOnly is true", () => {
    setup({ alphanumericOnly: true });

    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "!@#%" } });

    expect(mockSetSearchTerm).not.toHaveBeenCalled();
    expect(mockOnSearch).not.toHaveBeenCalled();
  });

  it("allows special characters if alphanumericOnly is false", () => {
    setup({ alphanumericOnly: false });

    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "!@#%" } });

    expect(mockSetSearchTerm).toHaveBeenCalledWith("!@#%");
    jest.advanceTimersByTime(1000);
    expect(mockOnSearch).toHaveBeenCalledWith("!@#%");
  });

  it("does not propagate keydown or click events", () => {
    setup();
    const input = screen.getByRole("textbox");

    const keyDownEvent = createEvent.keyDown(input);
    keyDownEvent.stopPropagation = jest.fn();
    input.dispatchEvent(keyDownEvent);

    const clickEvent = createEvent.click(input);
    clickEvent.stopPropagation = jest.fn();
    input.dispatchEvent(clickEvent);

    expect(keyDownEvent.stopPropagation).toHaveBeenCalledTimes(1);
    expect(clickEvent.stopPropagation).toHaveBeenCalledTimes(1);
  });
});
