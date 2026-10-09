import Breadcrumbs from "src/components/common/BreadCrumbs/BreadCrumbs";
import TableComponent from "src/components/common/Table/Table";
import TableDataLoader from "src/components/common/Loader/tableDataLoader";
import NoData from "src/components/common/NoData/NoData";
import { Column } from "src/utils/types/types";
import { formatDateTime } from "src/utils/common/helpers";
import AdminDateFilters from "./AdminDateFilters";
import AdminTableCard from "./AdminTableCard";
import {
  formatAdminLabel,
  formatAdminRangeLabel,
  useAdminAppHelper,
  useClientTable,
} from "./helper";
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
  const {
    data,
    loading,
    releasesLoading,
    preset,
    from,
    to,
    setPreset,
    setFrom,
    setTo,
    releasePage,
    releaseRowsPerPage,
    handleReleasePage,
    handleReleaseRows,
  } = useAdminAppHelper();
  const collaborators = useClientTable(
    (data?.collaborators || []).map((row, index) => ({
      ...row,
      id: row.id ?? `pending-${row.email}-${index}`,
    }))
  );
  const environments = useClientTable(data?.environments || []);
  const environmentCount =
    data?.counts?.environments ?? environments.count;
  const collaboratorCount =
    data?.counts?.collaborators ?? collaborators.count;
  const releaseCount = data?.counts?.releases ?? data?.releases.length ?? 0;

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

          <AdminTableCard title="Environments" count={environmentCount}>
            {environments.count === 0 ? (
              <NoData title="No environments" />
            ) : (
              <TableComponent
                tableData={environments.pageRows}
                columns={envColumns}
                page={environments.page}
                rowsPerPage={environments.rowsPerPage}
                onPageChange={environments.onPageChange}
                onRowsPerPageChange={environments.onRowsPerPageChange}
                count={environments.count}
              />
            )}
          </AdminTableCard>

          <AdminTableCard title="Collaborators" count={collaboratorCount}>
            {collaborators.count === 0 ? (
              <NoData title="No collaborators" />
            ) : (
              <TableComponent
                tableData={collaborators.pageRows}
                columns={collabColumns}
                page={collaborators.page}
                rowsPerPage={collaborators.rowsPerPage}
                onPageChange={collaborators.onPageChange}
                onRowsPerPageChange={collaborators.onRowsPerPageChange}
                count={collaborators.count}
              />
            )}
          </AdminTableCard>

          <AdminTableCard
            title="Release metadata"
            count={releaseCount}
            busy={releasesLoading}
            toolbar={
              <AdminDateFilters
                preset={preset}
                from={from}
                to={to}
                onPreset={setPreset}
                onFrom={setFrom}
                onTo={setTo}
                label="Release metadata date range"
                hint={formatAdminRangeLabel(data.releaseRange)}
              />
            }
          >
            {releaseCount === 0 ? (
              <NoData title="No releases" />
            ) : (
              <TableComponent
                tableData={data.releases}
                columns={releaseColumns}
                page={releasePage}
                rowsPerPage={releaseRowsPerPage}
                onPageChange={handleReleasePage}
                onRowsPerPageChange={handleReleaseRows}
                count={releaseCount}
              />
            )}
          </AdminTableCard>
        </>
      )}
    </div>
  );
};

export default AdminApp;
