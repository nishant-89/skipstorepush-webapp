import { render } from "@testing-library/react";
import TableDataLoader from "../tableDataLoader";

const mockColumns = [
  { field: "name", headerName: "Name", width: 100, isNumeric: false },
  { field: "age", headerName: "Age", width: 50, isNumeric: true },
];

describe("TableDataLoader Component", () => {
  it("should render without crashing", () => {
    const { container } = render(<TableDataLoader columns={mockColumns} />);
    expect(container.firstChild).toBeInTheDocument();
  });
});
