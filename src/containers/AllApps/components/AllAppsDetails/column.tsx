import { Column } from "src/utils/types/types";
import { Link } from "react-router-dom";
import { capitalizeFirstLetter, DateFormatter } from "src/utils/common/helpers";
import { COLLABRATOR_RESPONSE_TYPE, RELEASE_RESPONSE_TYPE } from "../../types";
import { TableDeleteIcon } from "src/utils/common/constants/constants";
import ROUTES from "src/routes/routesPaths";

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
            className="tableTitle codeLink"
          >
            {param?.releaseVersion ?? ""}
          </Link>
        </div>
      );
    },
  },
  {
    field: "targetVersion",
    sorting: false,
    headerName: "Target Version",
  },
  {
    field: "status",
    sorting: false,
    headerName: "Status",
    width: 140,
    className: "statusCol",
    renderCell: (param: RELEASE_RESPONSE_TYPE) => {
      const statusColor =
        param.status === "LIVE"
          ? "success"
          : param.status === "ROLLED_BACK"
            ? "failed"
            : "pending";
      const label =
        param?.status === "ROLLED_BACK"
          ? capitalizeFirstLetter("Rollback")
          : capitalizeFirstLetter(param?.status);
      return <span className={`ciStatus ${statusColor}`}>{label}</span>;
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

const MEMBER_STATUSES = new Set(["accepted", "active", "activated"]);

export const canOwnerRemoveCollaborator = (
  collaborator: COLLABRATOR_RESPONSE_TYPE,
  isOwner: boolean
) => {
  if (!isOwner || collaborator.role === "Owner") {
    return false;
  }
  const status = collaborator.status?.toLowerCase();
  return status === "pending" || (!!status && MEMBER_STATUSES.has(status));
};

export const collaboratorProfilePath = (
  collaborator: COLLABRATOR_RESPONSE_TYPE,
  currentUserId?: string | number | null
) => {
  const status = collaborator.status?.toLowerCase();
  if (!collaborator.id || status === "pending") {
    return null;
  }
  if (!status || !MEMBER_STATUSES.has(status)) {
    return null;
  }
  if (
    currentUserId != null &&
    String(collaborator.id) === String(currentUserId)
  ) {
    return ROUTES.MY_ACCOUNT;
  }
  return `/users/${collaborator.id}`;
};

// collaborator table columns
export const getCollabratorColumns = (
  handleCollabDel: (collaborator: COLLABRATOR_RESPONSE_TYPE) => void,
  isOwner: boolean,
  currentUserId?: string | number | null
) => {
  const columns = [
    {
      field: "fullName",
      sorting: false,
      headerName: "Name",
      renderCell: (param: COLLABRATOR_RESPONSE_TYPE) => {
        const isPending = param.status?.toLowerCase() === "pending";
        const label = isPending
          ? "Invited Collaborator"
          : (param.fullName ?? "N/A");
        const className =
          param.role === "Owner" ? "owner-role tableTitle" : "tableTitle";
        const href = collaboratorProfilePath(param, currentUserId);
        if (href) {
          return (
            <Link
              to={href}
              state={{
                id: param.id,
                fullName: param.fullName,
                email: param.email,
                profileImage: param.profileImage || param.profile_image,
              }}
              className={`${className} codeLink`}
            >
              {label}
            </Link>
          );
        }
        return <span className={className}>{label}</span>;
      },
    },
    {
      field: "email",
      sorting: true,
      headerName: "Email",
      renderCell: (param: COLLABRATOR_RESPONSE_TYPE) => (
        <span className={param.role === "Owner" ? "owner-role devMeta" : "devMeta"}>
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
      width: 140,
      className: "statusCol",
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
      renderCell: (param: COLLABRATOR_RESPONSE_TYPE) => {
        const canRemove = canOwnerRemoveCollaborator(param, isOwner);
        return (
          <span
            style={{ cursor: canRemove ? "pointer" : "default" }}
            onClick={() => canRemove && handleCollabDel(param)}
          >
            {canRemove && <img src={TableDeleteIcon} alt="Delete Icon" />}
          </span>
        );
      },
    },
  ];

  return columns;
};
