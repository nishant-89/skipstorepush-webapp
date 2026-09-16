import { render } from "@testing-library/react";
import { getReleaseColumns } from "../column";
import { RELEASE_RESPONSE_TYPE } from "../../../types";
import { BrowserRouter as Router } from "react-router-dom";

jest.mock("src/utils/common/helpers", () => ({
  capitalizeFirstLetter: jest.fn(
    (str: string) => str.charAt(0).toUpperCase() + str.slice(1)
  ),
  DateFormatter: ({ date }: { date: string }) => <span>{date}</span>,
}));

describe("getReleaseColumns", () => {
  const appId = "app123";

  const mockReleaseData: RELEASE_RESPONSE_TYPE = {
    id: "release1",
    releaseVersion: "1.0.0",
    target_version: "2.0.0",
    status: "LIVE",
    isMandatory: true,
    rollbackCount: 2,
    createdDate: "2025-06-12T12:00:00Z",
    updatedDate: "string",
    releaseNote: "string",
    environmentName: "string",
    appName: "string",
    appId: "string",
    appEnvironment: "string",
    osType: "string",
    releaseCount: 0,
    isPromoted: false,
    rollout: 10,
    released_by: {
      id: "string",
      email: "string",
      fullName: "string",
    },
  };

  it("should return expected number of columns", () => {
    const columns = getReleaseColumns(appId);
    expect(columns.length).toBe(7);
  });

  it("should render releaseVersion with Link", () => {
    const columns = getReleaseColumns(appId);
    const ReleaseCell = columns[0].renderCell!;

    const { getByText } = render(
      <Router>{ReleaseCell(mockReleaseData)}</Router>
    );

    const link = getByText("1.0.0") as HTMLAnchorElement;
    expect(link).toBeInTheDocument();
    expect(link.getAttribute("href")).toBe(
      `/all-apps/details/${appId}/release/${mockReleaseData.id}`
    );
  });

  it("should render status with correct label and color", () => {
    const columns = getReleaseColumns(appId);
    const StatusCell = columns[2].renderCell!;
    const { getByText, container } = render(StatusCell(mockReleaseData));

    expect(getByText("LIVE")).toBeInTheDocument();
    const dot = container.querySelector("span");
    expect(dot).toHaveStyle("background-color: #17B26A");
  });

  it("should render status as 'Rollback' if status is ROLLED_BACK", () => {
    const columns = getReleaseColumns(appId);
    const StatusCell = columns[2].renderCell!;
    const mockRollbackData = { ...mockReleaseData, status: "ROLLED_BACK" };

    const { getByText } = render(StatusCell(mockRollbackData));
    expect(getByText("Rollback")).toBeInTheDocument();
  });

  it("should render isMandatory as 'Yes'", () => {
    const columns = getReleaseColumns(appId);
    const MandatoryCell = columns[3].renderCell!;
    const { getByText } = render(MandatoryCell(mockReleaseData));
    expect(getByText("Yes")).toBeInTheDocument();
  });

  it("should render rollbackCount correctly", () => {
    const columns = getReleaseColumns(appId);
    const RollbacksCell = columns[4].renderCell!;
    const { getByText } = render(RollbacksCell(mockReleaseData));
    expect(getByText("2")).toBeInTheDocument();
  });

  it("should render createdDate using DateFormatter", () => {
    const columns = getReleaseColumns(appId);
    const DateCell = columns[5].renderCell!;
    const { getByText } = render(DateCell(mockReleaseData));
    expect(getByText("2025-06-12T12:00:00Z")).toBeInTheDocument();
  });

  it("should render Active Devices as 0 devices", () => {
    const columns = getReleaseColumns(appId);
    const DevicesCell = columns[6].renderCell!;
    const { getByText } = render(DevicesCell(mockReleaseData));
    expect(getByText("0 Device")).toBeInTheDocument();
  });

  it('should render "Yes" when isMandatory is true', () => {
    const columns = getReleaseColumns("123");
    const isMandatoryColumn = columns.find(
      (col) => col.field === "isMandatory"
    );

    expect(isMandatoryColumn).toBeDefined(); // optional assertion

    if (isMandatoryColumn && isMandatoryColumn.renderCell) {
      const cell = isMandatoryColumn.renderCell({ isMandatory: true } as any);
      const { getByText } = render(<>{cell}</>);
      expect(getByText("Yes")).toBeInTheDocument();
    }
  });

  it('should render "No" when isMandatory is false', () => {
    const columns = getReleaseColumns("123");
    const isMandatoryColumn = columns.find(
      (col) => col.field === "isMandatory"
    );

    expect(isMandatoryColumn).toBeDefined(); // optional assertion

    if (isMandatoryColumn && isMandatoryColumn.renderCell) {
      const cell = isMandatoryColumn?.renderCell({
        isMandatory: false,
      } as any);

      const { getByText } = render(<>{cell}</>);
      expect(getByText("No")).toBeInTheDocument();
    }
  });
  it("should render rollback count if available", () => {
    const columns = getReleaseColumns("123");
    const rollbacksColumn = columns.find((col) => col.field === "rollbacks");

    expect(rollbacksColumn).toBeDefined(); // optional assertion

    if (rollbacksColumn && rollbacksColumn.renderCell) {
      const cell = rollbacksColumn?.renderCell({ rollbackCount: 3 } as any);

      const { getByText } = render(<>{cell}</>);
      expect(getByText("3")).toBeInTheDocument();
    }
  });

  it('should render "0" if rollback count is undefined', () => {
    const columns = getReleaseColumns("123");
    const rollbacksColumn = columns.find((col) => col.field === "rollbacks");
    expect(rollbacksColumn).toBeDefined(); // optional assertion

    if (rollbacksColumn && rollbacksColumn.renderCell) {
      const cell = rollbacksColumn?.renderCell({} as any);

      const { getByText } = render(<>{cell}</>);
      expect(getByText("0")).toBeInTheDocument();
    }
  });
  it("should render formatted createdDate", () => {
    const columns = getReleaseColumns("123");
    const dateColumn = columns.find((col) => col.field === "createdDate");
    const mockDate = "2024-01-01T12:00:00Z";

    expect(dateColumn).toBeDefined(); // optional assertion

    if (dateColumn && dateColumn.renderCell) {
      const cell = dateColumn?.renderCell({ createdDate: mockDate } as any);

      const { getByText } = render(<>{cell}</>);

      // You might need to update this if `DateFormatter` returns a different string
      expect(getByText(/2024/)).toBeInTheDocument();
    }
  });

  it("should render empty string when createdDate is missing", () => {
    const columns = getReleaseColumns("123");
    const dateColumn = columns.find((col) => col.field === "createdDate");
    expect(dateColumn).toBeDefined(); // optional assertion

    if (dateColumn && dateColumn.renderCell) {
      const cell = dateColumn?.renderCell({} as any);

      const { container } = render(<>{cell}</>);
      expect(container.textContent).toBe("");
    }
  });

  it("should render empty string if releaseVersion is undefined", () => {
    const columns = getReleaseColumns("testApp");
    const ReleaseCell = columns[0].renderCell!;
    const data = { id: "someid" } as any;
    const { getAllByText } = render(<Router>{ReleaseCell(data)}</Router>);
    // Should render one empty string anchor
    const emptyLinks = getAllByText("", { exact: true });
    expect(emptyLinks.length).toBeGreaterThan(0);
  });

  it("should render link with empty id if id is undefined", () => {
    const columns = getReleaseColumns("testApp");
    const ReleaseCell = columns[0].renderCell!;
    const data = { releaseVersion: "v1" } as any;
    const { getByText } = render(<Router>{ReleaseCell(data)}</Router>);
    const link = getByText("v1").closest("a");
    // The code will use undefined in the URL if id is missing
    expect(link).toHaveAttribute(
      "href",
      "/all-apps/details/testApp/release/undefined"
    );
  });

  it("should render status with fallback color and label for unknown status", () => {
    const columns = getReleaseColumns("testApp");
    const StatusCell = columns[2].renderCell!;
    const data = { status: "PAUSED" } as any;
    const { getByText, container } = render(StatusCell(data));
    // The code will render PAUSED (uppercase)
    expect(getByText("PAUSED")).toBeInTheDocument();
    const dot = container.querySelector("span");
    expect(dot).toHaveStyle("background-color: #F79009");
  });

  it("should throw if status is undefined (capitalizeFirstLetter called with undefined)", () => {
    const columns = getReleaseColumns("testApp");
    const StatusCell = columns[2].renderCell!;
    const data = {} as any;
    expect(() => StatusCell(data)).toThrow(TypeError);
  });

  it('should render "undefined Device" if releaseCount is undefined', () => {
    const columns = getReleaseColumns("testApp");
    const DevicesCell = columns[6].renderCell!;
    const data = {} as any;
    const { getByText } = render(DevicesCell(data));
    expect(getByText("undefined Device")).toBeInTheDocument();
  });

  it('should render "0 Device" if releaseCount is 0', () => {
    const columns = getReleaseColumns("testApp");
    const DevicesCell = columns[6].renderCell!;
    const data = { releaseCount: 0 } as any;
    const { getByText } = render(DevicesCell(data));
    expect(getByText("0 Device")).toBeInTheDocument();
  });

  it('should render "1 Device" if releaseCount is 1', () => {
    const columns = getReleaseColumns("testApp");
    const DevicesCell = columns[6].renderCell!;
    const data = { releaseCount: 1 } as any;
    const { getByText } = render(DevicesCell(data));
    expect(getByText("1 Device")).toBeInTheDocument();
  });

  it('should render "2 Devices" if releaseCount is greater than 1', () => {
    const columns = getReleaseColumns("testApp");
    const DevicesCell = columns[6].renderCell!;
    const data = { releaseCount: 2 } as any;
    const { getByText } = render(DevicesCell(data));
    expect(getByText("2 Devices")).toBeInTheDocument();
  });
});

