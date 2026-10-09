import Breadcrumbs from "src/components/common/BreadCrumbs/BreadCrumbs";
import TableComponent from "src/components/common/Table/Table";
import TableDataLoader from "src/components/common/Loader/tableDataLoader";
import NoData from "src/components/common/NoData/NoData";
import { useAdminOverviewHelper } from "./helper";
import { adminAttentionColumns } from "./columns";
import {
  AdminActionsDay,
  AdminDatePreset,
  AdminDayPoint,
  AdminDaySeries,
  AdminOverviewData,
} from "./types";
import "../AllApps/AllApps.scss";
import "../../scss/table.scss";
import "../Dashboard/dashboard.scss";
import "./admin.scss";

const MIX_ORDER = ["App", "Release", "Collab", "Env", "Other"] as const;

const PRESETS: { id: AdminDatePreset; label: string }[] = [
  { id: "today", label: "Today" },
  { id: "yesterday", label: "Yesterday" },
  { id: "last_7_days", label: "Last 7 days" },
  { id: "this_month", label: "This month" },
  { id: "last_month", label: "Last month" },
  { id: "custom", label: "Custom" },
];

const RANGE_KPIS: {
  key: keyof AdminOverviewData;
  label: string;
  hint: string;
  tone?: "fail";
}[] = [
  { key: "customersRegistered", label: "Customers registered", hint: "New customer accounts" },
  { key: "appsCreated", label: "Apps created", hint: "Created in this range" },
  { key: "iosApps", label: "iOS apps", hint: "Created in this range" },
  { key: "androidApps", label: "Android apps", hint: "Created in this range" },
  { key: "releases", label: "Releases", hint: "Published in this range" },
  { key: "environments", label: "Environments", hint: "Deployment targets created" },
  { key: "invites", label: "Invites", hint: "Collaborator invitations" },
  { key: "actions", label: "Actions", hint: "Product activity" },
  { key: "failedActions", label: "Failed actions", hint: "Unsuccessful product activity", tone: "fail" },
  { key: "rollbacks", label: "Rollbacks", hint: "Releases rolled back" },
  { key: "promotions", label: "Promotions", hint: "Releases promoted" },
  { key: "pauses", label: "Pauses", hint: "Releases paused" },
  { key: "resumes", label: "Resumes", hint: "Releases resumed" },
  { key: "actors", label: "Active in range", hint: "Customers with product activity" },
];

const barHeight = (count: number, max: number) => {
  if (max <= 0 || count <= 0) {
    return 0;
  }
  return Math.max((count / max) * 100, 8);
};

const tickLabel = (date: string, total: number) => {
  const day = Number(date.slice(8, 10));
  const month = Number(date.slice(5, 7));
  if (total > 16 && day !== 1 && day % 5 !== 0) {
    return "";
  }
  return `${month}/${day}`;
};

const DayChart = ({
  days,
  label,
  tone = "ok",
}: {
  days: AdminDayPoint[];
  label: string;
  tone?: "ok" | "fail";
}) => {
  const max = Math.max(...days.map((point) => point.count), 0);
  return (
    <div
      className="adminDayChart"
      role="img"
      aria-label={`${label} per day`}
    >
      {days.map((point) => (
        <div className="adminDayCol" key={point.date}>
          <div className="adminDayTrack">
            <span
              className={`adminDayBar${tone === "fail" ? " isFail" : ""}`}
              style={{ height: `${barHeight(point.count, max)}%` }}
              title={`${point.date}: ${point.count}`}
            />
          </div>
          <span className="adminDayTick">{tickLabel(point.date, days.length)}</span>
        </div>
      ))}
    </div>
  );
};

const StackedDayChart = ({ days }: { days: AdminActionsDay[] }) => {
  const max = Math.max(
    ...days.map(
      (point) =>
        point.App + point.Release + point.Collab + point.Env + point.Other
    ),
    0
  );
  return (
    <div className="adminDayChart" role="img" aria-label="Actions by type per day">
      {days.map((point) => (
        <div className="adminDayCol" key={point.date}>
          <div className="adminDayTrack isStack">
            {MIX_ORDER.map((key) => (
              <span
                key={key}
                className={`adminStack adminStack--${key.toLowerCase()}`}
                style={{ height: `${barHeight(point[key] || 0, max)}%` }}
                title={`${point.date} ${key}: ${point[key] || 0}`}
              />
            ))}
          </div>
          <span className="adminDayTick">{tickLabel(point.date, days.length)}</span>
        </div>
      ))}
    </div>
  );
};

