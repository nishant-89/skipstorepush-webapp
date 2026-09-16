import { render, screen, fireEvent } from "@testing-library/react";
import NoData from "./index";

// Mocks
jest.mock("src/utils/common/constants", () => ({
  notFound: "/mock-not-found.png",
  AddButtonIcon: "/mock-add-icon.svg",
}));

// Define the type for the mocked Button props
interface MockButtonProps {
  label: string;
  onClick?: () => void;
  disabled?: boolean;
}

jest.mock("../Button", () => (props: MockButtonProps) => {
  const { label, onClick, disabled } = props;
  return (
    <button onClick={onClick} disabled={disabled}>
      {label}
    </button>
  );
});

describe("NoData Component", () => {
  it("renders default title when no title is provided", () => {
    render(<NoData />);
    expect(screen.getByTestId("no-data")).toHaveTextContent("No Data Found");
  });

  it("renders custom title when provided", () => {
    render(<NoData title="Custom Title" />);
    expect(screen.getByTestId("no-data")).toHaveTextContent("Custom Title");
  });

  it("renders subtitle when provided", () => {
    render(<NoData subtitle="This is a subtitle" />);
    expect(screen.getByText("This is a subtitle")).toBeInTheDocument();
  });

  it("does not render subtitle when not provided", () => {
    render(<NoData />);
    expect(screen.queryByText("This is a subtitle")).not.toBeInTheDocument();
  });

  it("does not render button when buttonLabel and buttonAction are missing", () => {
    render(<NoData />);
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("renders button with label when buttonLabel and action are provided", () => {
    const mockFn = jest.fn();
    render(<NoData buttonLabel="Add Item" buttonAction={mockFn} />);
    expect(
      screen.getByRole("button", { name: "Add Item" })
    ).toBeInTheDocument();
  });

  it("calls buttonAction on button click", () => {
    const mockFn = jest.fn();
    render(<NoData buttonLabel="Click Me" buttonAction={mockFn} />);
    fireEvent.click(screen.getByRole("button", { name: "Click Me" }));
    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  it("disables button when isDisabled is true", () => {
    const mockFn = jest.fn();
    render(
      <NoData buttonLabel="Disabled" buttonAction={mockFn} isDisabled={true} />
    );
    expect(screen.getByRole("button", { name: "Disabled" })).toBeDisabled();
  });

  it("renders the not found image", () => {
    render(<NoData />);
    const img = screen.getByAltText("Not Found") as HTMLImageElement;
    expect(img).toBeInTheDocument();
    expect(img.src).toContain("/mock-not-found.png");
  });
});
