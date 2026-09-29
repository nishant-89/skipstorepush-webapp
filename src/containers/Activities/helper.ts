import { useEffect, useState } from "react";
import { getDataApi } from "src/apis/api";
import { showAlert } from "src/utils/alert";
import { apiRoutes, getErrorMessage } from "src/utils/common/constants";
import { ActivitiesResponse, ActivityItem } from "./types";

export const formatActivityLabel = (value?: string) => {
  if (!value) {
    return "—";
  }
  return value
    .toLowerCase()
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
};

export const formatActivityDetails = (
  metadata: Record<string, unknown> | null
) => {
  if (!metadata) {
    return "—";
  }

  const parts: string[] = [];
  if (typeof metadata.osType === "string" && metadata.osType) {
    parts.push(metadata.osType === "IOS" ? "iOS" : metadata.osType);
  }
  if (typeof metadata.environmentName === "string" && metadata.environmentName) {
    parts.push(metadata.environmentName);
  }
  if (typeof metadata.releaseVersion === "string" && metadata.releaseVersion) {
    parts.push(`v${metadata.releaseVersion}`);
  }
  if (typeof metadata.email === "string" && metadata.email) {
    parts.push(metadata.email);
  }

  return parts.length ? parts.join(" · ") : "—";
};

export const getActivityAppName = (row: ActivityItem) =>
  (typeof row.metadata?.appName === "string" && row.metadata.appName) ||
  (typeof row.metadata?.name === "string" && row.metadata.name) ||
  (row.appId ? `App ${row.appId}` : "");

export const canOpenActivityApp = (row: ActivityItem) =>
  Boolean(row.appId) &&
  row.action !== "APP_DELETED" &&
  row.appExists !== false;

export const useActivitiesHelper = () => {
  const [list, setList] = useState<ActivityItem[]>([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [mainPage, setMainPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [term, setTerm] = useState("");

  useEffect(() => {
    const loadActivities = async () => {
      try {
        setLoading(true);
        const response = (await getDataApi({
          path: apiRoutes.Activities,
          data: {
            page: mainPage + 1,
            limit: rowsPerPage,
            ...(searchTerm.trim() ? { search: searchTerm.trim() } : {}),
          },
        })) as ActivitiesResponse;

        if (response?.success) {
          setList(response.data?.list || []);
          setCount(response.data?.total_items || 0);
        }
      } catch (error) {
        showAlert(2, getErrorMessage(error));
        setList([]);
        setCount(0);
      } finally {
        setLoading(false);
      }
    };

    loadActivities();
  }, [mainPage, rowsPerPage, searchTerm]);

  const handleSearch = (value: string) => {
    setMainPage(0);
    setSearchTerm(value);
  };

  const handleChangePage = (newPage: number) => {
    setMainPage(newPage);
  };

  const handleChangeRowsPerPage = (newRowsPerPage: number) => {
    setMainPage(0);
    setRowsPerPage(newRowsPerPage);
  };

  return {
    list,
    count,
    loading,
    mainPage,
    rowsPerPage,
    searchTerm,
    term,
    setTerm,
    setSearchTerm: handleSearch,
    handleChangePage,
    handleChangeRowsPerPage,
  };
};
