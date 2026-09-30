import { render, screen } from "@testing-library/react";
import Settings from "../index";

jest.mock("src/components/common/BreadCrumbs", () => ({
  __esModule: true,
  default: ({ title }: { title: string }) => <h1>{title}</h1>,
}));

describe("Settings", () => {
  it("renders a blank settings shell", () => {
    render(<Settings />);
    expect(screen.getByRole("heading", { name: "Settings" })).toBeInTheDocument();
  });
});
