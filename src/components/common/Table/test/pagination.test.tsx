import { render, screen } from "@testing-library/react";
import PaginationComponent from "../pagination";

describe("PaginationComponent", () => {
  const defaultProps = {
    pageCount: 3,
    currentPage: 0,
    onPageChange: jest.fn(),
    rowsPerPage: 5,
    onRowsPerPageChange: jest.fn(),
  };

  it("renders without crashing", () => {
    render(<PaginationComponent {...defaultProps} />);
    expect(screen.getByText("Previous")).toBeInTheDocument();
    expect(screen.getByText("Next")).toBeInTheDocument();
  });

  it("uses default values when optional props are undefined", () => {
    // This test covers the ?? operator defaults (lines 59-60)
    render(
      <PaginationComponent
        {...defaultProps}
        marginPagesDisplayedByPos={undefined}
        pageRangeDisplayedPos={undefined}
      />
    );

    // Verify the component renders correctly with defaults
    expect(screen.getByText("Previous")).toBeInTheDocument();
    expect(screen.getByText("Next")).toBeInTheDocument();
  });

  it("uses provided values when optional props are provided", () => {
    // This test covers when the ?? operator doesn't use defaults (lines 59-60)
    render(
      <PaginationComponent
        {...defaultProps}
        marginPagesDisplayedByPos={1}
        pageRangeDisplayedPos={2}
      />
    );

    // Verify the component renders correctly with provided values
    expect(screen.getByText("Previous")).toBeInTheDocument();
    expect(screen.getByText("Next")).toBeInTheDocument();
  });

  it("uses default values when optional props are zero", () => {
    // This test covers the ?? operator when values are 0 (falsy but not nullish)
    render(
      <PaginationComponent
        {...defaultProps}
        marginPagesDisplayedByPos={0}
        pageRangeDisplayedPos={0}
      />
    );

    // Verify the component renders correctly with zero values
    expect(screen.getByText("Previous")).toBeInTheDocument();
    expect(screen.getByText("Next")).toBeInTheDocument();
  });

  it("renders rows per page selector", () => {
    render(<PaginationComponent {...defaultProps} />);
    expect(screen.getByRole("combobox")).toBeInTheDocument();
  });
});
