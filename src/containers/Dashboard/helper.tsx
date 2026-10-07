import { useCallback, useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { getDataApi } from "src/apis/api";
import { showAlert } from "src/utils/alert";
import { apiRoutes, getErrorMessage } from "src/utils/common/constants/constants";
import { RootReducerType, RootState } from "src/redux/rootReducers";

export type DashboardApp = {
  id: number;
  name: string;
  osType: string;
};

export type DashboardEnvironment = {
  id: number;
  name: string;
  key: string;
};

export type PlatformUsage = {
  apps: number;
  releases: number;
  downloads: number;
};

export type WeeklyReleasePoint = {
  weekStart: string;
  label: string;
  count: number;
};

export type DashboardSummary = {
  totalApps: number;
  iosApps: number;
  androidApps: number;
  totalReleases: number;
  totalDownloads: number;
  byPlatform: {
    ios: PlatformUsage;
    android: PlatformUsage;
  };
  weeklyReleases: WeeklyReleasePoint[];
  serverUrl: string;
  apps: DashboardApp[];
  featuredApp: (DashboardApp & { environments: DashboardEnvironment[] }) | null;
};

type DashboardResponse = {
  success?: boolean;
  data?: DashboardSummary;
};

const emptyPlatform: PlatformUsage = { apps: 0, releases: 0, downloads: 0 };

const emptySummary: DashboardSummary = {
  totalApps: 0,
  iosApps: 0,
  androidApps: 0,
  totalReleases: 0,
  totalDownloads: 0,
  byPlatform: { ios: emptyPlatform, android: emptyPlatform },
  weeklyReleases: [],
  serverUrl: "",
  apps: [],
  featuredApp: null,
};

export const publicServerUrl = (fromApi?: string) =>
  (fromApi || process.env.VITE_BASE_URL || "").replace(/\/$/, "");

export const buildCliSnippet = ({
  serverUrl,
  appName,
  stagingKey,
  osType,
}: {
  serverUrl: string;
  appName: string;
  stagingKey: string;
  osType?: string;
}) => {
  const host = serverUrl || "<your SkipStore API URL>";
  const name = appName || "<app-name>";
  const key = stagingKey || "<staging-deployment-key>";
  const lines = [
    `# Point the CodePush SDK at SkipStore`,
    `# CodePushServerURL = ${host}`,
    `# Deployment key (Staging) = ${key}`,
    ``,
  ];
  const os = (osType || "").toUpperCase();
  if (os === "IOS") {
    lines.push(`code-push release-react ${name} ios -d Staging`);
  } else if (os === "ANDROID") {
    lines.push(`code-push release-react ${name} android -d Staging`);
  } else {
    lines.push(`code-push release-react ${name} android -d Staging`);
    lines.push(`code-push release-react ${name} ios -d Staging`);
  }
  return lines.join("\n");
};

export const useDashboardHelper = () => {
  const accessKey = useSelector(
    (state: RootReducerType) => state.auth.user?.accessKey || ""
  );
  const appsRefresh = useSelector(
    (state: RootState) => state.allApps?.isRefresh
  );
  const [summary, setSummary] = useState<DashboardSummary>(emptySummary);
  const [environments, setEnvironments] = useState<DashboardEnvironment[]>([]);
  const [selectedAppId, setSelectedAppId] = useState<number | "">("");
  const [loading, setLoading] = useState(true);
  const [revealedKeys, setRevealedKeys] = useState<Record<string, boolean>>({});
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const selectedApp = useMemo(
    () => summary.apps.find((app) => app.id === selectedAppId) ?? null,
    [summary.apps, selectedAppId]
  );

  const serverUrl = publicServerUrl(summary.serverUrl);
  const stagingKey =
    environments.find((env) => env.name.toLowerCase() === "staging")?.key ||
    environments[0]?.key ||
    "";
  const cliSnippet = buildCliSnippet({
    serverUrl,
    appName: selectedApp?.name || "",
    stagingKey,
    osType: selectedApp?.osType,
  });

  const loadSummary = useCallback(async () => {
    try {
      setLoading(true);
      const response = (await getDataApi({
        path: apiRoutes.Dashboard,
      })) as DashboardResponse;
      if (response?.success && response.data) {
        const data = response.data;
        setSummary({
          ...emptySummary,
          ...data,
          byPlatform: {
            ios: { ...emptyPlatform, ...data.byPlatform?.ios },
            android: { ...emptyPlatform, ...data.byPlatform?.android },
          },
          weeklyReleases: data.weeklyReleases ?? [],
        });
        const firstId = data.featuredApp?.id ?? data.apps[0]?.id ?? "";
        setSelectedAppId(firstId);
        setEnvironments(data.featuredApp?.environments ?? []);
      }
    } catch (error) {
      showAlert(2, getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadSummary();
  }, [loadSummary, appsRefresh]);

  const handleSelectApp = async (appId: number) => {
    setSelectedAppId(appId);
    if (summary.featuredApp?.id === appId && summary.featuredApp.environments) {
      setEnvironments(summary.featuredApp.environments);
      return;
    }
    try {
      const response = (await getDataApi({
        path: apiRoutes.Environments,
        data: { appId },
      })) as { success?: boolean; data?: DashboardEnvironment[] };
      if (response?.success && Array.isArray(response.data)) {
        setEnvironments(response.data);
      }
    } catch (error) {
      showAlert(2, getErrorMessage(error));
    }
  };

  const copyText = async (value: string, label: string) => {
    if (!value) {
      return;
    }
    try {
      await navigator.clipboard.writeText(value);
      showAlert(1, `${label} copied`);
    } catch {
      showAlert(2, "Could not copy");
    }
  };

  const toggleKey = (id: string) => {
    setRevealedKeys((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return {
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
    openCreateApp: () => setIsCreateOpen(true),
    closeCreateApp: () => setIsCreateOpen(false),
    handleSelectApp,
    copyText,
    toggleKey,
  };
};
