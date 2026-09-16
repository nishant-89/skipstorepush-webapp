import { render, screen, fireEvent } from "@testing-library/react";
import ButtonComp from "./index";

describe("ButtonComp", () => {
  it("renders with given label", () => {
    render(<ButtonComp label="Click Me" />);
    expect(
      screen.getByRole("button", { name: "Click Me" })
    ).toBeInTheDocument();
  });

  it("calls onClick when clicked", () => {
    const handleClick = jest.fn();
    render(<ButtonComp label="Click Me" onClick={handleClick} />);
    fireEvent.click(screen.getByRole("button", { name: "Click Me" }));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("is disabled when disabled prop is true", () => {
    render(<ButtonComp label="Disabled" disabled />);
    const button = screen.getByRole("button", { name: "Disabled" });
    expect(button).toBeDisabled();
  });

  it("applies custom className", () => {
    render(<ButtonComp label="Classy" className="my-class" />);
    const button = screen.getByRole("button", { name: "Classy" });
    expect(button).toHaveClass("my-class");
  });

  it("renders with icon when isIcon is true", () => {
    render(<ButtonComp label="Icon Button" isIcon icon="/test-icon.png" />);
    const img = screen.getByRole("img", { name: "rear-icon" });
    expect(img).toHaveAttribute("src", "/test-icon.png");
    expect(screen.getByText("Icon Button")).toBeInTheDocument();
  });

  it("renders rear icon when isRearIcon is true", () => {
    render(
      <ButtonComp label="Rear Icon" isRearIcon rearIcon="/rear-icon.png" />
    );
    const img = screen.getByRole("img", { name: "rear-icon" });
    expect(img).toHaveAttribute("src", "/rear-icon.png");
    expect(screen.getByText("Rear Icon")).toBeInTheDocument();
  });

  it("applies active class when isActive is true", () => {
    render(<ButtonComp label="Active" isActive />);
    const button = screen.getByRole("button", { name: "Active" });
    expect(button).toHaveClass("active");
  });

  it("defaults to type='button'", () => {
    render(<ButtonComp label="Default Button" />);
    const button = screen.getByRole("button", { name: "Default Button" });
    expect(button).toHaveAttribute("type", "button");
  });

  it("applies given button type", () => {
    render(<ButtonComp label="Submit" type="submit" />);
    const button = screen.getByRole("button", { name: "Submit" });
    expect(button).toHaveAttribute("type", "submit");
  });

  it("renders with correct variant", () => {
    render(<ButtonComp label="Outlined" variant="outlined" />);
    const button = screen.getByRole("button", { name: "Outlined" });
    expect(button).toHaveClass("MuiButton-outlined");
  });
});
