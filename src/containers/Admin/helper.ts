import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { getDataApi } from "src/apis/api";
import { showAlert } from "src/utils/alert";
import { apiRoutes, getErrorMessage } from "src/utils/common/constants/constants";
import {
  AdminAppDetail,
  AdminAppRow,
  AdminCustomerDetail,
  AdminCustomerRow,
  AdminListResponse,
  AdminActivityRow,
  AdminDatePreset,
  AdminOverviewData,
} from "./types";

type ApiEnvelope<T> = { success: boolean; data?: T };

export const formatAdminLabel = (value?: string | null) => {
  if (!value) {
    return "—";
  }
  return value
    .toLowerCase()
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
};

const usePagedList = <T,>(
  path: string,
  extra: Record<string, string | number | undefined> = {}
) => {
  const [list, setList] = useState<T[]>([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [mainPage, setMainPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [term, setTerm] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const response = (await getDataApi({
          path,
          data: {
            page: mainPage + 1,
            limit: rowsPerPage,
            ...(searchTerm.trim() ? { search: searchTerm.trim() } : {}),
            ...Object.fromEntries(
              Object.entries(extra).filter(([, value]) => value != null && value !== "")
            ),
          },
        })) as AdminListResponse<T>;
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
    void load();
  }, [path, mainPage, rowsPerPage, searchTerm, JSON.stringify(extra)]);

  return {
    list,
    count,
    loading,
    mainPage,
    rowsPerPage,
    searchTerm,
    term,
    setTerm,
    handleChangePage: (page: number) => setMainPage(page),
    handleChangeRowsPerPage: (rows: number) => {
      setRowsPerPage(rows);
      setMainPage(0);
    },
    setSearchTerm: (value: string) => {
      setMainPage(0);
      setSearchTerm(value);
    },
  };
};

const browserTimeZone = () => {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
  } catch {
    return "UTC";
  }
};

const inclusiveDayCount = (from: string, to: string) => {
  const start = Date.parse(`${from}T00:00:00Z`);
  const end = Date.parse(`${to}T00:00:00Z`);
  if (Number.isNaN(start) || Number.isNaN(end)) {
    return 0;
  }
  return Math.round((end - start) / 86400000) + 1;
};

export const formatAdminRangeLabel = (
  range?: { from?: string; to?: string } | null,
  fallback = "Last 7 days"
) => (range?.from && range?.to ? `${range.from} – ${range.to}` : fallback);

export const adminRangeParams = (
  preset: AdminDatePreset,
  from: string,
  to: string
): { error?: string; data?: Record<string, string> } => {
  if (preset === "custom" && (!from || !to)) {
    return {};
  }
  if (preset === "custom" && Math.abs(inclusiveDayCount(from, to)) > 92) {
    return { error: "Choose a range of 92 days or fewer." };
  }
  return {
    data: {
      preset,
      timezone: browserTimeZone(),
      ...(preset === "custom" ? { from, to } : {}),
    },
  };
};

export const useAdminOverviewHelper = () => {
  const [data, setData] = useState<AdminOverviewData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activityLoading, setActivityLoading] = useState(false);
  const rangeKeyRef = useRef("");
  const [preset, setPresetState] = useState<AdminDatePreset>("last_7_days");
  const [from, setFromState] = useState("");
  const [to, setToState] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const setPreset = (value: AdminDatePreset) => {
    setPage(0);
    setPresetState(value);
  };
  const setFrom = (value: string) => {
    setPage(0);
    setFromState(value);
  };
  const setTo = (value: string) => {
    setPage(0);
    setToState(value);
  };

  useEffect(() => {
    const range = adminRangeParams(preset, from, to);
    if (range.error) {
      showAlert(2, range.error);
      return;
    }
    if (!range.data) {
      return;
    }
    const rangeKey = `${preset}|${from}|${to}`;
    const rangeChanged = rangeKeyRef.current !== rangeKey;
    rangeKeyRef.current = rangeKey;
    const load = async () => {
      try {
        if (rangeChanged) {
          setLoading(true);
        } else {
          setActivityLoading(true);
        }
        const response = (await getDataApi({
          path: apiRoutes.AdminOverview,
          data: {
            ...range.data,
            page: page + 1,
            limit: rowsPerPage,
          },
        })) as ApiEnvelope<AdminOverviewData>;
        if (response?.success) {
          setData(response.data || null);
        }
      } catch (error) {
        showAlert(2, getErrorMessage(error));
        setData(null);
      } finally {
        setLoading(false);
        setActivityLoading(false);
      }
    };
    void load();
  }, [preset, from, to, page, rowsPerPage]);

  return {
    data,
    loading,
    activityLoading,
    preset,
    from,
    to,
    setPreset,
    setFrom,
    setTo,
    page,
    rowsPerPage,
    handleChangePage: (nextPage: number) => setPage(nextPage),
    handleChangeRowsPerPage: (rows: number) => {
      setRowsPerPage(rows);
      setPage(0);
    },
  };
};

