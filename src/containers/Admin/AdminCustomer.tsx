import Breadcrumbs from "src/components/common/BreadCrumbs/BreadCrumbs";
import TableComponent from "src/components/common/Table/Table";
import TableDataLoader from "src/components/common/Loader/tableDataLoader";
import NoData from "src/components/common/NoData/NoData";
import { formatDateTime } from "src/utils/common/helpers";
import AdminDateFilters from "./AdminDateFilters";
import AdminTableCard from "./AdminTableCard";
import {
  formatAdminLabel,
  formatAdminRangeLabel,
  useAdminCustomerHelper,
  useClientTable,
} from "./helper";
import { adminActivityColumns, adminCustomerAppColumns } from "./columns";
import "../AllApps/AllApps.scss";
import "../../scss/table.scss";
import "../Dashboard/dashboard.scss";
import "./admin.scss";

const AdminCustomer = () => {
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
    activityPage,
    activityRowsPerPage,
    handleActivityPage,
    handleActivityRows,
  } = useAdminCustomerHelper();
  const apps = useClientTable([
    ...(data?.apps || []),
    ...(data?.collaborations || []),
  ]);
  const breakdown = data?.releaseBreakdown;
  const releaseApps = breakdown?.apps || [];
  const activityCount =
    data?.activityPaging?.total_items ?? data?.recentActivity?.length ?? 0;

  return (
    <div className="adminPage">
      <Breadcrumbs currentLabel={data?.fullName} />
      {loading && !data ? (
        <div className="cardBgWrapper">
          <TableDataLoader columns={adminCustomerAppColumns} />
        </div>
      ) : !data ? (
        <NoData title="Customer not found" />
      ) : (
        <>
          <header className="adminDetailHead">
            <h1>{data.fullName}</h1>
            <span className={`ciStatus ${data.status === "ACTIVE" ? "success" : "pending"}`}>
              {formatAdminLabel(data.status)}
            </span>
            <span className="ciStatus pending">{data.authType}</span>
          </header>
          <p className="adminMeta">
            {data.email}
            {data.createdDate
              ? ` · customer since ${formatDateTime(data.createdDate)}`
              : ""}
          </p>

          <div className="adminStats dashboardStats adminCustomerStats">
            <div className="statCard">
              <p className="statLabel">Owned apps</p>
              <p className="statValue">{data.apps?.length || 0}</p>
            </div>
            <div className="statCard">
              <p className="statLabel">Collaborations</p>
              <p className="statValue">{data.collaborations?.length || 0}</p>
            </div>
            <div className="statCard">
              <p className="statLabel">Access keys</p>
              <p className="statValue">{data.accessKeys?.length || 0}</p>
              <p className="statHint">Masked</p>
            </div>
          </div>

          <article
            className="cardBgWrapper adminReleaseCard"
            aria-label="Releases"
            aria-busy={releasesLoading}
          >
            <div className="adminTableHead">
              <h2>
                Releases
                <span className="adminCardCount">{breakdown?.total ?? 0}</span>
              </h2>
            </div>
            <p className="adminHint">
              Per app, all environments, owned and collaborated
            </p>
            <div className="adminFilterBar">
              <AdminDateFilters
                preset={preset}
                from={from}
                to={to}
                onPreset={setPreset}
                onFrom={setFrom}
                onTo={setTo}
                label="Release date range"
                hint={formatAdminRangeLabel(breakdown?.range)}
              />
            </div>
            {releaseApps.length === 0 ? (
              <p className="adminHint">No apps</p>
            ) : (
              <ul className="adminBreakdown">
                {releaseApps.map((app) => (
                  <li key={app.id}>
                    <span>{app.name}</span>
                    <span className="adminCardCount">{app.count}</span>
                  </li>
                ))}
              </ul>
            )}
          </article>

          <AdminTableCard title="Apps" count={apps.count}>
            {apps.count === 0 ? (
              <NoData title="No apps" />
            ) : (
              <TableComponent
                tableData={apps.pageRows}
                columns={adminCustomerAppColumns}
                page={apps.page}
                rowsPerPage={apps.rowsPerPage}
                onPageChange={apps.onPageChange}
                onRowsPerPageChange={apps.onRowsPerPageChange}
                count={apps.count}
              />
            )}
          </AdminTableCard>

          <section className="cardBgWrapper AllAppsMainWrapper">
            <div className="AllAppsInnerWrapper">
              <h2>Access keys</h2>
              <p className="adminHint">Secrets are never shown.</p>
              <ul className="adminHint">
                {(data.accessKeys || []).map((key) => (
                  <li key={key.id}>
                    {key.friendlyName} · {key.accessKeyId}
                    {key.isSession ? " · session" : ""}
                  </li>
                ))}
                {!data.accessKeys?.length ? <li>None</li> : null}
              </ul>
            </div>
          </section>

          <AdminTableCard title="Recent activity" count={activityCount}>
            {activityCount === 0 ? (
              <NoData title="No activity" />
            ) : (
              <TableComponent
                tableData={data.recentActivity}
                columns={adminActivityColumns}
                page={activityPage}
                rowsPerPage={activityRowsPerPage}
                onPageChange={handleActivityPage}
                onRowsPerPageChange={handleActivityRows}
                count={activityCount}
              />
            )}
          </AdminTableCard>
        </>
      )}
    </div>
  );
};

export default AdminCustomer;
