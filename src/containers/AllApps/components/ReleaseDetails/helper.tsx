import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getDataApi, patchDataApi, postDataApi } from "src/apis/api";
import { apiRoutes, getErrorMessage } from "src/utils/common/constants";
import { showAlert } from "src/utils/alert";
import { setLoading } from "src/redux/slices/globalSlice";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "src/redux/rootReducers";

import {
  ApiResponse,
  EnvApiResponse,
  RELEASE_DETAIL_RESPONSE_TYPE,
  RELEASE_RESPONSE_TYPE,
  ReleaseResponse,
  UpdateType,
} from "../../types";

export const useReleaseDetailsHelper = () => {
  const { releaseId } = useParams();
  const dispatch = useDispatch();

  const { loading } = useSelector((state: RootState) => state?.globalState);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [notes, setNotes] = useState("");
  const [pauseModal, setPauseModal] = useState(false);
  const [resumeModal, setResumeModal] = useState(false);
  const [promote, setPromoteModal] = useState(false);
  const [rollbackModal, setRollbackModal] = useState(false);
  const [prodId, setProdId] = useState("");
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const [rolloutModal, setRolloutModal] = useState(false);
  const [releaseLoader, setReleaseLoader] = useState(false);
  const [isSwitchOn, setIsSwitchOn] = useState(false);

  const handleSwitchToggle = (event: React.ChangeEvent<HTMLInputElement>) => {
    handleUpdates("mandatory", event?.target?.checked);
  };

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const [release, setRelease] = useState<RELEASE_RESPONSE_TYPE>(
    {} as RELEASE_RESPONSE_TYPE
  );

  // slider-functionality
  const [value, setValue] = useState<number>(0);

  const handleSliderChange = (_event: any, newValue: number | number[]) => {
    if (release?.rollout !== null && release?.rollout <= Number(newValue)) {
      setValue(newValue as number);
    }
  };

  useEffect(() => {
    releaseId && getRelease();
  }, [releaseId]);

  const handleEditOpen = () => {
    setIsEditModalOpen(true);
  };

  const handleEditClose = () => {
    setIsEditModalOpen(false);
    setNotes(release?.releaseNote);
  };

  // get release info
  const getRelease = async () => {
    setReleaseLoader(true);
    try {
      const res: RELEASE_DETAIL_RESPONSE_TYPE = (await getDataApi({
        path: `${apiRoutes.ReleaseDetail}/${releaseId}`,
      })) as RELEASE_DETAIL_RESPONSE_TYPE;

      if (res?.statusCode === 200) {
        setRelease(res?.data);

        setReleaseLoader(false);
        setNotes(res?.data?.releaseNote);
        getEnvironments(res?.data?.appId);
        setValue(res?.data?.rollout === null ? 100 : res?.data?.rollout);
        setIsSwitchOn(res?.data?.isMandatory);
      }
    } catch (error) {
      setReleaseLoader(false);
      const errorMessage = getErrorMessage(error);
      showAlert(2, errorMessage ?? "Error fetching Data");
    }
  };

  // mandatory and notes handling
  const handleUpdates = async (type: string, isMandatory: boolean = false) => {
    dispatch(setLoading(true));
    try {
      const payload: UpdateType = {
        ...(type === "notes"
          ? { releaseNote: notes }
          : { isMandatory: isMandatory }),
      };

      const res: ReleaseResponse = (await patchDataApi({
        path: `${apiRoutes.ReleaseDetail}/${releaseId}`,
        data: payload,
      })) as ReleaseResponse;
      if (res?.statusCode === 200) {
        type === "notes" && releaseId && getRelease();
        dispatch(setLoading(false));
        type === "notes"
          ? setIsEditModalOpen(false)
          : setIsSwitchOn(isMandatory);
        showAlert(1, res?.message);
      }
    } catch (error) {
      dispatch(setLoading(false));
      const errorMessage = getErrorMessage(error);
      type === "notes" && handleEditClose();
      showAlert(2, errorMessage);
    }
  };

  // pause and resume handling
  const handleAppStatus = async (status: string) => {
    dispatch(setLoading(true));
    try {
      const res: ApiResponse = (await patchDataApi({
        path: `${apiRoutes.ReleaseDetail}/${releaseId}/${status}`,
      })) as ApiResponse;
      if (res?.statusCode === 200) {
        status === "pause" && setPauseModal(false);
        status === "resume" && setResumeModal(false);
        releaseId && getRelease();
        dispatch(setLoading(false));
        showAlert(1, res?.message);
      }
    } catch (error) {
      dispatch(setLoading(false));
      const errorMessage = getErrorMessage(error);
      handleEditClose();
      showAlert(2, errorMessage);
    }
  };

  // roll back handling
  const handleRollback = async () => {
    dispatch(setLoading(true));
    try {
      const res: ApiResponse = (await postDataApi({
        path: `${apiRoutes.RollBack}/${releaseId}`,
      })) as ApiResponse;
      if (res?.statusCode === 200) {
        setRollbackModal(false);
        releaseId && getRelease();
        dispatch(setLoading(false));
        showAlert(1, res?.message);
      }
    } catch (error) {
      dispatch(setLoading(false));
      const errorMessage = getErrorMessage(error);
      handleEditClose();
      showAlert(2, errorMessage);
    }
  };

  // promote handling
  const handlePromote = async () => {
    try {
      if (prodId && release?.appId) {
        dispatch(setLoading(true));
        const payload = {
          appId: release?.appId,
          sourceId: release?.appEnvironment,
          destinationId: prodId,
          releaseVersion: release?.releaseVersion,
        };
        const res: ApiResponse = (await postDataApi({
          path: `${apiRoutes.Promote}`,
          data: payload,
        })) as ApiResponse;
        if (res?.statusCode === 200) {
          setPromoteModal(false);
          releaseId && getRelease();
          dispatch(setLoading(false));
          showAlert(1, res?.message);
        }
      }
    } catch (error) {
      dispatch(setLoading(false));
      const errorMessage = getErrorMessage(error);
      handleEditClose();
      showAlert(2, errorMessage);
    }
  };

  // get environments
  const getEnvironments = async (appId: string) => {
    try {
      const res: EnvApiResponse = (await getDataApi({
        path: `${apiRoutes.Environments}?appId=${appId}`,
      })) as EnvApiResponse;

      if (res?.statusCode === 200 && res?.data?.length > 0) {
        const prodEnv = res?.data.find((env) => env?.name === "Production");
        prodEnv?.id && setProdId(prodEnv?.id);
      }
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      showAlert(2, errorMessage ?? "Error");
    }
  };

  // roll out handling
  const handleRollout = async () => {
    try {
      if (release?.appId) {
        dispatch(setLoading(true));
        const payload = {
          percentage: value,
          releaseVersion: release?.releaseVersion,
        };
        const res: ApiResponse = (await patchDataApi({
          path: `${apiRoutes.Rollout}/${release?.appId}`,
          data: payload,
        })) as ApiResponse;
        if (res?.statusCode === 200) {
          setRolloutModal(false);
          releaseId && getRelease();
          dispatch(setLoading(false));
          showAlert(1, res?.message);
        }
      }
    } catch (error) {
      dispatch(setLoading(false));
      const errorMessage = getErrorMessage(error);
      showAlert(2, errorMessage);
    }
  };

  const getReleasedByLabel = (
    released_by?: RELEASE_RESPONSE_TYPE["released_by"] | null
  ) => {
    if (!released_by) return "N/A";

    const name = released_by?.fullName?.trim();
    const email = released_by?.email?.trim();

    if (name && email) return `${name} (${email})`;
    if (name) return name;
    if (email) return email;
    return "N/A";
  };

  return {
    open,
    anchorEl,
    handleClick,
    handleClose,
    isEditModalOpen,
    handleEditOpen,
    handleEditClose,
    release,
    handlePromote,
    notes,
    setNotes,
    handleUpdates,
    handleAppStatus,
    pauseModal,
    setPauseModal,
    rollbackModal,
    setRollbackModal,
    resumeModal,
    loading,
    releaseLoader,
    setResumeModal,
    promote,
    setPromoteModal,
    getEnvironments,
    value,
    handleSliderChange,
    rolloutModal,
    setRolloutModal,
    handleRollout,
    isSwitchOn,
    handleSwitchToggle,
    handleRollback,
    getReleasedByLabel,
  };
};
