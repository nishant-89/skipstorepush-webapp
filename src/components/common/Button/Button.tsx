import React from "react";
import Button from "@mui/material/Button";

import "./index.scss";

interface ButtonProps {
  label: string;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  hidden?: boolean;
  className?: string;
  isIcon?: boolean;
  icon?: string;
  isRearIcon?: boolean;
  rearIcon?: string;
  variant?: "text" | "outlined" | "contained";
  isActive?: boolean;
  ariaLabel?: string;
}

const variantClassName = (variant: ButtonProps["variant"]) => {
  if (variant === "contained") return "appBtn--primary";
  if (variant === "outlined") return "appBtn--secondary";
  return "appBtn--ghost";
};

const ButtonComp: React.FC<ButtonProps> = ({
  label,
  onClick,
  type = "button",
  disabled = false,
  hidden = false,
  className = "",
  isIcon = false,
  icon = "",
  variant = "text",
  isRearIcon = false,
  rearIcon = "",
  isActive = false,
  ariaLabel,
}) => {
  const isIconOnly = Boolean(isIcon && !label?.trim());
  const stateClass = [
    isActive ? "active isActive" : "",
    hidden ? "isHidden" : "",
    isIconOnly ? "appBtn--icon" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <Button
      type={type}
      variant={variant}
      onClick={onClick}
      disabled={disabled}
      disableRipple
      aria-label={ariaLabel}
      className={`button appBtn ${variantClassName(variant)} ${stateClass} ${className}`.trim()}
    >
      {isIcon ? (
        <>
          <img src={icon} alt="" /> {label}
        </>
      ) : (
        <>
          {label} {isRearIcon ? <img src={rearIcon} alt="rear-icon" /> : ""}
        </>
      )}
    </Button>
  );
};

export default ButtonComp;
