import { PlatformUsage, WeeklyReleasePoint } from "./helper";

type UsageChartsProps = {
  byPlatform: {
    ios: PlatformUsage;
    android: PlatformUsage;
  };
  weeklyReleases: WeeklyReleasePoint[];
};

const platformRows = (byPlatform: UsageChartsProps["byPlatform"]) => [
  {
    label: "Apps",
    ios: byPlatform.ios.apps,
    android: byPlatform.android.apps,
  },
  {
    label: "Releases",
    ios: byPlatform.ios.releases,
    android: byPlatform.android.releases,
  },
  {
    label: "Downloads",
    ios: byPlatform.ios.downloads,
    android: byPlatform.android.downloads,
  },
];

const barPercent = (value: number, max: number) => {
  if (max <= 0) {
    return 0;
  }
  return Math.max((value / max) * 100, value > 0 ? 4 : 0);
};

const UsageCharts = ({ byPlatform, weeklyReleases }: UsageChartsProps) => {
  const rows = platformRows(byPlatform);
  const platformMax = Math.max(
    ...rows.flatMap((row) => [row.ios, row.android]),
    0
  );
  const weekMax = Math.max(...weeklyReleases.map((week) => week.count), 0);

  return (
    <section className="dashboardCharts" aria-label="Usage charts">
      <article className="chartCard">
        <h2>iOS vs Android</h2>
        <p className="chartHint">Apps, releases, and device downloads by OS</p>
        <ul className="chartLegend">
          <li>
            <span className="swatch swatch--ios" /> iOS
          </li>
          <li>
            <span className="swatch swatch--android" /> Android
          </li>
        </ul>
        <div className="groupedBars">
          {rows.map((row) => (
            <div className="groupedRow" key={row.label}>
              <span className="groupedLabel">{row.label}</span>
              <div className="groupedTrack">
                <div
                  className="groupedBar groupedBar--ios"
                  style={{ width: `${barPercent(row.ios, platformMax)}%` }}
                  title={`iOS ${row.ios}`}
                />
                <div
                  className="groupedBar groupedBar--android"
                  style={{ width: `${barPercent(row.android, platformMax)}%` }}
                  title={`Android ${row.android}`}
                />
              </div>
              <span className="groupedValues">
                {row.ios} / {row.android}
              </span>
            </div>
          ))}
        </div>
      </article>

      <article className="chartCard">
        <h2>Releases by week</h2>
        <p className="chartHint">Published in the last 8 weeks</p>
        {weeklyReleases.length === 0 ? (
          <p className="emptyHint">No releases in this window.</p>
        ) : (
          <div
            className="weekChart"
            role="img"
            aria-label="Releases published per week for the last 8 weeks"
          >
            {weeklyReleases.map((week) => (
              <div className="weekCol" key={week.weekStart}>
                <div className="weekTrack">
                  <div
                    className="weekBar"
                    style={{ height: `${barPercent(week.count, weekMax)}%` }}
                    title={`${week.label}: ${week.count} releases`}
                  />
                </div>
                <span className="weekTick">{week.label}</span>
              </div>
            ))}
          </div>
        )}
      </article>
    </section>
  );
};

export default UsageCharts;
