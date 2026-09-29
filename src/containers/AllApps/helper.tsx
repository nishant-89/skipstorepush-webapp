import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootReducerType, RootState } from "src/redux/rootReducers";

import { fetchAllAppRequest, handleRefresh } from "../redux/slices/allApp";
import { handleEnvironment } from "../redux/slices/release";
import { readSavedAppFilters, writeSavedAppFilters } from "src/utils/savedFilters";

export const osFilterLabel = (value: string) =>
  value === "IOS" ? "iOS" : value === "ANDROID" ? "Android" : value;

export const useAllAppsHelper = () => {
  const dispatch = useDispatch();
  const [savedFilters] = useState(readSavedAppFilters);
  // Redux state selectors
  const { filteredData, loading, isRefresh, count } = useSelector(
    (state: RootState) => state?.allApps
  );

  const { user } = useSelector((state: RootReducerType) => state.auth);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isRedIndicator, setIsRedIndicator] = useState(
    savedFilters.os.length > 0
  );
  const handleOpenDrawer = () => setIsDrawerOpen(true);
  const handleCloseDrawer = () => setIsDrawerOpen(false);
  const [searchTerm, setSearchTerm] = useState(savedFilters.search);
  const [term, setTerm] = useState(savedFilters.search);
  const [mainPage, setMainPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedFilters, setSelectedFilters] = useState<string[]>(
    savedFilters.os
  );

  // handle apps fetch
  useEffect(() => {
    dispatch(
      fetchAllAppRequest({
        page: mainPage + 1,
        limit: rowsPerPage,
        search: searchTerm?.trim(),
        type: selectedFilters,
      })
    );
  }, [mainPage, rowsPerPage, isRefresh]);

  const isFirstRender = useRef(true);
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    mainPage !== 0 ? setMainPage(0) : dispatch(handleRefresh(!isRefresh));
  }, [selectedFilters, searchTerm?.trim()]);

  // Handles Pagination
  const handleChangePage = (newPage: number) => {
    setMainPage(newPage);
  };
  // Handles Rows Per Page Change
  const handleChangeRowsPerPage = (newRowsPerPage: number) => {
    setMainPage(0);
    setRowsPerPage(newRowsPerPage);
  };

  useEffect(() => {
    writeSavedAppFilters({
      os: selectedFilters,
      search: searchTerm.trim(),
    });
  }, [selectedFilters, searchTerm]);

  const clearOsFilter = (value: string) => {
    const next = selectedFilters.filter((item) => item !== value);
    setSelectedFilters(next);
    setIsRedIndicator(next.length > 0);
  };

  const clearAllSavedFilters = () => {
    setSelectedFilters([]);
    setIsRedIndicator(false);
    setSearchTerm("");
    setTerm("");
  };

  const showFilter = true;

  // clear filter env when redirecting from all apps
  useEffect(() => {
    return () => {
      dispatch(handleEnvironment(""));
    };
  });

  return {
    handleOpenDrawer,
    handleCloseDrawer,
    isDrawerOpen,
    filteredData,
    loading,
    setSearchTerm,
    setTerm,
    term,
    searchTerm,
    handleChangePage,
    handleChangeRowsPerPage,
    mainPage,
    rowsPerPage,
    count,
    selectedFilters,
    setSelectedFilters,
    setIsRedIndicator,
    isRedIndicator,
    showFilter,
    user,
    setMainPage,
    clearOsFilter,
    clearAllSavedFilters,
  };
};