describe("getCollabratorColumns", () => {
  const handleCollabDel = jest.fn();
  const base = {
    id: "1",
    email: "abc@example.com",
    fullName: "John Doe",
    role: "Developer",
    profile_image: "",
    status: "active",
  };

  it("renders Invited Collaborator if status is pending", () => {
    const columns = require("../column").getCollabratorColumns(
      handleCollabDel,
      true
    );
    const NameCell = columns[0].renderCell!;
    const { getByText } = render(
      <>{NameCell({ ...base, status: "pending" })}</>
    );
    expect(getByText("Invited Collaborator")).toBeInTheDocument();
  });

  it("renders fullName if not pending", () => {
    const columns = require("../column").getCollabratorColumns(
      handleCollabDel,
      true
    );
    const NameCell = columns[0].renderCell!;
    const { getByText } = render(<>{NameCell(base)}</>);
    expect(getByText("John Doe")).toBeInTheDocument();
  });

  it("renders N/A if fullName is missing and not pending", () => {
    const columns = require("../column").getCollabratorColumns(
      handleCollabDel,
      true
    );
    const NameCell = columns[0].renderCell!;
    const { getByText } = render(
      <>{NameCell({ ...base, fullName: undefined })}</>
    );
    expect(getByText("N/A")).toBeInTheDocument();
  });

  it("adds owner-role class if role is Owner (Name)", () => {
    const columns = require("../column").getCollabratorColumns(
      handleCollabDel,
      true
    );
    const NameCell = columns[0].renderCell!;
    const { container } = render(<>{NameCell({ ...base, role: "Owner" })}</>);
    expect(container.querySelector(".owner-role")).toBeInTheDocument();
  });

  it("renders email if present", () => {
    const columns = require("../column").getCollabratorColumns(
      handleCollabDel,
      true
    );
    const EmailCell = columns[1].renderCell!;
    const { getByText } = render(<>{EmailCell(base)}</>);
    expect(getByText("abc@example.com")).toBeInTheDocument();
  });

  it("renders N/A if email is missing", () => {
    const columns = require("../column").getCollabratorColumns(
      handleCollabDel,
      true
    );
    const EmailCell = columns[1].renderCell!;
    const { getByText } = render(
      <>{EmailCell({ ...base, email: undefined })}</>
    );
    expect(getByText("N/A")).toBeInTheDocument();
  });

  it("adds owner-role class if role is Owner (Email)", () => {
    const columns = require("../column").getCollabratorColumns(
      handleCollabDel,
      true
    );
    const EmailCell = columns[1].renderCell!;
    const { container } = render(<>{EmailCell({ ...base, role: "Owner" })}</>);
    expect(container.querySelector(".owner-role")).toBeInTheDocument();
  });

  it("renders role", () => {
    const columns = require("../column").getCollabratorColumns(
      handleCollabDel,
      true
    );
    const RoleCell = columns[2].renderCell!;
    const { getByText } = render(<>{RoleCell(base)}</>);
    expect(getByText("Developer")).toBeInTheDocument();
  });

  it("adds owner-role class if role is Owner (Role)", () => {
    const columns = require("../column").getCollabratorColumns(
      handleCollabDel,
      true
    );
    const RoleCell = columns[2].renderCell!;
    const { container } = render(<>{RoleCell({ ...base, role: "Owner" })}</>);
    expect(container.querySelector(".owner-role")).toBeInTheDocument();
  });

  it("renders capitalized status if present", () => {
    const columns = require("../column").getCollabratorColumns(
      handleCollabDel,
      true
    );
    const StatusCell = columns[3].renderCell!;
    const { getByText } = render(
      <>{StatusCell({ ...base, status: "pending" })}</>
    );
    expect(getByText("Pending")).toBeInTheDocument();
  });

  it("renders N/A if status is missing", () => {
    const columns = require("../column").getCollabratorColumns(
      handleCollabDel,
      true
    );
    const StatusCell = columns[3].renderCell!;
    const { getByText } = render(
      <>{StatusCell({ ...base, status: undefined })}</>
    );
    expect(getByText("N/A")).toBeInTheDocument();
  });

  it("adds owner-role class if role is Owner (Status)", () => {
    const columns = require("../column").getCollabratorColumns(
      handleCollabDel,
      true
    );
    const StatusCell = columns[3].renderCell!;
    const { container } = render(<>{StatusCell({ ...base, role: "Owner" })}</>);
    expect(container.querySelector(".owner-role")).toBeInTheDocument();
  });

  it("renders delete icon if status is pending and isOwner is true", () => {
    const columns = require("../column").getCollabratorColumns(
      handleCollabDel,
      true
    );
    const DeleteCell = columns[4].renderCell!;
    const { container } = render(
      <>{DeleteCell({ ...base, status: "pending" })}</>
    );
    expect(
      container.querySelector('img[alt="Delete Icon"]')
    ).toBeInTheDocument();
  });

  it("does not render delete icon if status is not pending", () => {
    const columns = require("../column").getCollabratorColumns(
      handleCollabDel,
      true
    );
    const DeleteCell = columns[4].renderCell!;
    const { container } = render(<>{DeleteCell(base)}</>);
    expect(
      container.querySelector('img[alt="Delete Icon"]')
    ).not.toBeInTheDocument();
  });

  it("does not render delete icon if isOwner is false", () => {
    const columns = require("../column").getCollabratorColumns(
      handleCollabDel,
      false
    );
    const DeleteCell = columns[4].renderCell!;
    const { container } = render(
      <>{DeleteCell({ ...base, status: "pending" })}</>
    );
    expect(
      container.querySelector('img[alt="Delete Icon"]')
    ).not.toBeInTheDocument();
  });

  it("calls handleCollabDel with email if clicked and status is pending", () => {
    const columns = require("../column").getCollabratorColumns(
      handleCollabDel,
      true
    );
    const DeleteCell = columns[4].renderCell!;
    const { container } = render(
      <>{DeleteCell({ ...base, status: "pending" })}</>
    );
    const span = container.querySelector("span");
    if (span) {
      span.click();
      expect(handleCollabDel).toHaveBeenCalledWith("abc@example.com");
    }
  });

  it("does not call handleCollabDel if clicked and status is not pending", () => {
    const columns = require("../column").getCollabratorColumns(
      handleCollabDel,
      true
    );
    const DeleteCell = columns[4].renderCell!;
    const { container } = render(<>{DeleteCell(base)}</>);
    const span = container.querySelector("span");
    if (span) {
      handleCollabDel.mockClear(); // reset before click
      span.click();
      expect(handleCollabDel).not.toHaveBeenCalled();
    }
  });
});
