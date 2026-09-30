import { persistUserSettings } from "src/utils/persistUserSettings";
import { applyUserSettings } from "src/utils/userSettings";
import { patchDataApi } from "src/apis/api";
import { apiRoutes } from "src/utils/common/constants/constants";

jest.mock("src/apis/api", () => ({
  patchDataApi: jest.fn(),
}));

jest.mock("src/utils/userSettings", () => {
  const actual = jest.requireActual("src/utils/userSettings");
  return {
    ...actual,
    applyUserSettings: jest.fn(),
  };
});

const saved = {
  menuPinned: true,
  preservePinnedState: false,
  notificationEnabled: true,
  defaultTheme: "DARK",
  emailNotificationEnabled: false,
  releaseAlertEnabled: true,
  compactMode: true,
  language: "en",
  timezone: "UTC",
};

describe("persistUserSettings", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("patches settings and applies the saved payload", async () => {
    (patchDataApi as jest.Mock).mockResolvedValue({
      success: true,
      data: saved,
    });

    await expect(
      persistUserSettings({ menuPinned: true })
    ).resolves.toEqual(saved);
    expect(patchDataApi).toHaveBeenCalledWith({
      path: apiRoutes.UserSettings,
      data: { menuPinned: true },
    });
    expect(applyUserSettings).toHaveBeenCalledWith(saved);
  });

  it("throws when the API does not return settings", async () => {
    (patchDataApi as jest.Mock).mockResolvedValue({
      success: false,
      message: "Nope",
    });

    await expect(persistUserSettings({ compactMode: true })).rejects.toThrow(
      "Nope"
    );
  });
});
