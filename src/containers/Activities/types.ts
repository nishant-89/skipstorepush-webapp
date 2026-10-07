export type ActivityItem = {
  id: number;
  action: string;
  targetType: string;
  targetId: number;
  appId: number | null;
  appExists?: boolean;
  status: string;
  metadata: Record<string, unknown> | null;
  createdDate: string;
  updatedDate: string;
};

export type ActivitiesListData = {
  list: ActivityItem[];
  current_page: number;
  total_items: number;
  page: number;
  page_limit: number;
};

export type ActivitiesResponse = {
  success?: boolean;
  statusCode?: number;
  message?: string;
  data?: ActivitiesListData;
};
