import React from "react";

const Icon = ({ ...props }: React.SVGProps<SVGSVGElement>) => (
  <svg data-testid="lucide-icon" {...props} />
);

export const LayoutDashboard = Icon;
export const LayoutGrid = Icon;
export const Castle = Icon;
export const Activity = Icon;
export const CircleHelp = Icon;
export const Pin = Icon;
export const PinOff = Icon;
export const Settings = Icon;
export const User = Icon;
export default {
  LayoutDashboard,
  LayoutGrid,
  Castle,
  Activity,
  CircleHelp,
  Pin,
  PinOff,
  Settings,
  User,
};
