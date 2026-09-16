import { Column } from "src/utils/types";
import { Link } from "react-router-dom";
import { capitalizeFirstLetter, DateFormatter } from "src/utils/common/helpers";
import { COLLABRATOR_RESPONSE_TYPE, RELEASE_RESPONSE_TYPE } from "../../types";
import { TableDeleteIcon } from "src/utils/common/constants";

// release table columns
export const getReleaseColumns = (
  appId: string
): Column<RELEASE_RESPONSE_TYPE>[] => [
  {
    field: "releaseVersion",
    sorting: true,
    headerName: "Releases",
    renderCell: (param: RELEASE_RESPONSE_TYPE) => {
      return (
        <div>
          <Link
            to={`/all-apps/details/${appId}/release/${param?.id}`}
            className="tableTitle"
          >
            {param?.releaseVersion ?? ""}
          </Link>
        </div>
      );
    },
  },
  {
    field: "target_version",
    sorting: false,
    headerName: "Target Version",
  },
  {
    field: "status",
    sorting: false,
    headerName: "Status",
    renderCell: (param: RELEASE_RESPONSE_TYPE) => {
      const statusColor = param.status === "LIVE" ? "#17B26A" : "#F79009";
      return (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            fontFamily: "inter",
          }}
        >
          <span
            style={{
              display: "inline-block",
              width: 8,
              height: 8,
              borderRadius: "50%",
              backgroundColor: statusColor,
              marginRight: 8,
            }}
          ></span>
          {param?.status === "ROLLED_BACK"
            ? capitalizeFirstLetter("Rollback")
            : capitalizeFirstLetter(param?.status)}
        </div>
      );
    },
  },
  {
    field: "isMandatory",
    sorting: false,
    headerName: "Mandatory",
    renderCell: (param: RELEASE_RESPONSE_TYPE) => (
      <span>{param?.isMandatory ? "Yes" : "No"}</span>
    ),
  },
  {
    field: "rollbacks",
    sorting: false,
    headerName: "Rollbacks",
    renderCell: (param: RELEASE_RESPONSE_TYPE) => (
      <span>{param?.rollbackCount ?? "0"}</span>
    ),
  },
  {
    field: "createdDate",
    sorting: false,
    headerName: "Date",
    renderCell: (param: RELEASE_RESPONSE_TYPE) => (
      <DateFormatter date={param?.createdDate || ""} />
    ),
  },
  {
    field: "status",
    sorting: false,
    headerName: "Active Devices",
    renderCell: (param: RELEASE_RESPONSE_TYPE) => (
      <span>{`${param?.releaseCount > 1 ? `${param?.releaseCount} Devices` : `${param?.releaseCount} Device`}`}</span>
    ),
  },
];

// collaborator table columns
export const getCollabratorColumns = (
  handleCollabDel: (id: string) => void,
  isOwner: boolean
) => {
  const columns = [
    {
      field: "fullName",
      sorting: false,
      headerName: "Name",
      renderCell: (param: COLLABRATOR_RESPONSE_TYPE) => (
        <span className={param.role === "Owner" ? "owner-role" : ""}>
          {param.status === "pending"
            ? "Invited Collaborator"
            : (param.fullName ?? "N/A")}
        </span>
      ),
    },
    {
      field: "email",
      sorting: true,
      headerName: "Email",
      renderCell: (param: COLLABRATOR_RESPONSE_TYPE) => (
        <span className={param.role === "Owner" ? "owner-role" : ""}>
          {param.email ?? "N/A"}
        </span>
      ),
    },
    {
      field: "role",
      sorting: false,
      headerName: "Role",
      renderCell: (param: COLLABRATOR_RESPONSE_TYPE) => (
        <span className={param.role === "Owner" ? "owner-role" : ""}>
          {param.role}
        </span>
      ),
    },

    {
      field: "status",
      sorting: false,
      headerName: "Status",
      renderCell: (param: COLLABRATOR_RESPONSE_TYPE) => (
        <span className={param.role === "Owner" ? "owner-role" : ""}>
          {param?.status
            ? param.status.charAt(0).toUpperCase() + param.status.slice(1)
            : "N/A"}
        </span>
      ),
    },

    {
      field: "",
      sorting: false,
      headerName: "",
      renderCell: (param: COLLABRATOR_RESPONSE_TYPE) => (
        <span
          style={{ cursor: "pointer" }}
          onClick={() =>
            param?.status === "pending" && handleCollabDel(param?.email)
          }
        >
          {param.status === "pending" && isOwner && (
            <img src={TableDeleteIcon} alt="Delete Icon" />
          )}
        </span>
      ),
    },
  ];

  return columns;
};
