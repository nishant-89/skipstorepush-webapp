import { fireEvent, render, screen } from "@testing-library/react";
import Settings from "../Settings";
import { useSettingsHelper } from "../helper";

jest.mock("../helper", () => ({
  useSettingsHelper: jest.fn(),
}));

jest.mock("src/components/common/BreadCrumbs/BreadCrumbs", () => ({
  __esModule: true,
  default: () => <nav aria-label="breadcrumb">Breadcrumbs</nav>,
}));

describe("Settings", () => {
  it("renders the available user settings", () => {
    (useSettingsHelper as jest.Mock).mockReturnValue({
      settings: {
        menuPinned: false,
        notificationEnabled: true,
        defaultTheme: "DARK",
        emailNotificationEnabled: true,
        releaseAlertEnabled: true,
        compactMode: false,
        preservePinnedState: false,
        language: "en",
        timezone: "",
      },
      loading: false,
      savingKey: null,
      languageOptions: [{ value: "en", label: "English" }],
      timeZones: ["UTC"],
      toggle: jest.fn(),
      setTheme: jest.fn(),
      setLanguage: jest.fn(),
      setTimezone: jest.fn(),
    });

    render(<Settings />);
    expect(screen.getByLabelText("breadcrumb")).toBeInTheDocument();
    expect(screen.getByLabelText("Pin navigation")).toBeInTheDocument();
    expect(screen.getByLabelText("Preserve pinned state")).toBeInTheDocument();
    expect(screen.getByLabelText("Compact mode")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Dark" })).toBeInTheDocument();
    expect(screen.getByLabelText("In-app notifications")).toBeInTheDocument();
    expect(screen.getByLabelText("Email notifications")).toBeInTheDocument();
    expect(screen.getByLabelText("Release alerts")).toBeInTheDocument();
    expect(screen.getByLabelText("Language")).toBeInTheDocument();
    expect(screen.getByLabelText("Time zone")).toBeInTheDocument();
  });

  it("opens the language menu with themed options", () => {
    const setLanguage = jest.fn();
    (useSettingsHelper as jest.Mock).mockReturnValue({
      settings: {
        menuPinned: false,
        notificationEnabled: true,
        defaultTheme: "DARK",
        emailNotificationEnabled: true,
        releaseAlertEnabled: true,
        compactMode: false,
        preservePinnedState: false,
        language: "en",
        timezone: "",
      },
      loading: false,
      savingKey: null,
      languageOptions: [
        { value: "en", label: "English" },
        { value: "es", label: "Spanish" },
      ],
      timeZones: ["UTC"],
      toggle: jest.fn(),
      setTheme: jest.fn(),
      setLanguage,
      setTimezone: jest.fn(),
    });

    render(<Settings />);
    fireEvent.mouseDown(screen.getByLabelText("Language"));
    expect(screen.getByRole("option", { name: "Spanish" })).toBeInTheDocument();
    fireEvent.click(screen.getByRole("option", { name: "Spanish" }));
    expect(setLanguage).toHaveBeenCalledWith("es");
  });
});
