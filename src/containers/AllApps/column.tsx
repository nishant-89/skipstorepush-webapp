import { Column } from "src/utils/types/types";
import { Link } from "react-router-dom";
import { formatOrdinalDate } from "src/utils/common/helpers";

import { ALL_APPS_RESPONSE_TYPE } from "./types";
import { OsBrandIcon } from "./osIcons";

export const allAppsColumns: Column<ALL_APPS_RESPONSE_TYPE>[] = [
  {
    field: "osType",
    sorting: false,
    headerName: "OS",
    width: 56,
    className: "osCol",
    renderCell: (param: ALL_APPS_RESPONSE_TYPE) => (
      <OsBrandIcon osType={param?.osType} />
    ),
  },
  {
    field: "name",
    sorting: true,
    headerName: "Name",
    renderCell: (param: ALL_APPS_RESPONSE_TYPE) => {
      return (
        <div>
          <Link to={`/all-apps/details/${param?.id}`} className="tableTitle codeLink">
            {param?.name ?? ""}
          </Link>
        </div>
      );
    },
  },
  {
    field: "ownerName",
    sorting: false,
    headerName: "Owner",
    renderCell: (param: ALL_APPS_RESPONSE_TYPE) => (
      <span className="devMeta">{param?.ownerName || "—"}</span>
    ),
  },
  {
    field: "createdDate",
    sorting: false,
    headerName: "Created",
    renderCell: (param: ALL_APPS_RESPONSE_TYPE) => (
      <span className="devTime">{formatOrdinalDate(param?.createdDate) || "—"}</span>
    ),
  },
];
