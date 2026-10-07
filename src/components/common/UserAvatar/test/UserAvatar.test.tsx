import { render, screen } from "@testing-library/react";
import UserAvatar from "../UserAvatar";

describe("UserAvatar", () => {
  it("renders the photo when a source is provided", () => {
    render(<UserAvatar src="https://cdn/ada.png" alt="Ada" />);
    expect(screen.getByRole("img", { name: "Ada" })).toHaveAttribute(
      "src",
      "https://cdn/ada.png"
    );
  });

  it("renders a sized currentColor placeholder when the photo is missing", () => {
    const { container } = render(
      <UserAvatar src={null} className="profileImage" iconSize={36} alt="Ada" />
    );
    const mark = container.querySelector("svg");
    expect(container.querySelector(".isPlaceholder")).toBeInTheDocument();
    expect(mark).toHaveAttribute("width", "36");
    expect(mark?.querySelector("path")).toHaveAttribute("stroke", "currentColor");
  });
});
