import React, { useLayoutEffect, useRef, useState } from "react";
import { IconButton, InputAdornment, TextField } from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

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
  maxLength?: number;
  autoComplete?: string;
  showPasswordToggle?: boolean;
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
  maxLength,
  autoComplete,
  showPasswordToggle = false,
}) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const selectionRef = useRef<{ start: number; end: number } | null>(null);
  const resolvedType = showPasswordToggle
    ? isPasswordVisible
      ? "text"
      : "password"
    : type;

  useLayoutEffect(() => {
    const input = inputRef.current;
    const selection = selectionRef.current;
    if (!input || !selection) {
      return;
    }
    input.setSelectionRange(selection.start, selection.end);
  }, [isPasswordVisible]);

  const togglePasswordVisibility = () => {
    const input = inputRef.current;
    if (input) {
      selectionRef.current = {
        start: input.selectionStart ?? input.value.length,
        end: input.selectionEnd ?? input.value.length,
      };
    }
    setIsPasswordVisible((current) => !current);
  };

  const startAdornment =
    name === "phoneNumber" ? (
      <InputAdornment position="start">+1</InputAdornment>
    ) : undefined;

  const endAdornment = showPasswordToggle ? (
    <InputAdornment position="end">
      <IconButton
        aria-label={isPasswordVisible ? "Hide password" : "Show password"}
        onClick={togglePasswordVisibility}
        onMouseDown={(event) => event.preventDefault()}
        edge="end"
        className="passwordToggle"
        disabled={disabled}
      >
        {isPasswordVisible ? <VisibilityOff /> : <Visibility />}
      </IconButton>
    </InputAdornment>
  ) : undefined;

  return (
    <div className={`input-field ${className || ""}`.trim()}>
      {label && <label htmlFor={name}>{label}</label>}
      <TextField
        id={name}
        type={resolvedType}
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
        autoComplete={autoComplete}
        inputRef={inputRef}
        inputProps={maxLength ? { maxLength } : undefined}
        InputProps={
          startAdornment || endAdornment
            ? { startAdornment, endAdornment }
            : undefined
        }
      />
    </div>
  );
};

export default InputField;
