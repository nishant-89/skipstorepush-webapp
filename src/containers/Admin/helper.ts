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
    if (preset === "custom" && (!from || !to)) {
      return;
    }
    if (preset === "custom" && Math.abs(inclusiveDayCount(from, to)) > 92) {
      showAlert(2, "Choose a range of 92 days or fewer.");
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
            preset,
            timezone: browserTimeZone(),
            page: page + 1,
            limit: rowsPerPage,
            ...(preset === "custom" ? { from, to } : {}),
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

export const useAdminCustomerHelper = () => {
  const { id } = useParams();
  const [data, setData] = useState<AdminCustomerDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      if (!id) {
        return;
      }
      try {
        setLoading(true);
        const response = (await getDataApi({
          path: `${apiRoutes.AdminCustomers}/${id}`,
        })) as ApiEnvelope<AdminCustomerDetail>;
        if (response?.success) {
          setData(response.data || null);
        }
      } catch (error) {
        showAlert(2, getErrorMessage(error));
        setData(null);
      } finally {
        setLoading(false);
      }
    };
    void load();
  }, [id]);

  return { data, loading };
};

export const useAdminAppsHelper = () =>
  usePagedList<AdminAppRow>(apiRoutes.AdminApps);

export const useAdminAppHelper = () => {
  const { id } = useParams();
  const [data, setData] = useState<AdminAppDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      if (!id) {
        return;
      }
      try {
        setLoading(true);
        const response = (await getDataApi({
          path: `${apiRoutes.AdminApps}/${id}`,
        })) as ApiEnvelope<AdminAppDetail>;
        if (response?.success) {
          setData(response.data || null);
        }
      } catch (error) {
        showAlert(2, getErrorMessage(error));
        setData(null);
      } finally {
        setLoading(false);
      }
    };
    void load();
  }, [id]);

  return { data, loading };
};

export const useAdminActivitiesHelper = () =>
  usePagedList<AdminActivityRow>(apiRoutes.AdminActivities);
