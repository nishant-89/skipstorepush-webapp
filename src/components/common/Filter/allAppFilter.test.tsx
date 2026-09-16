import { render, screen, fireEvent } from "@testing-library/react";
import AllAppFilterPopUp from "./allAppFilter";

const setup = (propsOverride = {}) => {
  const setSelectedFilters = jest.fn();
  const setIsRedIndicator = jest.fn();
  const props = {
    selectedFilters: [],
    setSelectedFilters,
    setIsRedIndicator,
    isRedIndicator: false,
    ...propsOverride,
  };
  render(<AllAppFilterPopUp {...props} />);
  return { setSelectedFilters, setIsRedIndicator };
};

describe("AllAppFilterPopUp", () => {
  it("renders filter button", () => {
    setup();
    expect(
      screen.getByRole("button", { name: /filters/i })
    ).toBeInTheDocument();
  });

  it("opens popover on filter button click", () => {
    setup();
    fireEvent.click(screen.getByRole("button", { name: /filters/i }));
    expect(screen.getByText(/Operating System/i)).toBeInTheDocument();
    expect(screen.getByText(/iOS/i)).toBeInTheDocument();
    expect(screen.getByText(/Android/i)).toBeInTheDocument();
  });

  it("selects and applies filters", () => {
    const { setSelectedFilters, setIsRedIndicator } = setup();
    fireEvent.click(screen.getByRole("button", { name: /filters/i }));
    // Uncheck iOS
    const iosCheckbox = screen.getByLabelText("iOS");
    fireEvent.click(iosCheckbox);
    // Apply
    const applyBtn = screen.getByRole("button", { name: /apply/i });
    fireEvent.click(applyBtn);
    expect(setSelectedFilters).toHaveBeenCalledWith(["ANDROID"]);
    expect(setIsRedIndicator).toHaveBeenCalledWith(true);
  });

  it("shows red indicator when filters are applied", () => {
    setup({ isRedIndicator: true });
    const badge = document.querySelector(".MuiBadge-dot");
    expect(badge).toBeTruthy();
  });

  it("cancels filter selection", () => {
    setup();
    fireEvent.click(screen.getByRole("button", { name: /filters/i }));
    const cancelBtn = screen.getByRole("button", { name: /cancel/i });
    fireEvent.click(cancelBtn);
    const osLabel = screen.getByText(/Operating System/i);
    expect(osLabel).not.toBeVisible();
  });

  it("disables apply button when no filters selected", () => {
    setup();
    fireEvent.click(screen.getByRole("button", { name: /filters/i }));
    // Uncheck both
    fireEvent.click(screen.getByLabelText("All"));
    const applyBtn = screen.getByRole("button", { name: /apply/i });
    expect(applyBtn).toBeDisabled();
  });

  it("handles Android checkbox selection individually", () => {
    const { setSelectedFilters, setIsRedIndicator } = setup();
    fireEvent.click(screen.getByRole("button", { name: /filters/i }));
    // Uncheck Android specifically
    const androidCheckbox = screen.getByLabelText("Android");
    fireEvent.click(androidCheckbox);
    // Apply
    const applyBtn = screen.getByRole("button", { name: /apply/i });
    fireEvent.click(applyBtn);
    expect(setSelectedFilters).toHaveBeenCalledWith(["IOS"]);
    expect(setIsRedIndicator).toHaveBeenCalledWith(true);
  });

  it("applies filters when both iOS and Android are selected", () => {
    const { setSelectedFilters, setIsRedIndicator } = setup();
    fireEvent.click(screen.getByRole("button", { name: /filters/i }));
    // Both are selected by default, just apply
    const applyBtn = screen.getByRole("button", { name: /apply/i });
    fireEvent.click(applyBtn);
    expect(setSelectedFilters).toHaveBeenCalledWith([]);
    expect(setIsRedIndicator).toHaveBeenCalledWith(false);
  });
});
