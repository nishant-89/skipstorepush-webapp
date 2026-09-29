import { fireEvent, render, screen } from "@testing-library/react";
import ThemeToggle from "src/components/common/ThemeToggle";
import { THEME_STORAGE_KEY } from "src/utils/theme";

describe("ThemeToggle", () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute("data-theme");
  });

  it("switches from dark to light and persists", () => {
    render(<ThemeToggle />);
    const toggle = screen.getByLabelText("Switch to light theme");
    expect(toggle).toHaveAttribute("aria-checked", "false");
    fireEvent.click(toggle);
    expect(document.documentElement.getAttribute("data-theme")).toBe("light");
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe("light");
    expect(screen.getByLabelText("Switch to dark theme")).toHaveAttribute(
      "aria-checked",
      "true"
    );
  });
});
