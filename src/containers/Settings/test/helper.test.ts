import { act, renderHook } from "@testing-library/react";
import { useSettingsHelper } from "../helper";
import { fetchProfileDataRequest } from "src/containers/redux/slices/profile";
import { persistUserSettings } from "src/utils/persistUserSettings";
import { showAlert } from "src/utils/alert";

const mockDispatch = jest.fn();
const mockSettings = {
  menuPinned: false,
  notificationEnabled: true,
  defaultTheme: "LIGHT",
  emailNotificationEnabled: true,
  releaseAlertEnabled: true,
  compactMode: false,
  language: "en",
  timezone: null,
};

jest.mock("react-redux", () => ({
  useDispatch: () => mockDispatch,
  useSelector: (selector: (state: unknown) => unknown) =>
    selector({
      profile: {
        data: { settings: mockSettings },
        loading: false,
        error: "",
      },
    }),
}));

jest.mock("src/utils/persistUserSettings", () => ({
  persistUserSettings: jest.fn(),
}));

jest.mock("src/utils/alert", () => ({
  showAlert: jest.fn(),
}));

describe("useSettingsHelper", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (persistUserSettings as jest.Mock).mockResolvedValue({
      ...mockSettings,
      menuPinned: true,
    });
  });

  it("loads profile settings", () => {
    const { result } = renderHook(() => useSettingsHelper());
    expect(mockDispatch).toHaveBeenCalledWith(fetchProfileDataRequest());
    expect(result.current.settings.defaultTheme).toBe("LIGHT");
  });

  it("saves a toggle to the settings API", async () => {
    const { result } = renderHook(() => useSettingsHelper());
    await act(async () => {
      result.current.toggle("menuPinned");
    });
    expect(persistUserSettings).toHaveBeenCalledWith({ menuPinned: true });
    expect(showAlert).toHaveBeenCalledWith(1, "Settings saved");
  });
});
