import React from "react";
import { InputAdornment, TextField } from "@mui/material";

interface InputFieldProps {
  type: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  label?: string;
  name?: string;
  required?: boolean;
  error?: boolean;
  className?: string;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  disabled?: boolean;
}

const InputField: React.FC<InputFieldProps> = ({
  type,
  value,
  onChange,
  placeholder,
  label,
  name,
  required,
  className,
  onBlur,
  error,
  disabled = false,
}) => {
  return (
    <div className={`input-field ${className}`}>
      {label && <label htmlFor={name}>{label}</label>}
      <TextField
        id={name}
        type={type}
        error={error}
        name={name}
        onBlur={onBlur}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        variant="outlined"
        fullWidth
        required={required}
        className={className}
        disabled={disabled}
        margin="normal"
        InputProps={
          name === "phoneNumber"
            ? {
                startAdornment: (
                  <InputAdornment position="start">+1</InputAdornment>
                ),
              }
            : undefined
        }
      />
    </div>
  );
};

export default InputField;
