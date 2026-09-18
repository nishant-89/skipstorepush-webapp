import { useRef, useCallback, useState, useEffect } from "react";
import { FormikHelpers } from "formik";
import { showAlert } from "src/utils/alert";
import { patchDataApi, postDataApi, postFormDataApi } from "src/apis/api";
import { apiRoutes, getErrorMessage } from "src/utils/common/constants";
import { useDispatch, useSelector } from "react-redux";
import { setLoading } from "src/redux/slices/globalSlice";
import { handleRefresh } from "src/containers/redux/slices/allApp";
import { handleRefresh as handleReleaseRefresh } from "src/containers/redux/slices/release";
import { RootState } from "src/redux/rootReducers";

import { AppResponse, FormValues, initialValues } from "./constant";
import {
  addPayloadType,
  AppDetailItem,
  uploadPayloadType,
  UploadFileResponse,
} from "../../types";

interface HelperProps {
  onClose: () => void;
  appDetail?: AppDetailItem;
  editMode: boolean;
}

export const useAllAppsHelper = ({
  onClose,
  appDetail,
  editMode,
}: HelperProps) => {
  const dispatch = useDispatch();
  const formRef = useRef<FormikHelpers<FormValues> | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [uploadFile, setUploadFile] = useState<
    { name: string; type: string } | File | null
  >(null);
  const { isRefresh } = useSelector((state: RootState) => state?.allApps);
  const { isRefresh: releaseScreen } = useSelector(
    (state: RootState) => state?.release
  );

  const [initial, setInitial] = useState<FormValues>(initialValues);

  //handle drawer close
  const handleDrawerClose = useCallback(() => {
    if (formRef.current) {
      formRef.current.resetForm();
    }
    setUploadedImage(null);
    setUploadFile(null);
    onClose();
  }, [onClose]);

  useEffect(() => {
    if (editMode && appDetail) {
      setInitial({
        platform: appDetail?.osType,
        name: appDetail?.name,
      });

      setUploadedImage(appDetail?.appIcon || null);
    }
  }, [editMode, handleDrawerClose]);

  //handle upload
  const handleUploadClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  //handle file and validations
  const handleFile = (file: File) => {
    const validTypes = [
      "image/jpeg",
      "image/png",
      "image/jpg",
      "image/svg+xml",
    ];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!validTypes.includes(file.type)) {
      showAlert(2, "Unsupported file type.");
      return;
    }

    if (file.size > maxSize) {
      showAlert(2, "File too large. Maximum size is 5MB.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setUploadedImage(reader.result as string);
    };
    reader.readAsDataURL(file);
    setUploadFile(file);
  };

  // handle image change
  const handleImageChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) handleFile(file);
    },
    []
  );
  // handle image remove
  const handleRemoveImage = useCallback(() => {
    setUploadedImage(null);
    setUploadFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, []);

  // handle add/edit app with/without image upload
  const handleSubmit = async (values: FormValues) => {
    dispatch(setLoading(true));
    try {
      if (uploadFile instanceof File) {
        const formData = new FormData();
        formData.append("file", uploadFile);

        const response = (await postFormDataApi({
          path: apiRoutes.UploadLogo,
          data: formData,
        })) as UploadFileResponse;

        if (
          response?.success === true &&
          response?.statusCode === 201 &&
          response?.data?.url
        ) {
          editMode
            ? handleUpdate(values, response.data.url)
            : handleAdd(values, response.data.url);
        } else {
          dispatch(setLoading(false));
        }
      } else {
        editMode ? handleUpdate(values) : handleAdd(values);
      }
    } catch (error) {
      dispatch(setLoading(false));
      const errorMessage = getErrorMessage(error);
      showAlert(2, errorMessage);
    }
  };

  // handle add app
  const handleAdd = async (values: FormValues, previewUrl?: string) => {
    try {
      let payload: addPayloadType = {
        name: values?.name?.trim(),
        osType: values?.platform,
      };

      if (previewUrl) {
        payload = { ...payload, appIcon: previewUrl };
      }

      const res: AppResponse = (await postDataApi({
        path: `${apiRoutes.AddApp}`,
        data: payload,
      })) as AppResponse;
      if (res?.statusCode === 201) {
        dispatch(setLoading(false));
        dispatch(handleRefresh(!isRefresh));
        showAlert(1, res?.message);
        handleDrawerClose();
      }
    } catch (error) {
      dispatch(setLoading(false));
      const errorMessage = getErrorMessage(error);
      showAlert(2, errorMessage);
    }
  };

  // handle edit app
  const handleUpdate = async (values: FormValues, previewUrl?: string) => {
    try {
      let payload: uploadPayloadType = {
        name: values?.name?.trim(),
      };

      if (previewUrl) {
        payload = { ...payload, appIcon: previewUrl };
      } else {
        payload = { ...payload, appIcon: uploadedImage ?? null };
      }

      if(!payload.appIcon){
        payload.appIcon = 'www.google.com/user'
      }

      const res: AppResponse = (await patchDataApi({
        path: `${apiRoutes.UpdateApp}/${appDetail?.id}`,
        data: payload,
      })) as AppResponse;
      if (res?.statusCode === 200) {
        dispatch(setLoading(false));
        dispatch(handleReleaseRefresh(!releaseScreen));
        showAlert(1, res?.message);
        handleDrawerClose();
      }
    } catch (error) {
      dispatch(setLoading(false));
      const errorMessage = getErrorMessage(error);
      showAlert(2, errorMessage);
    }
  };
  return {
    uploadedImage,
    handleRemoveImage,
    handleImageChange,
    handleUploadClick,
    handleDrawerClose,
    fileInputRef,
    formRef,
    handleSubmit,
    initial,
    handleFile,
  };
};
