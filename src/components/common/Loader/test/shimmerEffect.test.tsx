import { render } from "@testing-library/react";
import ShimmerEffect from "../shimmerEffect";

describe("ShimmerEffect Component", () => {
  it("renders Terms and Conditions shimmer for tab 0", () => {
    const { container } = render(<ShimmerEffect tab={0} />);
    expect(container.querySelectorAll(".shimmer-text").length).toBe(3);
    expect(container.querySelector(".shimmer-text.long")).toBeInTheDocument();
    expect(container.querySelector(".shimmer-text.short")).toBeInTheDocument();
  });

  it("renders Privacy Policy shimmer for tab 1", () => {
    const { container } = render(<ShimmerEffect tab={1} />);
    expect(container.querySelectorAll(".shimmer-text").length).toBe(2);
    expect(container.querySelector(".shimmer-title")).toBeInTheDocument();
    expect(container.querySelector(".shimmer-link")).toBeInTheDocument();
  });

  it("renders About Us shimmer for tab 2", () => {
    const { container } = render(<ShimmerEffect tab={2} />);
    expect(container.querySelectorAll(".shimmer-title").length).toBe(2);
    expect(container.querySelectorAll(".shimmer-link").length).toBe(3);
    expect(container.querySelectorAll(".shimmer-img").length).toBe(4);
  });

  it("renders FAQ shimmer for tab 3", () => {
    const { container } = render(<ShimmerEffect tab={3} />);
    expect(container.querySelectorAll(".fandq").length).toBe(1);
    expect(container.querySelectorAll(".card.border.mb-20").length).toBe(2);
    expect(container.querySelectorAll(".shimmer-text").length).toBe(4);
  });

  it("renders nothing for unknown tab", () => {
    const { container } = render(<ShimmerEffect tab={99} />);
    expect(container.firstChild).toBeNull();
  });
});
