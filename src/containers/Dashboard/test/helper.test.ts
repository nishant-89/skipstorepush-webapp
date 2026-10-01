import { act, renderHook, waitFor } from "@testing-library/react";
import * as api from "src/apis/api";
import { showAlert } from "src/utils/alert";
import { apiRoutes } from "src/utils/common/constants/constants";
import { buildCliSnippet, publicServerUrl, useDashboardHelper } from "../helper";

jest.mock("react-redux", () => ({
  useSelector: (selector: (state: unknown) => unknown) =>
    selector({
      auth: { user: { accessKey: "ak-secret" } },
      allApps: { isRefresh: false },
    }),
}));

jest.mock("src/apis/api", () => ({
  getDataApi: jest.fn(),
}));

jest.mock("src/utils/alert", () => ({
  showAlert: jest.fn(),
}));

const summaryPayload = {
  totalApps: 2,
  iosApps: 1,
  androidApps: 1,
  totalReleases: 4,
  totalDownloads: 90,
  byPlatform: {
    ios: { apps: 1, releases: 2, downloads: 40 },
    android: { apps: 1, releases: 2, downloads: 50 },
  },
  weeklyReleases: [{ weekStart: "2026-09-28", label: "Sep 28", count: 2 }],
  serverUrl: "https://api.skipstorepush.com/",
  apps: [
    { id: 11, name: "Food", osType: "IOS" },
    { id: 22, name: "Retail", osType: "ANDROID" },
  ],
  featuredApp: {
    id: 11,
    name: "Food",
    osType: "IOS",
    environments: [
      { id: 1, name: "Staging", key: "stg-key" },
      { id: 2, name: "Production", key: "prd-key" },
    ],
  },
};

describe("dashboard helper", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    Object.assign(navigator, {
      clipboard: { writeText: jest.fn().mockResolvedValue(undefined) },
    });
  });

  it("strips a trailing slash from the public server URL", () => {
    expect(publicServerUrl("https://api.skipstorepush.com/")).toBe(
      "https://api.skipstorepush.com"
    );
  });

  it("builds a CodePush release snippet with placeholders when keys are missing", () => {
    const snippet = buildCliSnippet({
      serverUrl: "",
      appName: "",
      stagingKey: "",
    });
    expect(snippet).toContain(
      "code-push release-react <app-name> android -d Staging"
    );
    expect(snippet).toContain(
      "code-push release-react <app-name> ios -d Staging"
    );
  });

  it("builds a single-platform snippet for the selected OS", () => {
    expect(
      buildCliSnippet({
        serverUrl: "https://api.skipstorepush.com",
        appName: "Food",
        stagingKey: "stg",
        osType: "IOS",
      })
    ).toBe(
      [
        "# Point the CodePush SDK at SkipStore",
        "# CodePushServerURL = https://api.skipstorepush.com",
        "# Deployment key (Staging) = stg",
        "",
        "code-push release-react Food ios -d Staging",
      ].join("\n")
    );
  });

  it("loads summary, CLI snippet, and featured environments", async () => {
    (api.getDataApi as jest.Mock).mockResolvedValue({
      success: true,
      data: summaryPayload,
    });

    const { result } = renderHook(() => useDashboardHelper());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(api.getDataApi).toHaveBeenCalledWith({
      path: apiRoutes.Dashboard,
    });
    expect(result.current.summary.totalDownloads).toBe(90);
    expect(result.current.serverUrl).toBe("https://api.skipstorepush.com");
    expect(result.current.environments).toHaveLength(2);
    expect(result.current.cliSnippet).toContain(
      "code-push release-react Food ios -d Staging"
    );
    expect(result.current.cliSnippet).not.toContain(" android ");
    expect(result.current.summary.byPlatform.ios.downloads).toBe(40);
    expect(result.current.summary.weeklyReleases[0].count).toBe(2);
    expect(result.current.accessKey).toBe("ak-secret");
  });

  it("reuses featured environments when selecting that app", async () => {
    (api.getDataApi as jest.Mock).mockResolvedValue({
      success: true,
      data: summaryPayload,
    });

    const { result } = renderHook(() => useDashboardHelper());
    await waitFor(() => expect(result.current.loading).toBe(false));

    await act(async () => {
      await result.current.handleSelectApp(11);
    });

    expect(api.getDataApi).toHaveBeenCalledTimes(1);
  });

  it("fetches environments when switching to another app", async () => {
    (api.getDataApi as jest.Mock)
      .mockResolvedValueOnce({ success: true, data: summaryPayload })
      .mockResolvedValueOnce({
        success: true,
        data: [{ id: 9, name: "Staging", key: "retail-stg" }],
      });

    const { result } = renderHook(() => useDashboardHelper());
    await waitFor(() => expect(result.current.loading).toBe(false));

    await act(async () => {
      await result.current.handleSelectApp(22);
    });

    expect(api.getDataApi).toHaveBeenLastCalledWith({
      path: apiRoutes.Environments,
      data: { appId: 22 },
    });
    expect(result.current.environments[0].key).toBe("retail-stg");
    expect(result.current.cliSnippet).toContain(
      "code-push release-react Retail android -d Staging"
    );
    expect(result.current.cliSnippet).not.toContain(" ios ");
  });

  it("copies text and toggles key visibility", async () => {
    (api.getDataApi as jest.Mock).mockResolvedValue({
      success: true,
      data: summaryPayload,
    });

    const { result } = renderHook(() => useDashboardHelper());
    await waitFor(() => expect(result.current.loading).toBe(false));

    await act(async () => {
      await result.current.copyText("stg-key", "Staging key");
    });
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith("stg-key");
    expect(showAlert).toHaveBeenCalledWith(1, "Staging key copied");

    act(() => {
      result.current.toggleKey("access");
    });
    expect(result.current.revealedKeys.access).toBe(true);
  });

  it("alerts when the dashboard request fails", async () => {
    (api.getDataApi as jest.Mock).mockRejectedValue(new Error("down"));

    const { result } = renderHook(() => useDashboardHelper());
    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(showAlert).toHaveBeenCalled();
  });
});