const AdminOverview = () => {
  const {
    data,
    loading,
    activityLoading,
    preset,
    from,
    to,
    setPreset,
    setFrom,
    setTo,
    page,
    rowsPerPage,
    handleChangePage,
    handleChangeRowsPerPage,
  } = useAdminOverviewHelper();
  const mix = data?.actionsByType || {};
  const mixTotal = MIX_ORDER.reduce((sum, key) => {
    const row = mix[key];
    return sum + (row?.successful || 0) + (row?.failed || 0);
  }, 0);
  const rangeLabel = data?.range
    ? `${data.range.from} – ${data.range.to}`
    : "Last 7 days";

  return (
    <div className="adminPage dashboardPage">
      <Breadcrumbs />
      <p className="adminHint">Read-only view of customers, apps, and product activity.</p>

      <div className="adminStats dashboardStats adminSnapshot">
        <div className="statCard">
          <p className="statLabel">Customers</p>
          <p className="statValue">{loading ? "—" : data?.customersActive ?? 0}</p>
          <p className="statHint">Active customer accounts</p>
        </div>
        <div className="statCard">
          <p className="statLabel">Apps</p>
          <p className="statValue">{loading ? "—" : data?.apps ?? 0}</p>
          <p className="statHint">Across all customers</p>
        </div>
      </div>

      <div className="adminFilters">
        <div className="adminPresets" role="group" aria-label="Date range">
          {PRESETS.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`adminPreset${preset === item.id ? " isActive" : ""}`}
              aria-pressed={preset === item.id}
              onClick={() => setPreset(item.id)}
            >
              {item.label}
            </button>
          ))}
        </div>
        {preset === "custom" ? (
          <div className="adminCustomRange">
            <label>
              From
              <input
                type="date"
                value={from}
                max={to || undefined}
                onChange={(event) => setFrom(event.target.value)}
              />
            </label>
            <label>
              To
              <input
                type="date"
                value={to}
                min={from || undefined}
                onChange={(event) => setTo(event.target.value)}
              />
            </label>
          </div>
        ) : null}
        <p className="adminHint">{rangeLabel}</p>
      </div>

      <div className="adminKpiGrid">
        {RANGE_KPIS.map((kpi) => {
          const series = data?.[kpi.key] as AdminDaySeries | undefined;
          const days = series?.days || [];
          return (
            <article className="statCard adminKpi" key={kpi.key}>
              <p className="statLabel">{kpi.label}</p>
              <p className="statValue">{loading ? "—" : series?.total ?? 0}</p>
              <p className="statHint">{kpi.hint}</p>
              {days.length ? (
                <DayChart days={days} label={kpi.label} tone={kpi.tone} />
              ) : (
                <p className="adminHint">No daily counts yet</p>
              )}
            </article>
          );
        })}
      </div>

      <section className="cardBgWrapper adminSection">
        <h2>Actions by type</h2>
        <p className="adminHint">{rangeLabel}. Each bar is one day, stacked by type.</p>
        <ul className="adminLegend">
          {MIX_ORDER.map((key) => (
            <li key={key}>
              <span className={`adminStack adminStack--${key.toLowerCase()}`} />
              {key}
            </li>
          ))}
        </ul>
        {data?.actionsByDay?.length ? (
          <StackedDayChart days={data.actionsByDay} />
        ) : (
          <p className="adminHint">No actions in this range</p>
        )}
        <div className="adminMix">
          {MIX_ORDER.map((key) => {
            const row = mix[key] || { successful: 0, failed: 0 };
            const total = row.successful + row.failed;
            const okPct = mixTotal ? (row.successful / mixTotal) * 100 : 0;
            const failPct = mixTotal ? (row.failed / mixTotal) * 100 : 0;
            return (
              <div className="adminMixRow" key={key}>
                <span className="statLabel">{key}</span>
                <div className="adminMixTrack" aria-hidden>
                  <span className="adminMixOk" style={{ width: `${okPct}%` }} />
                  <span className="adminMixFail" style={{ width: `${failPct}%` }} />
                </div>
                <span className="devMeta">{total}</span>
              </div>
            );
          })}
        </div>
      </section>

      <section className="cardBgWrapper AllAppsMainWrapper">
        <div className="AllAppsInnerWrapper">
          <h2>Recent activity</h2>
          <div className="tableSection appTable">
            <div className="adminAccessTableWrapper tableWrapper bgWhite p00">
              {loading || activityLoading ? (
                <TableDataLoader columns={adminAttentionColumns} />
              ) : !data?.attention?.list?.length ? (
                <NoData title="No activity in this range" />
              ) : (
                <TableComponent
                  tableData={data.attention.list}
                  columns={adminAttentionColumns}
                  page={page}
                  rowsPerPage={rowsPerPage}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                  count={data.attention.total_items}
                />
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AdminOverview;
