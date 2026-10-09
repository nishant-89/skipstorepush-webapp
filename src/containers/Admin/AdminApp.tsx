import Breadcrumbs from "src/components/common/BreadCrumbs/BreadCrumbs";
import TableComponent from "src/components/common/Table/Table";
import TableDataLoader from "src/components/common/Loader/tableDataLoader";
import NoData from "src/components/common/NoData/NoData";
import { Column } from "src/utils/types/types";
import { formatDateTime } from "src/utils/common/helpers";
import { formatAdminLabel, useAdminAppHelper } from "./helper";
import { AdminAppDetail } from "./types";
import "../AllApps/AllApps.scss";
import "../../scss/table.scss";
import "./admin.scss";

const envColumns: Column<AdminAppDetail["environments"][number]>[] = [
  { field: "name", sorting: false, headerName: "Environment" },
  { field: "key", sorting: false, headerName: "Deployment key" },
  {
    field: "liveVersion",
    sorting: false,
    headerName: "Live version",
    renderCell: (row) => <>{row.liveVersion || "—"}</>,
  },
];

type AdminCollaboratorRow = Omit<
  AdminAppDetail["collaborators"][number],
  "id"
> & {
  id: string | number;
};

const collabColumns: Column<AdminCollaboratorRow>[] = [
  {
    field: "fullName",
    sorting: false,
    headerName: "Person",
    renderCell: (row) => <>{row.fullName || row.email || "—"}</>,
  },
  { field: "email", sorting: false, headerName: "Email" },
  { field: "role", sorting: false, headerName: "Role" },
  { field: "status", sorting: false, headerName: "Status" },
];

const releaseColumns: Column<AdminAppDetail["releases"][number]>[] = [
  { field: "releaseVersion", sorting: false, headerName: "Version" },
  { field: "targetVersion", sorting: false, headerName: "Target" },
  { field: "environmentName", sorting: false, headerName: "Env" },
  {
    field: "status",
    sorting: false,
    headerName: "Status",
    renderCell: (row) => <>{formatAdminLabel(row.status)}</>,
  },
  { field: "rollout", sorting: false, headerName: "Rollout" },
  { field: "releasedByName", sorting: false, headerName: "By" },
  {
    field: "createdDate",
    sorting: false,
    headerName: "Date",
    renderCell: (row) => <>{formatDateTime(row.createdDate) || "—"}</>,
  },
];

const AdminApp = () => {
  const { data, loading } = useAdminAppHelper();
  const collaborators = (data?.collaborators || []).map((row, index) => ({
    ...row,
    id: row.id ?? `pending-${row.email}-${index}`,
  }));

  return (
    <div className="adminPage">
      <Breadcrumbs currentLabel={data?.name} />
      {loading && !data ? (
        <div className="cardBgWrapper">
          <TableDataLoader columns={envColumns} />
        </div>
      ) : !data ? (
        <NoData title="App not found" />
      ) : (
        <>
          <header className="adminDetailHead">
            <h1>{data.name}</h1>
            <span className="ciStatus pending">
              {data.osType === "IOS" ? "iOS" : "Android"}
            </span>
            <span className={`ciStatus ${data.status === "ACTIVE" ? "success" : "pending"}`}>
              {formatAdminLabel(data.status)}
            </span>
          </header>
          <p className="adminMeta">
            Owner {data.owner?.fullName || data.owner?.email || "—"}
            {data.createdDate ? ` · created ${formatDateTime(data.createdDate)}` : ""}
            . Release files and download URLs are not shown.
          </p>

          <section className="cardBgWrapper AllAppsMainWrapper">
            <div className="AllAppsInnerWrapper">
              <h2>Environments</h2>
              <div className="tableSection appTable">
                <div className="adminAccessTableWrapper tableWrapper bgWhite p00">
                  {data.environments.length === 0 ? (
                    <NoData title="No environments" />
                  ) : (
                    <TableComponent
                      tableData={data.environments}
                      columns={envColumns}
                      page={0}
                      rowsPerPage={data.environments.length}
                      onPageChange={() => undefined}
                      onRowsPerPageChange={() => undefined}
                      count={data.environments.length}
                    />
                  )}
                </div>
              </div>
            </div>
          </section>

          <section className="cardBgWrapper AllAppsMainWrapper">
            <div className="AllAppsInnerWrapper">
              <h2>Collaborators</h2>
              <div className="tableSection appTable">
                <div className="adminAccessTableWrapper tableWrapper bgWhite p00">
                  {collaborators.length === 0 ? (
                    <NoData title="No collaborators" />
                  ) : (
                    <TableComponent
                      tableData={collaborators}
                      columns={collabColumns}
                      page={0}
                      rowsPerPage={collaborators.length}
                      onPageChange={() => undefined}
                      onRowsPerPageChange={() => undefined}
                      count={collaborators.length}
                    />
                  )}
                </div>
              </div>
            </div>
          </section>

          <section className="cardBgWrapper AllAppsMainWrapper">
            <div className="AllAppsInnerWrapper">
              <h2>Release metadata</h2>
              <div className="tableSection appTable">
                <div className="adminAccessTableWrapper tableWrapper bgWhite p00">
                  {data.releases.length === 0 ? (
                    <NoData title="No releases" />
                  ) : (
                    <TableComponent
                      tableData={data.releases}
                      columns={releaseColumns}
                      page={0}
                      rowsPerPage={data.releases.length}
                      onPageChange={() => undefined}
                      onRowsPerPageChange={() => undefined}
                      count={data.releases.length}
                    />
                  )}
                </div>
              </div>
            </div>
          </section>
        </>
      )}
    </div>
  );
};

export default AdminApp;
