import { Link } from "react-router-dom";
import { Column } from "src/utils/types/types";
import { formatDateTime } from "src/utils/common/helpers";
import ROUTES from "src/routes/routesPaths";
import { formatAdminLabel } from "./helper";
import {
  AdminActivityRow,
  AdminAppRow,
  AdminAttentionItem,
  AdminCustomerApp,
  AdminCustomerRow,
} from "./types";

const statusClass = (status?: string) => {
  const value = (status || "").toUpperCase();
  if (value === "SUCCESS" || value === "ACTIVE" || value === "LIVE") {
    return "success";
  }
  if (value === "FAILED" || value === "DELETED" || value === "ROLLED_BACK") {
    return "failed";
  }
  return "pending";
};

export const adminCustomerColumns: Column<AdminCustomerRow>[] = [
  {
    field: "fullName",
    sorting: false,
    headerName: "Customer",
    className: "nameCol",
    renderCell: (row) => (
      <Link
        to={ROUTES.ADMIN_CUSTOMER.replace(":id", String(row.id))}
        className="tableTitle codeLink"
      >
        {row.fullName}
      </Link>
    ),
  },
  {
    field: "email",
    sorting: false,
    headerName: "Email",
    renderCell: (row) => <span className="devMeta">{row.email}</span>,
  },
  {
    field: "authType",
    sorting: false,
    headerName: "Auth",
  },
  {
    field: "status",
    sorting: false,
    headerName: "Status",
    width: 140,
    className: "statusCol",
    renderCell: (row) => (
      <span className={`ciStatus ${statusClass(row.status)}`}>
        {formatAdminLabel(row.status)}
      </span>
    ),
  },
  {
    field: "appCount",
    sorting: false,
    headerName: "Apps",
  },
  {
    field: "createdDate",
    sorting: false,
    headerName: "Joined",
    renderCell: (row) => (
      <span className="devTime">{formatDateTime(row.createdDate) || "—"}</span>
    ),
  },
];

export const adminAppColumns: Column<AdminAppRow>[] = [
  {
    field: "name",
    sorting: false,
    headerName: "App",
    className: "nameCol",
    renderCell: (row) => (
      <Link
        to={ROUTES.ADMIN_APP.replace(":id", String(row.id))}
        className="tableTitle codeLink"
      >
        {row.name}
      </Link>
    ),
  },
  {
    field: "osType",
    sorting: false,
    headerName: "OS",
    renderCell: (row) => (
      <span>{row.osType === "IOS" ? "iOS" : "Android"}</span>
    ),
  },
  {
    field: "ownerName",
    sorting: false,
    headerName: "Owner",
    renderCell: (row) => {
      const label = row.ownerName || row.ownerEmail || "—";
      if (!row.ownerId) {
        return <span className="devMeta">{label}</span>;
      }
      return (
        <Link
          to={ROUTES.ADMIN_CUSTOMER.replace(":id", String(row.ownerId))}
          className="tableTitle codeLink"
        >
          {label}
        </Link>
      );
    },
  },
  {
    field: "collaboratorCount",
    sorting: false,
    headerName: "Collaborators",
  },
  {
    field: "status",
    sorting: false,
    headerName: "Status",
    width: 140,
    className: "statusCol",
    renderCell: (row) => (
      <span className={`ciStatus ${statusClass(row.status)}`}>
        {formatAdminLabel(row.status)}
      </span>
    ),
  },
];

export const adminActivityColumns: Column<AdminActivityRow>[] = [
  {
    field: "createdDate",
    sorting: false,
    headerName: "Time",
    renderCell: (row) => (
      <span className="devTime">{formatDateTime(row.createdDate) || "—"}</span>
    ),
  },
  {
    field: "actor",
    sorting: false,
    headerName: "Actor",
    renderCell: (row) => (
      <span className="devMeta">
        {row.actor?.fullName || row.actor?.email || "—"}
      </span>
    ),
  },
  {
    field: "action",
    sorting: false,
    headerName: "Action",
    renderCell: (row) => (
      <span className="tableTitle">{formatAdminLabel(row.action)}</span>
    ),
  },
  {
    field: "appName",
    sorting: false,
    headerName: "App",
    renderCell: (row) => {
      if (!row.appName && !row.appId) {
        return <span>—</span>;
      }
      if (!row.appId || row.appExists === false) {
        return <span>{row.appName || `App ${row.appId}`}</span>;
      }
      return (
        <Link
          to={ROUTES.ADMIN_APP.replace(":id", String(row.appId))}
          className="tableTitle codeLink"
        >
          {row.appName || `App ${row.appId}`}
        </Link>
      );
    },
  },
  {
    field: "status",
    sorting: false,
    headerName: "Status",
    width: 140,
    className: "statusCol",
    renderCell: (row) => (
      <span className={`ciStatus ${statusClass(row.status)}`}>
        {formatAdminLabel(row.status)}
      </span>
    ),
  },
];

export const adminAttentionColumns: Column<AdminAttentionItem>[] = [
  {
    field: "createdDate",
    sorting: false,
    headerName: "When",
    renderCell: (row) => (
      <span className="devTime">{formatDateTime(row.createdDate) || "—"}</span>
    ),
  },
  {
    field: "actorEmail",
    sorting: false,
    headerName: "Actor",
    renderCell: (row) => (
      <span className="devMeta">{row.actorName || row.actorEmail || "—"}</span>
    ),
  },
  {
    field: "action",
    sorting: false,
    headerName: "Action",
    renderCell: (row) => <>{formatAdminLabel(row.action)}</>,
  },
  {
    field: "appName",
    sorting: false,
    headerName: "App",
    renderCell: (row) => <>{row.appName || "—"}</>,
  },
  {
    field: "status",
    sorting: false,
    headerName: "Status",
    width: 140,
    className: "statusCol",
    renderCell: (row) => (
      <span className={`ciStatus ${statusClass(row.status)}`}>
        {formatAdminLabel(row.status)}
      </span>
    ),
  },
];

export const adminCustomerAppColumns: Column<AdminCustomerApp>[] = [
  {
    field: "name",
    sorting: false,
    headerName: "App",
    renderCell: (row) => (
      <Link
        to={ROUTES.ADMIN_APP.replace(":id", String(row.id))}
        className="tableTitle codeLink"
      >
        {row.name}
      </Link>
    ),
  },
  {
    field: "osType",
    sorting: false,
    headerName: "OS",
    renderCell: (row) => <>{row.osType === "IOS" ? "iOS" : "Android"}</>,
  },
  {
    field: "role",
    sorting: false,
    headerName: "Role",
  },
  {
    field: "envCount",
    sorting: false,
    headerName: "Envs",
  },
];
