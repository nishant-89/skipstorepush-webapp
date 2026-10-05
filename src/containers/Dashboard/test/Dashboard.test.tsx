import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import Dashboard from "../Dashboard";
import { useDashboardHelper } from "../helper";

const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

jest.mock("react-redux", () => ({
  useSelector: (selector: (state: unknown) => unknown) =>
    selector({
      profile: { data: { fullName: "Ada Lovelace" } },
    }),
}));

jest.mock("src/components/common/BreadCrumbs/BreadCrumbs", () => ({
  __esModule: true,
  default: ({ currentLabel }: { currentLabel?: string }) => (
    <nav aria-label="breadcrumb">{currentLabel}</nav>
  ),
}));

jest.mock("src/containers/AllApps/components/AddAppDrawer/addAppDrawer", () => ({
  __esModule: true,
  default: ({ open }: { open: boolean }) =>
    open ? <div>Add New App</div> : null,
}));

jest.mock("../helper", () => ({
  useDashboardHelper: jest.fn(),
}));

const helperBase = {
  accessKey: "ak-secret",
  summary: {
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
    serverUrl: "https://api.skipstorepush.com",
    apps: [
      { id: 11, name: "Food", osType: "IOS" },
      { id: 22, name: "Retail", osType: "ANDROID" },
    ],
    featuredApp: null,
  },
  environments: [
    { id: 1, name: "Staging", key: "stg-key-1234" },
    { id: 2, name: "Production", key: "prd-key-5678" },
  ],
  selectedAppId: 11,
  selectedApp: { id: 11, name: "Food", osType: "IOS" },
  loading: false,
  revealedKeys: {},
  serverUrl: "https://api.skipstorepush.com",
  cliSnippet: "code-push release-react Food ios -d Staging",
  isCreateOpen: false,
  openCreateApp: jest.fn(),
  closeCreateApp: jest.fn(),
  handleSelectApp: jest.fn(),
  copyText: jest.fn(),
  toggleKey: jest.fn(),
};

describe("Dashboard", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useDashboardHelper as jest.Mock).mockReturnValue(helperBase);
  });

  it("greets the signed-in user instead of Dashboard", () => {
    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );
    expect(screen.getByLabelText("breadcrumb")).toHaveTextContent(
      "Hello, Ada Lovelace"
    );
  });

  it("shows usage stats, charts, onboarding keys, and free-platform copy", () => {
    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );
    expect(screen.getByText("Device downloads")).toBeInTheDocument();
    expect(screen.getByText("90")).toBeInTheDocument();
    expect(screen.getByLabelText("Usage charts")).toBeInTheDocument();
    expect(screen.getByText("Get a device on SkipStore")).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "public docs" })
    ).toHaveAttribute("href", "https://skipstorepush.tech/docs");
    expect(screen.getByText("https://api.skipstorepush.com")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Open app" })).toBeInTheDocument();
    expect(screen.getByLabelText("App")).toBeInTheDocument();
    expect(screen.getByText("Food (iOS)")).toBeInTheDocument();
  });

  it("lets the user pick another app from the styled dropdown", async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );

    await user.click(screen.getByLabelText("App"));
    await user.click(await screen.findByRole("option", { name: "Retail (Android)" }));
    expect(helperBase.handleSelectApp).toHaveBeenCalledWith(22);
  });

  it("opens the selected app and copies the CLI snippet", async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );

    await user.click(screen.getByRole("button", { name: "Open app" }));
    expect(mockNavigate).toHaveBeenCalledWith("/all-apps/details/11");

    await user.click(screen.getByRole("button", { name: "Copy snippet" }));
    expect(helperBase.copyText).toHaveBeenCalledWith(
      helperBase.cliSnippet,
      "CLI snippet"
    );
  });

  it("opens the add-app drawer from Create an app", async () => {
    (useDashboardHelper as jest.Mock).mockReturnValue({
      ...helperBase,
      selectedApp: null,
      isCreateOpen: false,
      summary: { ...helperBase.summary, apps: [], totalApps: 0 },
      environments: [],
    });
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );

    await user.click(screen.getByRole("button", { name: "Create an app" }));
    expect(helperBase.openCreateApp).toHaveBeenCalled();
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it("renders the add-app drawer when create is open", () => {
    (useDashboardHelper as jest.Mock).mockReturnValue({
      ...helperBase,
      selectedApp: null,
      isCreateOpen: true,
    });
    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );
    expect(screen.getByText("Add New App")).toBeInTheDocument();
  });
});
