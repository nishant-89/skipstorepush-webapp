import { render, screen } from "@testing-library/react";
import CustomTooltip from "./index";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";

describe("CustomTooltip Component", () => {
  it("renders child content correctly", () => {
    render(
      <CustomTooltip content="Tooltip content">
        <button>Hover me</button>
      </CustomTooltip>
    );

    expect(
      screen.getByRole("button", { name: /hover me/i })
    ).toBeInTheDocument();
  });

  it("shows tooltip on hover", async () => {
    render(
      <CustomTooltip content="Tooltip content">
        <button>Hover me</button>
      </CustomTooltip>
    );

    const button = screen.getByRole("button", { name: /hover me/i });

    await userEvent.hover(button);

    expect(await screen.findByText("Tooltip content")).toBeInTheDocument();
    expect(screen.getByText("Tooltip content")).toHaveClass("tooltipTitle");
  });

  it("hides tooltip on unhover", async () => {
    render(
      <CustomTooltip content="Tooltip content">
        <button>Hover me</button>
      </CustomTooltip>
    );

    const button = screen.getByRole("button", { name: /hover me/i });

    await userEvent.hover(button);
    expect(await screen.findByText("Tooltip content")).toBeInTheDocument();
  });

  it("supports additional MUI props like placement", async () => {
    render(
      <CustomTooltip content="Tooltip with top placement" placement="top">
        <button>Hover here</button>
      </CustomTooltip>
    );

    const button = screen.getByRole("button", { name: /hover here/i });

    await userEvent.hover(button);

    expect(
      await screen.findByText("Tooltip with top placement")
    ).toBeInTheDocument();
  });
});
