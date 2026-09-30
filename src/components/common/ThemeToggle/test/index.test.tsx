import { persistUserSettings } from "src/utils/persistUserSettings";
import { fireEvent, render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import ThemeToggle from "src/components/common/ThemeToggle";
import { THEME_STORAGE_KEY } from "src/utils/theme";

jest.mock("src/utils/persistUserSettings", () => ({
  persistUserSettings: jest.fn().mockResolvedValue({
    defaultTheme: "LIGHT",
    menuPinned: false,
    notificationEnabled: true,
    emailNotificationEnabled: true,
    releaseAlertEnabled: true,
    compactMode: false,
    language: "en",
    timezone: null,
  }),
}));

const mockStore = configureStore([]);

describe("ThemeToggle", () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute("data-theme");
    (persistUserSettings as jest.Mock).mockClear();
  });

  const renderToggle = (accessToken = "") =>
    render(
      <Provider
        store={mockStore({
          auth: { accessToken },
          profile: { data: null, loading: false, error: "" },
        })}
      >
        <ThemeToggle />
      </Provider>
    );

  it("switches from dark to light locally when logged out", () => {
    renderToggle();
    const toggle = screen.getByLabelText("Switch to light theme");
    expect(toggle).toHaveAttribute("aria-checked", "false");
    fireEvent.click(toggle);
    expect(document.documentElement.getAttribute("data-theme")).toBe("light");
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe("light");
    expect(persistUserSettings).not.toHaveBeenCalled();
    expect(screen.getByLabelText("Switch to dark theme")).toHaveAttribute(
      "aria-checked",
      "true"
    );
  });

  it("persists theme when the user is signed in", () => {
    renderToggle("token");
    fireEvent.click(screen.getByLabelText("Switch to light theme"));
    expect(persistUserSettings).toHaveBeenCalled();
  });
});
