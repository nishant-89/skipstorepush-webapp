import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootReducerType, RootState } from "src/redux/rootReducers";

import { fetchAllAppRequest, handleRefresh } from "../redux/slices/allApp";
import { handleEnvironment } from "../redux/slices/release";

export const useAllAppsHelper = () => {
  const dispatch = useDispatch();
  // Redux state selectors
  const { filteredData, loading, isRefresh, count } = useSelector(
    (state: RootState) => state?.allApps
  );

  const { user } = useSelector((state: RootReducerType) => state.auth);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isRedIndicator, setIsRedIndicator] = useState<boolean>(false);
  const handleOpenDrawer = () => setIsDrawerOpen(true);
  const handleCloseDrawer = () => setIsDrawerOpen(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [term, setTerm] = useState("");
  const [mainPage, setMainPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);

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

  //hide show filter
  const shouldShowSearchAndFilter = () => {
    return !(
      selectedFilters?.length === 0 &&
      !searchTerm?.trim() &&
      filteredData?.length === 0
    );
  };

  const showFilter = shouldShowSearchAndFilter();

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
  };
};
