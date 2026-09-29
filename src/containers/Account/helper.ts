import { ChangeEvent, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { postFormDataApi } from "src/apis/api";
import { fetchProfileDataRequest } from "src/containers/redux/slices/profile";
import { setLoading } from "src/redux/slices/globalSlice";
import { RootState } from "src/redux/rootReducers";
import { showAlert } from "src/utils/alert";
import { apiRoutes, getErrorMessage } from "src/utils/common/constants";

export const PROFILE_IMAGE_ACCEPT =
  ".jpg,.jpeg,.png,.gif,.webp,.svg,.bmp,.ico,.avif";
export const MAX_PROFILE_IMAGE_BYTES = 5 * 1024 * 1024;
export const PROFILE_IMAGE_TYPE_ERROR =
  "Only image files are allowed (jpg, jpeg, png, gif, webp, svg, bmp, ico, avif)";
export const PROFILE_IMAGE_SIZE_ERROR =
  "Image file is larger than the size limit of 5 megabytes";

const PROFILE_IMAGE_EXTENSIONS = new Set([
  ".jpg",
  ".jpeg",
  ".png",
  ".gif",
  ".webp",
  ".svg",
  ".bmp",
  ".ico",
  ".avif",
]);

type ProfileImageResponse = {
  success?: boolean;
  statusCode?: number;
  message?: string;
};

export const getProfileImageValidationError = (file: File) => {
  const extension = file.name.includes(".")
    ? file.name.slice(file.name.lastIndexOf(".")).toLowerCase()
    : "";

  if (!PROFILE_IMAGE_EXTENSIONS.has(extension)) {
    return PROFILE_IMAGE_TYPE_ERROR;
  }
  if (file.size > MAX_PROFILE_IMAGE_BYTES) {
    return PROFILE_IMAGE_SIZE_ERROR;
  }
  return null;
};

export const useAccountHelper = () => {
  const dispatch = useDispatch();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { data, loading, error } = useSelector(
    (state: RootState) => state.profile
  );
  const { user } = useSelector((state: RootState) => state.auth);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isAccessKeyModalOpen, setIsAccessKeyModalOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchProfileDataRequest());
  }, [dispatch]);

  const isGithubAuth = data?.authType === "GITHUB";
  const githubProfileUrl = data?.fullName
    ? `https://github.com/${data.fullName}`
    : "";

  const openAccessKeyModal = () => setIsAccessKeyModalOpen(true);
  const closeAccessKeyModal = () => setIsAccessKeyModalOpen(false);
  const openPasswordModal = () => setIsPasswordModalOpen(true);
  const closePasswordModal = () => setIsPasswordModalOpen(false);
  const openProfileImagePicker = () => fileInputRef.current?.click();

  const handleProfileImageChange = async (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) {
      return;
    }

    const validationError = getProfileImageValidationError(file);
    if (validationError) {
      showAlert(2, validationError);
      return;
    }

    try {
      dispatch(setLoading(true));
      const formData = new FormData();
      formData.append("file", file);
      const response = (await postFormDataApi({
        path: apiRoutes.UpdateProfileImage,
        data: formData,
      })) as ProfileImageResponse;

      if (response?.success) {
        showAlert(1, response.message || "Profile image updated successfully");
        dispatch(fetchProfileDataRequest());
      }
    } catch (uploadError) {
      showAlert(2, getErrorMessage(uploadError));
    } finally {
      dispatch(setLoading(false));
    }
  };

  return {
    data,
    loading,
    error,
    accessKey: user?.accessKey || "",
    isGithubAuth,
    githubProfileUrl,
    isPasswordModalOpen,
    isAccessKeyModalOpen,
    fileInputRef,
    openAccessKeyModal,
    closeAccessKeyModal,
    openPasswordModal,
    closePasswordModal,
    openProfileImagePicker,
    handleProfileImageChange,
  };
};
