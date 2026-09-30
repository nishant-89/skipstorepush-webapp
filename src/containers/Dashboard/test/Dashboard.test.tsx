import { render, screen } from "@testing-library/react";
import Dashboard from "../Dashboard";

jest.mock("react-redux", () => ({
  useSelector: (selector: (state: unknown) => unknown) =>
    selector({
      profile: { data: { fullName: "Ada Lovelace" } },
    }),
}));

jest.mock("src/components/common/BreadCrumbs/BreadCrumbs", () => ({
  __esModule: true,
  default: ({ currentLabel }: { currentLabel?: string }) => (
    <nav aria-label="breadcrumb">{currentLabel}</nav>
  ),
}));

describe("Dashboard", () => {
  it("greets the signed-in user instead of Dashboard", () => {
    render(<Dashboard />);
    expect(screen.getByLabelText("breadcrumb")).toHaveTextContent(
      "Hello, Ada Lovelace"
    );
  });
});
