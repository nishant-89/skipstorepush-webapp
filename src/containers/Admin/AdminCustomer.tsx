import Breadcrumbs from "src/components/common/BreadCrumbs/BreadCrumbs";
import TableComponent from "src/components/common/Table/Table";
import TableDataLoader from "src/components/common/Loader/tableDataLoader";
import NoData from "src/components/common/NoData/NoData";
import { formatDateTime } from "src/utils/common/helpers";
import { useAdminCustomerHelper, formatAdminLabel } from "./helper";
import { adminActivityColumns, adminCustomerAppColumns } from "./columns";
import "../AllApps/AllApps.scss";
import "../../scss/table.scss";
import "../Dashboard/dashboard.scss";
import "./admin.scss";

const AdminCustomer = () => {
  const { data, loading } = useAdminCustomerHelper();
  const apps = [...(data?.apps || []), ...(data?.collaborations || [])];

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

          <div className="adminStats dashboardStats">
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

          <section className="cardBgWrapper AllAppsMainWrapper">
            <div className="AllAppsInnerWrapper">
              <h2>Apps</h2>
              <div className="tableSection appTable">
                <div className="adminAccessTableWrapper tableWrapper bgWhite p00">
                  {apps.length === 0 ? (
                    <NoData title="No apps" />
                  ) : (
                    <TableComponent
                      tableData={apps}
                      columns={adminCustomerAppColumns}
                      page={0}
                      rowsPerPage={apps.length}
                      onPageChange={() => undefined}
                      onRowsPerPageChange={() => undefined}
                      count={apps.length}
                    />
                  )}
                </div>
              </div>
            </div>
          </section>

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

          <section className="cardBgWrapper AllAppsMainWrapper">
            <div className="AllAppsInnerWrapper">
              <h2>Recent activity</h2>
              <div className="tableSection appTable">
                <div className="adminAccessTableWrapper tableWrapper bgWhite p00">
                  {!data.recentActivity?.length ? (
                    <NoData title="No activity" />
                  ) : (
                    <TableComponent
                      tableData={data.recentActivity}
                      columns={adminActivityColumns}
                      page={0}
                      rowsPerPage={data.recentActivity.length}
                      onPageChange={() => undefined}
                      onRowsPerPageChange={() => undefined}
                      count={data.recentActivity.length}
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

export default AdminCustomer;
