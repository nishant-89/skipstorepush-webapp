import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { mergeProfileSettings } from "src/containers/redux/slices/profile";
import { persistUserSettings } from "src/utils/persistUserSettings";
import { RootState } from "src/redux/rootReducers";
import { getPreferredTheme, toggleTheme } from "src/utils/theme";
import { themeToApi } from "src/utils/userSettings";

const ThemeToggle = () => {
  const dispatch = useDispatch();
  const accessToken = useSelector(
    (state: RootState) => state.auth.accessToken
  );
  const savedTheme = useSelector(
    (state: RootState) => state.profile.data?.settings?.defaultTheme
  );
  const [theme, setTheme] = useState(getPreferredTheme);
  const isLight = theme === "light";

  useEffect(() => {
    setTheme(getPreferredTheme());
  }, [savedTheme]);

  const handleToggle = async () => {
    const next = toggleTheme(theme);
    setTheme(next);
    if (!accessToken) {
      return;
    }
    try {
      const saved = await persistUserSettings({
        defaultTheme: themeToApi(next),
      });
      dispatch(mergeProfileSettings(saved));
    } catch {
      // Local theme still applies if the account save fails.
    }
  };

  return (
    <button
      type="button"
      role="switch"
      className={`themeSwitch${isLight ? " isLight" : ""}`}
      aria-checked={isLight}
      onClick={() => {
        void handleToggle();
      }}
      aria-label={
        isLight ? "Switch to dark theme" : "Switch to light theme"
      }
    >
      <span className="themeSwitchIcon themeSwitchMoon" aria-hidden="true">
        <svg viewBox="0 0 24 24">
          <path
            d="M20 14.3A8.2 8.2 0 1 1 9.7 4 6.5 6.5 0 0 0 20 14.3Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      <span className="themeSwitchThumb" aria-hidden="true" />
      <span className="themeSwitchIcon themeSwitchSun" aria-hidden="true">
        <svg viewBox="0 0 24 24">
          <path
            d="M12 4V2M12 22v-2M4 12H2M22 12h-2M5.6 5.6 4.2 4.2M19.8 19.8l-1.4-1.4M18.4 5.6l1.4-1.4M5.6 18.4 4.2 19.8M12 8a4 4 0 1 1 0 8 4 4 0 0 1 0-8Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </svg>
      </span>
    </button>
  );
};

export default ThemeToggle;
