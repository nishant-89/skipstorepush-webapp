import React from "react";

const Icon = ({ ...props }: React.SVGProps<SVGSVGElement>) => (
  <svg data-testid="lucide-icon" {...props} />
);

export const LayoutGrid = Icon;
export const Activity = Icon;
export const CircleHelp = Icon;
export const Pin = Icon;
export default { LayoutGrid, Activity, CircleHelp, Pin };