export const useAdminCustomersHelper = () =>
  usePagedList<AdminCustomerRow>(apiRoutes.AdminCustomers);

const useAdminDateState = () => {
  const [preset, setPreset] = useState<AdminDatePreset>("last_7_days");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  return { preset, from, to, setPreset, setFrom, setTo };
};

const useAdminDetail = <T,>(
  basePath: string,
  extra: Record<string, number> = {}
) => {
  const { id } = useParams();
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [releasesLoading, setReleasesLoading] = useState(false);
  const loadedId = useRef<string | null>(null);
  const { preset, from, to, setPreset, setFrom, setTo } = useAdminDateState();
  const extraKey = JSON.stringify(extra);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      if (!id) {
        setLoading(false);
        return;
      }
      const range = adminRangeParams(preset, from, to);
      if (range.error) {
        showAlert(2, range.error);
        return;
      }
      if (!range.data) {
        return;
      }
      const refreshing = loadedId.current === id;
      try {
        if (refreshing) {
          setReleasesLoading(true);
        } else {
          setData(null);
          setLoading(true);
        }
        const response = (await getDataApi({
          path: `${basePath}/${id}`,
          data: { ...range.data, ...extra },
        })) as ApiEnvelope<T>;
        if (cancelled) {
          return;
        }
        if (response?.success) {
          setData(response.data || null);
          loadedId.current = id;
        }
      } catch (error) {
        if (cancelled) {
          return;
        }
        showAlert(2, getErrorMessage(error));
        if (loadedId.current !== id) {
          setData(null);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
          setReleasesLoading(false);
        }
      }
    };
    void load();
    return () => {
      cancelled = true;
    };
  }, [basePath, id, preset, from, to, extraKey]);

  return {
    data,
    loading,
    releasesLoading,
    preset,
    from,
    to,
    setPreset,
    setFrom,
    setTo,
  };
};

export const useClientTable = <T extends { id?: string | number }>(rows: T[]) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const rowKey = rows.map((row) => row.id ?? "").join("|");
  useEffect(() => {
    setPage(0);
  }, [rowKey]);
  const count = rows.length;
  const maxPage = Math.max(0, Math.ceil(count / rowsPerPage) - 1);
  const safePage = Math.min(page, maxPage);
  return {
    pageRows: rows.slice(
      safePage * rowsPerPage,
      safePage * rowsPerPage + rowsPerPage
    ),
    page: safePage,
    rowsPerPage,
    count,
    onPageChange: setPage,
    onRowsPerPageChange: (rows: number) => {
      setRowsPerPage(rows);
      setPage(0);
    },
  };
};

export const useAdminCustomerHelper = () => {
  const [activityPage, setActivityPage] = useState(0);
  const [activityRowsPerPage, setActivityRowsPerPage] = useState(10);
  const detail = useAdminDetail<AdminCustomerDetail>(apiRoutes.AdminCustomers, {
    activityPage: activityPage + 1,
    activityLimit: activityRowsPerPage,
  });
  return {
    ...detail,
    activityPage,
    activityRowsPerPage,
    handleActivityPage: setActivityPage,
    handleActivityRows: (rows: number) => {
      setActivityRowsPerPage(rows);
      setActivityPage(0);
    },
  };
};

export const useAdminAppsHelper = () =>
  usePagedList<AdminAppRow>(apiRoutes.AdminApps);

export const useAdminAppHelper = () => {
  const [releasePage, setReleasePage] = useState(0);
  const [releaseRowsPerPage, setReleaseRowsPerPage] = useState(10);
  const detail = useAdminDetail<AdminAppDetail>(apiRoutes.AdminApps, {
    releasePage: releasePage + 1,
    releaseLimit: releaseRowsPerPage,
  });
  const resetReleasePage = () => setReleasePage(0);
  return {
    ...detail,
    releasePage,
    releaseRowsPerPage,
    handleReleasePage: setReleasePage,
    handleReleaseRows: (rows: number) => {
      setReleaseRowsPerPage(rows);
      setReleasePage(0);
    },
    setPreset: (value: AdminDatePreset) => {
      resetReleasePage();
      detail.setPreset(value);
    },
    setFrom: (value: string) => {
      resetReleasePage();
      detail.setFrom(value);
    },
    setTo: (value: string) => {
      resetReleasePage();
      detail.setTo(value);
    },
  };
};

export const useAdminActivitiesHelper = () =>
  usePagedList<AdminActivityRow>(apiRoutes.AdminActivities);
