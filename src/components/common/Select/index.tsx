import React, { useRef, useState } from "react";
import {
  Select,
  MenuItem,
  FormControl,
  SelectChangeEvent,
} from "@mui/material";
import { v4 as uuid } from "uuid";

interface Option {
  value: string;
  label: string;
}

interface SelectComponentProps {
  title: string;
  label?: string;
  placeholder?: string;
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  styles?: React.CSSProperties;
  selectStyles?: React.CSSProperties;
  menuItemStyles?: React.CSSProperties;
  loading?: boolean;
  setPage?: (value: number | ((prev: number) => number)) => void;
  page?: number;
  limit?: number;
  count?: number;
  fetchOptions?: () => void;
}

const SelectComponent: React.FC<SelectComponentProps> = ({
  title = "",
  label = "",
  options,
  placeholder = "Select an option",
  value,
  onChange,
  styles,
  selectStyles,
  menuItemStyles,
  loading = false,
  setPage = () => {},
  page = 0,
  limit = 5,
  count = 0,
  fetchOptions = () => {},
}) => {
  const debounceTimeout = useRef<number | undefined>(undefined);
  const [open, setOpen] = useState(false); // Track open state

  const debounce = (func: () => void, delay: number) => {
    return () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
      debounceTimeout.current = window.setTimeout(func, delay);
    };
  };

  const handleChange = (event: SelectChangeEvent<string>) => {
    onChange(event.target.value);
  };

  const handleScroll = (event: React.UIEvent<HTMLElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = event.currentTarget;
    if (
      scrollTop + clientHeight >= scrollHeight - 10 &&
      !loading &&
      (page + 1) * limit < count
    ) {
      debounce(() => setPage((prev) => prev + 1), 300)();
    }
  };

  const selectedLabel = options.find((option) => option.value === value)?.label;

  return (
    <div className="filterCheckboxWrapper">
      <h4 className="title">{title}</h4>
      <div>{label}</div>
      <FormControl
        variant="outlined"
        className={`custom-select-wrapper ${open ? "select-open" : ""}`}
        style={styles}
      >
        <Select
          onScroll={handleScroll}
          value={value}
          onChange={handleChange}
          onOpen={() => {
            setOpen(true);
            fetchOptions();
          }}
          onClose={() => setOpen(false)}
          className="custom-select"
          displayEmpty
          style={selectStyles}
          MenuProps={{
            classes: { paper: "select-custom-backdrop" },
            PaperProps: {
              sx: { maxHeight: 200 },
              onScroll: handleScroll,
            },
          }}
          renderValue={(selected) => {
            if (!selected) {
              return (
                <span style={{ color: "#abb3ba", fontWeight: "400" }}>
                  {placeholder}
                </span>
              );
            }
            return selectedLabel || placeholder;
          }}
        >
          {options?.length > 0 ? (
            options.map((option) => (
              <MenuItem
                key={uuid()}
                value={option.value}
                className={`accessGroupMenuItem`}
                style={menuItemStyles}
              >
                <span className="select-value">{option.label}</span>
              </MenuItem>
            ))
          ) : (
            <MenuItem disabled>
              <span style={{ color: "#000000" }}>
                {loading ? "Loading..." : "No data"}
              </span>
            </MenuItem>
          )}
        </Select>
      </FormControl>
    </div>
  );
};

export default SelectComponent;
