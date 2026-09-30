import { Link } from "react-router-dom";
import { Column } from "src/utils/types";
import { formatDateTime } from "src/utils/common/helpers";
import {
  canOpenActivityApp,
  formatActivityDetails,
  formatActivityLabel,
  getActivityAppName,
} from "./helper";
import { ActivityItem } from "./types";

export const activityColumns: Column<ActivityItem>[] = [
  {
    field: "appId",
    sorting: false,
    headerName: "App",
    renderCell: (row: ActivityItem) => {
      const appName = getActivityAppName(row);
      if (!appName) {
        return <span>—</span>;
      }
      if (!canOpenActivityApp(row)) {
        return <span className="tableTitle">{appName}</span>;
      }
      return (
        <Link to={`/all-apps/details/${row.appId}`} className="tableTitle codeLink">
          {appName}
        </Link>
      );
    },
  },
  {
    field: "action",
    sorting: false,
    headerName: "Activity",
    renderCell: (row: ActivityItem) => (
      <div className="activityTitleCell">
        <p className="activityTitle">{formatActivityLabel(row.targetType)}</p>
        <p className="activitySubtitle">{formatActivityLabel(row.action)}</p>
      </div>
    ),
  },
  {
    field: "createdDate",
    sorting: false,
    headerName: "Time",
    renderCell: (row: ActivityItem) => (
      <span className="devTime">{formatDateTime(row.createdDate) || "—"}</span>
    ),
  },
  {
    field: "metadata",
    sorting: false,
    headerName: "Details",
    renderCell: (row: ActivityItem) => (
      <span className="devMeta">{formatActivityDetails(row.metadata)}</span>
    ),
  },
  {
    field: "status",
    sorting: false,
    headerName: "Status",
    renderCell: (row: ActivityItem) => {
      const isSuccess = row.status === "SUCCESS";
      return (
        <span
          className={`ciStatus ${isSuccess ? "success" : "failed"}`}
          title={formatActivityLabel(row.status)}
          aria-label={formatActivityLabel(row.status)}
        >
          {isSuccess ? "ok" : "fail"}
        </span>
      );
    },
  },
];
