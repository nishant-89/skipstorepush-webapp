import { FormControl, MenuItem, Select, SelectChangeEvent } from "@mui/material";
import { useState } from "react";
import Breadcrumbs from "src/components/common/BreadCrumbs/BreadCrumbs";
import { useSettingsHelper } from "./helper";
import "./settings.scss";

type SettingsSelectOption = {
  value: string;
  label: string;
};

const SettingsSelect = ({
  id,
  labelId,
  value,
  disabled,
  placeholder,
  options,
  onChange,
}: {
  id: string;
  labelId: string;
  value: string;
  disabled?: boolean;
  placeholder: string;
  options: SettingsSelectOption[];
  onChange: (value: string) => void;
}) => {
  const [open, setOpen] = useState(false);
  const selectedLabel = options.find((option) => option.value === value)?.label;

  return (
    <div className={`settingsSelect${open ? " isOpen" : ""}`}>
      <FormControl
        variant="outlined"
        disabled={disabled}
        className={`custom-select-wrapper${open ? " select-open" : ""}`}
      >
        <Select
          id={id}
          labelId={labelId}
          value={value}
          disabled={disabled}
          displayEmpty
          className="custom-select"
          onChange={(event: SelectChangeEvent<string>) =>
            onChange(event.target.value)
          }
          onOpen={() => setOpen(true)}
          onClose={() => setOpen(false)}
          MenuProps={{
            classes: { paper: "select-custom-backdrop settingsSelectMenu" },
            PaperProps: {
              className: "settingsSelectMenu",
              sx: { maxHeight: 280 },
            },
          }}
          renderValue={(selected) => {
            if (!selected) {
              return (
                <span className="settingsSelectPlaceholder">{placeholder}</span>
              );
            }
            return selectedLabel || placeholder;
          }}
        >
          {options.map((option) => (
            <MenuItem key={option.value || "browser-default"} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
};

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
    timeZoneOptions,
    selectedTimeZone,
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
            <label className="settingsLabel" id="settings-language-label" htmlFor="settings-language">
              Language
            </label>
            <SettingsSelect
              id="settings-language"
              labelId="settings-language-label"
              value={settings.language}
              disabled={busy}
              placeholder="Select language"
              options={languageOptions}
              onChange={setLanguage}
            />
          </div>
          <div className="settingsRow settingsRowStack">
            <label className="settingsLabel" id="settings-timezone-label" htmlFor="settings-timezone">
              Time zone
            </label>
            <SettingsSelect
              id="settings-timezone"
              labelId="settings-timezone-label"
              value={selectedTimeZone}
              disabled={busy}
              placeholder="Use browser default"
              options={[
                { value: "", label: "Use browser default" },
                ...timeZoneOptions,
              ]}
              onChange={setTimezone}
            />
          </div>
        </section>
      </div>
    </div>
  );
};

export default Settings;
