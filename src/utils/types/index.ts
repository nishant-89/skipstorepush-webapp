import { ReactElement } from "react";

export interface Column<T> {
  sortId?: string | number;
  field: keyof T | string;
  headerName: string;
  width?: number;
  renderCell?: (row: T, handleActionCellClick?: any) => ReactElement;
  sorting?: boolean;
  sortable?: boolean;
  isCheckbox?: boolean;
  isNumeric?: boolean;
  handleActionCellClick?: (id: string, actionStatus: string) => void;
  className?: string;
}

export interface Option {
  value: string;
  label: string;
}

export interface FilterParams {
  status: string[];
  module: string[];
  organisation?: string;
}

export interface BreadCrumbsCustomProps {
  title: string;
  toolTipTitle?: string;
  config: BreadCrumbsConfig[];
}

export interface BreadCrumbsConfig {
  label: string;
  route: string;
  isClickable?: boolean;
}

export interface HttpResponse {
  statusCode: number;
  message: string;
}

type LogoutData = {
  message: string;
};

export type LogoutResponse = {
  statusCode: number;
  success: boolean;
  message: string;
  data: LogoutData;
  error: Record<string, unknown>; // Or `any` if you prefer flexibility
  timestamp: string;
};
