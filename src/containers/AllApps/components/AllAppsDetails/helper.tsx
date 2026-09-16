import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { deleteDataApi, getDataApi, postDataApi } from "src/apis/api";
import {
  fetchReleaseRequest,
  handleRefresh,
  resetReleaseState,
} from "src/containers/redux/slices/release";
import { handleRefresh as handleCollabRefresh } from "src/containers/redux/slices/collaborators";
import { RootState } from "src/redux/rootReducers";
import { apiRoutes, getErrorMessage } from "src/utils/common/constants";
import { showAlert } from "src/utils/alert";
import ROUTES from "src/routes/routesPaths";
import { setLoading } from "src/redux/slices/globalSlice";
import { fetchCollaboratorsRequest } from "src/containers/redux/slices/collaborators";

import {
  ApiResponse,
  AppDetailItem,
  AppDetailResponse,
  EnvApiResponse,
  Environment,
  FilteredEnvironment,
  InviteFormValues,
} from "../../types";
import { getReleaseColumns } from "./column";

export const useAllAppsDetailHelper = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const [value, setValue] = useState(0);
  const releaseColumns = getReleaseColumns(id ?? "");
  const [realeaseLoader, setReleaseLoader] = useState(false);

  // Redux state selectors
  const { filteredData, loading, isRefresh, count, envId } = useSelector(
    (state: RootState) => state?.release
  );

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleOpenDrawer = () => setIsDrawerOpen(true);
  const handleCloseDrawer = () => setIsDrawerOpen(false);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isSettingsDrawerOpen, setIsSettingsDrawerOpen] = useState(false);
  const [invite, setInvite] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [term, setTerm] = useState("");
  const [mainPage, setMainPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedFilters, setSelectedFilters] = useState<string>("");
  const [envList, setEnvList] = useState<FilteredEnvironment[]>([]);
  const [appDetail, setAppDetail] = useState<AppDetailItem>(
    {} as AppDetailItem
  );

  // collaborator state
  const [mainPageCollab, setMainPageCollab] = useState(0);
  const [rowsPerPageCollab, setRowsPerPageCollab] = useState(10);

  const [delCollab, setDelCollab] = useState(false);
  const [email, setEmail] = useState("");

  const {
    filteredData: filteredDataCollab,
    loading: loadingCollab,
    isRefresh: isRefreshCollab,
    count: countCollab,
  } = useSelector((state: RootState) => state?.collabrators);

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  // handle edit button
  const handleEditButtonClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  //open confimation modal
  const handleDeleteClick = () => {
    setIsDeleteModalOpen(true);
    handleCloseMenu();
  };

  //handle setting drawer
  const handleSettingsClick = () => {
    setIsSettingsDrawerOpen(true);
    handleCloseMenu();
  };

  const open = Boolean(anchorEl);

  //fetch releases
  useEffect(() => {
    if (id && selectedFilters) {
      dispatch(
        fetchReleaseRequest({
          appId: id,
          page: mainPage + 1,
          limit: rowsPerPage,
          search: searchTerm?.trim(),
          type: selectedFilters,
        })
      );
    }
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

  //hide and show filter
  const shouldShowSearchAndFilter = () => {
    return !(!searchTerm?.trim() && filteredData?.length === 0);
  };

  const showFilter = shouldShowSearchAndFilter();

  // get environments
  const getEnvironments = async () => {
    try {
      const res: EnvApiResponse = (await getDataApi({
        path: `${apiRoutes.Environments}?appId=${id}`,
      })) as EnvApiResponse;

      if (res?.statusCode === 200 && res?.data?.length > 0) {
        const filteredEnv =
          res?.data && res?.data?.length > 0
            ? res?.data?.map((item: Environment) => ({
                value: item.id,
                label: item?.name,
                key: item?.key,
              }))
            : [];
        setEnvList(filteredEnv);
        if (envId) {
          setSelectedFilters(envId);
        } else {
          const prodEnv = filteredEnv.find((env) => env.label === "Staging");
          setSelectedFilters(prodEnv?.value ?? "");
        }
      }
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      showAlert(2, errorMessage ?? "Error");
    }
  };

  // get app detail
  const getAppDetail = async () => {
    try {
      setReleaseLoader(true);
      const res: AppDetailResponse = (await getDataApi({
        path: `${apiRoutes.AppDetail}/${id}`,
      })) as AppDetailResponse;

      if (res?.statusCode === 200) {
        setReleaseLoader(false);
        setAppDetail(res?.data);
      }
    } catch (error) {
      setReleaseLoader(false);
      const errorMessage = getErrorMessage(error);
      showAlert(2, errorMessage ?? "Error");
    }
  };

  useEffect(() => {
    id && getAppDetail();
  }, [isRefresh]);

  useEffect(() => {
    id && getEnvironments();

    return () => {
      dispatch(resetReleaseState());
    };
  }, []);

  // handle app delete
  const handleDelete = async () => {
    try {
      dispatch(setLoading(true));
      const res: ApiResponse = (await deleteDataApi({
        path: `${apiRoutes.DeleteApp}/${id}`,
      })) as ApiResponse;

      if (res?.statusCode === 200) {
        setIsDeleteModalOpen(false);
        showAlert(1, res?.message);
        navigate(ROUTES.ALL_APPS);
        dispatch(setLoading(false));
      }
    } catch (error) {
      dispatch(setLoading(false));
      const errorMessage = getErrorMessage(error);
      showAlert(2, errorMessage ?? "Error");
    }
  };

  // collaborators section
  useEffect(() => {
    id &&
      dispatch(
        fetchCollaboratorsRequest({
          page: mainPageCollab + 1,
          limit: rowsPerPageCollab,
          appId: id,
        })
      );
  }, [mainPageCollab, rowsPerPageCollab, isRefreshCollab]);

  // Handles Pagination
  const handleCollabChangePage = (newPage: number) => {
    setMainPageCollab(newPage);
  };

  // Handles Rows Per Page Change
  const handleCollabChangeRowsPerPage = (newRowsPerPage: number) => {
    setMainPageCollab(0);
    setRowsPerPageCollab(newRowsPerPage);
  };

  //send invite to collaborator
  const handleInvite = async (values: InviteFormValues) => {
    dispatch(setLoading(true));
    try {
      let payload = {
        email: values?.email.trim(),
        appId: id,
      };

      const res: ApiResponse = (await postDataApi({
        path: `${apiRoutes.SendInvite}`,
        data: payload,
      })) as ApiResponse;

      if (res?.statusCode === 200) {
        dispatch(setLoading(false));
        setInvite(false);
        dispatch(handleCollabRefresh(!isRefreshCollab));
        showAlert(1, res?.message);
      }
    } catch (error) {
      dispatch(setLoading(false));
      const errorMessage = getErrorMessage(error);
      showAlert(2, errorMessage);
    }
  };

  //handle collab model
  const handleCollabModel = (value: string) => {
    setDelCollab(true);
    setEmail(value);
  };

  //delete collab
  const handleDeleteCollab = async () => {
    try {
      if (email && id) {
        const encodedEmail = encodeURIComponent(email);
        dispatch(setLoading(true));
        const res: ApiResponse = (await deleteDataApi({
          path: `${apiRoutes.DeleteCollab}?appId=${id}&email=${encodedEmail}`,
        })) as ApiResponse;

        if (res?.statusCode === 200) {
          dispatch(handleCollabRefresh(!isRefreshCollab));
          mainPageCollab === 0
            ? dispatch(handleCollabRefresh(!isRefreshCollab))
            : setMainPageCollab(0);
          setEmail("");
          setDelCollab(false);
          showAlert(1, res?.message);
          dispatch(setLoading(false));
        }
      }
    } catch (error) {
      dispatch(setLoading(false));
      setDelCollab(false);
      setEmail("");
      const errorMessage = getErrorMessage(error);
      showAlert(2, errorMessage ?? "Error");
    }
  };

  return {
    isDrawerOpen,
    isDeleteModalOpen,
    isSettingsDrawerOpen,
    value,
    open,
    anchorEl,
    handleEditButtonClick,
    handleDeleteClick,
    handleSettingsClick,
    handleOpenDrawer,
    handleCloseDrawer,
    handleChange,
    handleCloseMenu,
    setIsDeleteModalOpen,
    setIsSettingsDrawerOpen,
    searchTerm,
    filteredData,
    loading,
    count,
    selectedFilters,
    mainPage,
    rowsPerPage,
    setSelectedFilters,
    handleChangePage,
    handleChangeRowsPerPage,
    term,
    setTerm,
    setSearchTerm,
    showFilter,
    envList,
    appDetail,
    handleDelete,
    releaseColumns,
    realeaseLoader,
    invite,
    setInvite,
    mainPageCollab,
    rowsPerPageCollab,
    handleCollabChangePage,
    handleCollabChangeRowsPerPage,
    filteredDataCollab,
    loadingCollab,
    countCollab,
    handleInvite,
    handleCollabModel,
    delCollab,
    setDelCollab,
    handleDeleteCollab,
  };
};
