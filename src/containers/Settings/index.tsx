import Breadcrumbs from "src/components/common/BreadCrumbs";
import { useSettingsHelper } from "./helper";
import "./settings.scss";

const SettingsToggle = ({
  label,
  description,
  checked,
  disabled,
  onChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  disabled?: boolean;
  onChange: () => void;
}) => (
  <div className="settingsRow">
    <div>
      <p className="settingsLabel">{label}</p>
      <p className="settingsHint">{description}</p>
    </div>
    <button
      type="button"
      role="switch"
      className={`settingsSwitch${checked ? " isOn" : ""}`}
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={onChange}
    >
      <span className="settingsSwitchThumb" />
    </button>
  </div>
);

const Settings = () => {
  const {
    settings,
    savingKey,
    languageOptions,
    timeZones,
    toggle,
    setTheme,
    setLanguage,
    setTimezone,
  } = useSettingsHelper();
  const busy = Boolean(savingKey);

  return (
    <div className="settingsPage">
      <Breadcrumbs />
      <div className="cardBgWrapper settingsCard">
        <section>
          <h2>Appearance</h2>
          <SettingsToggle
            label="Pin navigation"
            description="Keep the side menu expanded instead of collapsing when the pointer leaves."
            checked={settings.menuPinned}
            disabled={busy || settings.preservePinnedState}
            onChange={() => toggle("menuPinned")}
          />
          <SettingsToggle
            label="Preserve pinned state"
            description="Lock the current pin. You cannot pin an unpinned menu, or unpin a pinned one, until this is turned off."
            checked={settings.preservePinnedState}
            disabled={busy}
            onChange={() => toggle("preservePinnedState")}
          />
          <SettingsToggle
            label="Compact mode"
            description="Tighten page padding so more content fits on screen."
            checked={settings.compactMode}
            disabled={busy}
            onChange={() => toggle("compactMode")}
          />
          <div className="settingsRow">
            <div>
              <p className="settingsLabel">Theme</p>
              <p className="settingsHint">
                Saved to your account and restored after login.
              </p>
            </div>
            <div className="settingsTheme">
              <button
                type="button"
                className={`appBtn appBtn--secondary appBtn--sm${settings.defaultTheme === "DARK" ? " isActive" : ""}`}
                disabled={busy}
                onClick={() => setTheme("DARK")}
              >
                Dark
              </button>
              <button
                type="button"
                className={`appBtn appBtn--secondary appBtn--sm${settings.defaultTheme === "LIGHT" ? " isActive" : ""}`}
                disabled={busy}
                onClick={() => setTheme("LIGHT")}
              >
                Light
              </button>
            </div>
          </div>
        </section>

        <section>
          <h2>Notifications</h2>
          <SettingsToggle
            label="In-app notifications"
            description="Allow product notices inside the console."
            checked={settings.notificationEnabled}
            disabled={busy}
            onChange={() => toggle("notificationEnabled")}
          />
          <SettingsToggle
            label="Email notifications"
            description="Receive account and activity updates by email."
            checked={settings.emailNotificationEnabled}
            disabled={busy}
            onChange={() => toggle("emailNotificationEnabled")}
          />
          <SettingsToggle
            label="Release alerts"
            description="Get notified when releases are published or change status."
            checked={settings.releaseAlertEnabled}
            disabled={busy}
            onChange={() => toggle("releaseAlertEnabled")}
          />
        </section>

        <section>
          <h2>Regional</h2>
          <div className="settingsRow settingsRowStack">
            <label className="settingsLabel" htmlFor="settings-language">
              Language
            </label>
            <select
              id="settings-language"
              value={settings.language}
              disabled={busy}
              onChange={(event) => setLanguage(event.target.value)}
            >
              {languageOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div className="settingsRow settingsRowStack">
            <label className="settingsLabel" htmlFor="settings-timezone">
              Time zone
            </label>
            <select
              id="settings-timezone"
              value={settings.timezone || ""}
              disabled={busy}
              onChange={(event) => setTimezone(event.target.value)}
            >
              <option value="">Use browser default</option>
              {timeZones.map((zone) => (
                <option key={zone} value={zone}>
                  {zone.replace(/_/g, " ")}
                </option>
              ))}
            </select>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Settings;
