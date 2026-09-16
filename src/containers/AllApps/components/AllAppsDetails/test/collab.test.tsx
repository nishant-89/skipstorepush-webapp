import { render, screen, fireEvent } from "@testing-library/react";
import CollaboratorSection from "../collaborator";

jest.mock("src/components/common/Button", () => (props: any) => (
  <button onClick={props.onClick}>{props.label}</button>
));

jest.mock("src/components/common/Loader/tableDataLoader", () => () => (
  <div data-testid="table-loader">Loading...</div>
));

jest.mock("src/components/common/Table", () => (props: any) => (
  <div data-testid="table-component">
    <div>Mock Table</div>
    <div>Rows: {props.rowsPerPage}</div>
    <div>Page: {props.page}</div>
  </div>
));

jest.mock(
  "src/components/common/Modal/inviteCollaborateModal",
  () => (props: any) =>
    props.open ? (
      <div data-testid="invite-modal">
        <div>{props.title}</div>
        <div>{props.description}</div>
        <button onClick={() => props.onClose()}>Close</button>
        <button
          onClick={() => props.handleSubmit({ email: "test@example.com" })}
        >
          Submit
        </button>
      </div>
    ) : null
);

describe("CollaboratorSection", () => {
  const defaultProps = {
    invite: false,
    setInvite: jest.fn(),
    loadingCollab: false,
    filteredDataCollab: [
      {
        id: "1",
        email: "abc@example.com",
        fullName: "John Doe",
        role: "Developer",
        profile_image: "https://example.com/image.jpg",
        status: "active", // if it's a typo, rename to `status`
      },
    ],
    mainPageCollab: 0,
    rowsPerPageCollab: 10,
    handleCollabChangePage: jest.fn(),
    countCollab: 1,
    handleCollabChangeRowsPerPage: jest.fn(),
    handleInvite: jest.fn(),
    Modal: {
      inviteTitle: "Invite Collaborator",
      inviteDesc: "Enter email to invite",
      deleteCollabTitle: "Are you sure you want to delete this collaborator?",
      deleteCollabDesc: "This action will remove their access permanently.",
    },

    isOwner: true,
    handleCollabModel: jest.fn(),
    delCollab: false,
    setDelCollab: jest.fn(),
    handleDeleteCollab: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render header and invite button", () => {
    render(<CollaboratorSection {...defaultProps} />);
    expect(screen.getByText("Collaborators")).toBeInTheDocument();
    expect(screen.getByText("Invite")).toBeInTheDocument();
  });

  it("should call setInvite(true) on Invite button click", () => {
    render(<CollaboratorSection {...defaultProps} />);
    fireEvent.click(screen.getByText("Invite"));
    expect(defaultProps.setInvite).toHaveBeenCalledWith(true);
  });

  it("should render TableComponent when not loading", () => {
    render(<CollaboratorSection {...defaultProps} />);
    expect(screen.getByTestId("table-component")).toBeInTheDocument();
    expect(screen.queryByTestId("table-loader")).not.toBeInTheDocument();
  });

  it("should render TableDataLoader when loading", () => {
    render(<CollaboratorSection {...defaultProps} loadingCollab={true} />);
    expect(screen.getByTestId("table-loader")).toBeInTheDocument();
  });

  it("should render InviteCollaborateModal when invite is true", () => {
    render(<CollaboratorSection {...defaultProps} invite={true} />);
    expect(screen.getByTestId("invite-modal")).toBeInTheDocument();
    expect(screen.getByText("Invite Collaborator")).toBeInTheDocument();
    expect(screen.getByText("Enter email to invite")).toBeInTheDocument();
  });

  it("should call setInvite(false) on modal close", () => {
    render(<CollaboratorSection {...defaultProps} invite={true} />);
    fireEvent.click(screen.getByText("Close"));
    expect(defaultProps.setInvite).toHaveBeenCalledWith(false);
  });

  it("should call handleInvite on modal submit", () => {
    render(<CollaboratorSection {...defaultProps} invite={true} />);
    fireEvent.click(screen.getByText("Submit"));
    expect(defaultProps.handleInvite).toHaveBeenCalledWith({
      email: "test@example.com",
    });
  });
});
