import { render } from "@testing-library/react";
import SortIcon from "../SortIcon";

describe("SortIcon", () => {
  it("renders without crashing", () => {
    const { container } = render(<SortIcon sortOrder="asc" />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it("applies ascOrder class when sortOrder is asc", () => {
    const { container } = render(<SortIcon sortOrder="asc" />);
    const upArrow = container.querySelector(".upArrow");
    expect(upArrow).toHaveClass("ascOrder");
  });

  it("applies descOrder class when sortOrder is desc", () => {
    const { container } = render(<SortIcon sortOrder="desc" />);
    const downArrow = container.querySelector(".downArrow");
    expect(downArrow).toHaveClass("descOrder");
  });

  it("does not apply descOrder class when sortOrder is not desc", () => {
    const { container } = render(<SortIcon sortOrder="asc" />);
    const downArrow = container.querySelector(".downArrow");
    expect(downArrow).not.toHaveClass("descOrder");
  });

  it("handles empty sortOrder", () => {
    const { container } = render(<SortIcon sortOrder="" />);
    const upArrow = container.querySelector(".upArrow");
    const downArrow = container.querySelector(".downArrow");
    expect(upArrow).not.toHaveClass("ascOrder");
    expect(downArrow).not.toHaveClass("descOrder");
  });
});
