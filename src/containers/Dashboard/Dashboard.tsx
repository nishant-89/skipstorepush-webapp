import { useNavigate } from "react-router-dom";
import Breadcrumbs from "src/components/common/BreadCrumbs/BreadCrumbs";
import ButtonComp from "src/components/common/Button/Button";
import { CopyIcon } from "src/utils/common/constants/constants";
import { useSelector } from "react-redux";
import { RootState } from "src/redux/rootReducers";
import { osFilterLabel } from "src/containers/AllApps/helper";
import AddAppDrawer from "src/containers/AllApps/components/AddAppDrawer/addAppDrawer";
import { useDashboardHelper } from "./helper";
import UsageCharts from "./UsageCharts";
import "./dashboard.scss";

const maskValue = (value: string, revealed: boolean) => {
  if (!value) {
    return "—";
  }
  if (revealed) {
    return value;
  }
  if (value.length <= 4) {
    return "••••";
  }
  return `${"•".repeat(Math.min(value.length - 4, 24))}${value.slice(-4)}`;
};

const Dashboard = () => {
  const navigate = useNavigate();
  const fullName = useSelector(
    (state: RootState) => state.profile.data?.fullName
  )?.trim();
  const greeting = fullName ? `Hello, ${fullName}` : "Hello";
  const {
    accessKey,
    summary,
    environments,
    selectedAppId,
    selectedApp,
    loading,
    revealedKeys,
    serverUrl,
    cliSnippet,
    isCreateOpen,
    openCreateApp,
    closeCreateApp,
    handleSelectApp,
    copyText,
    toggleKey,
  } = useDashboardHelper();

  return (
    <div className="dashboardPage">
      <Breadcrumbs currentLabel={greeting} />

      <div className="dashboardStats">
        <article className="statCard">
          <p className="statLabel">Apps</p>
          <p className="statValue">{loading ? "—" : summary.totalApps}</p>
          <p className="statHint">
            {summary.iosApps} iOS · {summary.androidApps} Android
          </p>
        </article>
        <article className="statCard">
          <p className="statLabel">Releases</p>
          <p className="statValue">{loading ? "—" : summary.totalReleases}</p>
          <p className="statHint">Across every environment you can access</p>
        </article>
        <article className="statCard">
          <p className="statLabel">Device downloads</p>
          <p className="statValue">{loading ? "—" : summary.totalDownloads}</p>
          <p className="statHint">Install reports from live releases</p>
        </article>
      </div>

      <UsageCharts
        byPlatform={summary.byPlatform}
        weeklyReleases={summary.weeklyReleases}
      />

      <section className="cardBgWrapper dashboardOnboard">
        <div className="onboardHead">
          <div>
            <h2>Get a device on SkipStore</h2>
            <p>
              Point the CodePush SDK at this API, paste a deployment key, then
              ship JS and assets. The platform is free while we finish the
              product — storage is not capped.
            </p>
          </div>
          {selectedApp ? (
            <ButtonComp
              variant="outlined"
              label="Open app"
              onClick={() =>
                navigate(`/all-apps/details/${selectedApp.id}`)
              }
            />
          ) : (
            <ButtonComp
              variant="contained"
              label="Create an app"
              onClick={openCreateApp}
            />
          )}
        </div>

        <div className="onboardGrid">
          <div className="onboardField">
            <span className="fieldLabel">API / CodePush server URL</span>
            <div className="fieldRow">
              <code>{serverUrl || "Set VITE_BASE_URL for this environment"}</code>
              <ButtonComp
                variant="outlined"
                label=""
                isIcon
                icon={CopyIcon}
                disabled={!serverUrl}
                onClick={() => copyText(serverUrl, "Server URL")}
              />
            </div>
          </div>

          <div className="onboardField">
            <span className="fieldLabel">CLI access key</span>
            <div className="fieldRow">
              <code>{maskValue(accessKey, Boolean(revealedKeys.access))}</code>
              <button
                type="button"
                className="textLinkBtn"
                onClick={() => toggleKey("access")}
              >
                {revealedKeys.access ? "Hide" : "Show"}
              </button>
              <ButtonComp
                variant="outlined"
                label=""
                isIcon
                icon={CopyIcon}
                disabled={!accessKey}
                onClick={() => copyText(accessKey, "Access key")}
              />
            </div>
          </div>
        </div>

        {summary.apps.length > 0 ? (
          <div className="onboardField">
            <label className="fieldLabel" htmlFor="dashboard-app">
              App
            </label>
            <select
              id="dashboard-app"
              className="appSelect"
              value={selectedAppId}
              onChange={(event) => handleSelectApp(Number(event.target.value))}
            >
              {summary.apps.map((app) => (
                <option key={app.id} value={app.id}>
                  {app.name} ({osFilterLabel(app.osType)})
                </option>
              ))}
            </select>
          </div>
        ) : null}

        {environments.length > 0 ? (
          <div className="envList">
            {environments.map((env) => (
              <div className="onboardField" key={env.id}>
                <span className="fieldLabel">{env.name} deployment key</span>
                <div className="fieldRow">
                  <code>
                    {maskValue(env.key, Boolean(revealedKeys[`env-${env.id}`]))}
                  </code>
                  <button
                    type="button"
                    className="textLinkBtn"
                    onClick={() => toggleKey(`env-${env.id}`)}
                  >
                    {revealedKeys[`env-${env.id}`] ? "Hide" : "Show"}
                  </button>
                  <ButtonComp
                    variant="outlined"
                    label=""
                    isIcon
                    icon={CopyIcon}
                    onClick={() => copyText(env.key, `${env.name} key`)}
                  />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="emptyHint">
            {summary.apps.length === 0
              ? "Create an app to get Staging and Production keys."
              : "No environments on this app yet."}
          </p>
        )}

        <div className="onboardField">
          <span className="fieldLabel">Release from the CLI</span>
          <pre className="cliBlock">{cliSnippet}</pre>
          <ButtonComp
            variant="contained"
            label="Copy snippet"
            onClick={() => copyText(cliSnippet, "CLI snippet")}
          />
        </div>
      </section>

      <AddAppDrawer
        open={isCreateOpen}
        onClose={closeCreateApp}
        editMode={false}
      />
    </div>
  );
};

export default Dashboard;
