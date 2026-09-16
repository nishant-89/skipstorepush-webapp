import React from "react";
import Tooltip from "@mui/material/Tooltip";
import { TooltipProps } from "@mui/material";
import "./tooltip.scss";

interface CustomTooltipProps {
  content: React.ReactNode;
  children: React.ReactNode;
}

const CustomTooltip: React.FC<
  CustomTooltipProps & Omit<TooltipProps, "title">
> = ({ content, children, ...props }) => {
  return (
    <Tooltip
      title={<div className="tooltipTitle">{content}</div>}
      placement="right"
      arrow
      {...props}
    >
      <span>{children}</span>
    </Tooltip>
  );
};

export default CustomTooltip;
