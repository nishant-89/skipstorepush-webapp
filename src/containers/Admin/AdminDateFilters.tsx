import { AdminDatePreset } from "./types";

const PRESETS: { id: AdminDatePreset; label: string }[] = [
  { id: "today", label: "Today" },
  { id: "yesterday", label: "Yesterday" },
  { id: "last_7_days", label: "Last 7 days" },
  { id: "this_month", label: "This month" },
  { id: "last_month", label: "Last month" },
  { id: "custom", label: "Custom" },
];

type AdminDateFiltersProps = {
  preset: AdminDatePreset;
  from: string;
  to: string;
  onPreset: (value: AdminDatePreset) => void;
  onFrom: (value: string) => void;
  onTo: (value: string) => void;
  label?: string;
  hint?: string;
};

const AdminDateFilters = ({
  preset,
  from,
  to,
  onPreset,
  onFrom,
  onTo,
  label = "Date range",
  hint,
}: AdminDateFiltersProps) => (
  <div className="adminFilters">
    <div className="adminPresets" role="group" aria-label={label}>
      {PRESETS.map((item) => (
        <button
          key={item.id}
          type="button"
          className={`adminPreset${preset === item.id ? " isActive" : ""}`}
          aria-pressed={preset === item.id}
          onClick={() => onPreset(item.id)}
        >
          {item.label}
        </button>
      ))}
    </div>
    {preset === "custom" ? (
      <div className="adminCustomRange">
        <label>
          From
          <input
            type="date"
            value={from}
            max={to || undefined}
            onChange={(event) => onFrom(event.target.value)}
          />
        </label>
        <label>
          To
          <input
            type="date"
            value={to}
            min={from || undefined}
            onChange={(event) => onTo(event.target.value)}
          />
        </label>
      </div>
    ) : null}
    {hint ? <p className="adminHint">{hint}</p> : null}
  </div>
);

export default AdminDateFilters;
