import { Column } from "src/utils/types";
import { Link } from "react-router-dom";

import { ALL_APPS_RESPONSE_TYPE } from "./types";

export const allAppsColumns: Column<ALL_APPS_RESPONSE_TYPE>[] = [
  {
    field: "name",
    sorting: true,
    headerName: "Name",
    renderCell: (param: ALL_APPS_RESPONSE_TYPE) => {
      return (
        <div>
          <Link to={`/all-apps/details/${param?.id}`} className="tableTitle">
            {param?.name ?? ""}
          </Link>
        </div>
      );
    },
  },
  {
    field: "osType",
    sorting: false,
    headerName: "OS",
    renderCell: (param: ALL_APPS_RESPONSE_TYPE) => {
      return <span>{param?.osType === "IOS" ? "iOS" : "Android"}</span>;
    },
  },
  {
    field: "ownerName",
    sorting: false,
    headerName: "Owner",
  },
];
