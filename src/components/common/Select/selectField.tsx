import React from "react";
import {
  FormControl,
  Select,
  MenuItem,
  FormHelperText,
  SelectChangeEvent,
} from "@mui/material";

interface SelectOption {
  value: string | number;
  label: string;
}

interface SelectFieldProps {
  label: string;
  name: string;
  options: SelectOption[];
  onChange: (event: SelectChangeEvent<string | number>) => void;
  onBlur: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  value: string | number | undefined;
  error?: string;
  placeholder: string;
  disabled?: boolean;
}

const SelectField: React.FC<SelectFieldProps> = ({
  label,
  name,
  options,
  onChange,
  onBlur,
  value,
  error,
  placeholder = "",
  disabled = false,
}) => {
  const renderSelectedValue = (selected: string | number | undefined) => {
    if (!selected && selected !== 0) {
      return <span className="placeholder">{placeholder}</span>;
    }

    const item = options.find((option) => option.value === selected);
    return item ? (
      item.label
    ) : (
      <span className="placeholder">{placeholder}</span>
    );
  };

  return (
    <FormControl fullWidth variant="outlined" error={Boolean(error)}>
      <label>{label}</label>
      <Select
        className="customSelectWrapper"
        id={name}
        name={name}
        renderValue={renderSelectedValue}
        value={value ?? ""}
        onChange={onChange}
        onBlur={onBlur}
        disabled={disabled}
        displayEmpty
        MenuProps={{
          classes: { paper: "select-backdrop" },
          PaperProps: {
            sx: {
              maxHeight: 200,
            },
          },
        }}
      >
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
      {error && <FormHelperText>{error}</FormHelperText>}
    </FormControl>
  );
};

export default SelectField;
