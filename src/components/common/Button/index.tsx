import React from "react";
import Button from "@mui/material/Button";

import "./index.scss";

interface ButtonProps {
  label: string;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  className?: string;
  isIcon?: boolean;
  icon?: string;
  isRearIcon?: boolean;
  rearIcon?: string;
  variant?: "text" | "outlined" | "contained";
  isActive?: boolean;
}

const ButtonComp: React.FC<ButtonProps> = ({
  label,
  onClick,
  type = "button",
  disabled = false,
  className = "",
  isIcon = false,
  icon = "",
  variant = "text",
  isRearIcon = false,
  rearIcon = "",
  isActive = false,
}) => {
  return (
    <Button
      type={type}
      variant={variant}
      onClick={onClick}
      disabled={disabled}
      className={`button ${isActive && "active"} ${className}`}
    >
      {isIcon ? (
        <>
          <img src={icon} alt="rear-icon" /> {label}
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
