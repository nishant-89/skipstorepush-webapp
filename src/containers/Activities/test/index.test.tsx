import { render, screen } from "@testing-library/react";
import Activities from "../index";
import { useActivitiesHelper } from "../helper";

jest.mock("../helper", () => {
  const actual = jest.requireActual("../helper");
  return {
    ...actual,
    useActivitiesHelper: jest.fn(),
  };
});

jest.mock("src/components/common/BreadCrumbs", () => ({
  __esModule: true,
  default: ({ title }: { title: string }) => <h1>{title}</h1>,
}));

jest.mock("src/components/common/Table", () => ({
  __esModule: true,
  default: () => <div>Activities table</div>,
}));

jest.mock("src/components/common/Loader/tableDataLoader", () => ({
  __esModule: true,
  default: () => <div>Loading activities</div>,
}));

jest.mock("src/components/common/NoData", () => ({
  __esModule: true,
  default: ({ title }: { title?: string }) => <div>{title}</div>,
}));

jest.mock("src/components/common/Search", () => ({
  __esModule: true,
  default: () => <input aria-label="Search" />,
}));

describe("Activities", () => {
  it("renders the empty state", () => {
    (useActivitiesHelper as jest.Mock).mockReturnValue({
      list: [],
      count: 0,
      loading: false,
      mainPage: 0,
      rowsPerPage: 10,
      searchTerm: "",
      term: "",
      setTerm: jest.fn(),
      setSearchTerm: jest.fn(),
      handleChangePage: jest.fn(),
      handleChangeRowsPerPage: jest.fn(),
    });

    render(<Activities />);
    expect(screen.getByText("My Activities")).toBeInTheDocument();
    expect(screen.getByText("No activities yet")).toBeInTheDocument();
  });

  it("renders the table when activities exist", () => {
    (useActivitiesHelper as jest.Mock).mockReturnValue({
      list: [{ id: 1 }],
      count: 1,
      loading: false,
      mainPage: 0,
      rowsPerPage: 10,
      searchTerm: "",
      term: "",
      setTerm: jest.fn(),
      setSearchTerm: jest.fn(),
      handleChangePage: jest.fn(),
      handleChangeRowsPerPage: jest.fn(),
    });

    render(<Activities />);
    expect(screen.getByText("Activities table")).toBeInTheDocument();
  });
});
