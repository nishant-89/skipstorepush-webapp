import { useRef, useState } from "react";
import { FormikHelpers } from "formik";
import { apiRoutes, getErrorMessage } from "src/utils/common/constants";
import { setLoading } from "src/redux/slices/globalSlice";
import { showAlert } from "src/utils/alert";
import { useDispatch, useSelector } from "react-redux";
import { handleRefresh } from "src/containers/redux/slices/release";
import { RootState } from "src/redux/rootReducers";
import { postDataApi } from "src/apis/api";
import { useParams } from "react-router-dom";

import { AddResponse, FormValues } from "./constant";

interface HelperProps {
  onClose: () => void;
}

export const useReleaseDrawerHelper = ({ onClose }: HelperProps) => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const { isRefresh } = useSelector((state: RootState) => state?.release);
  const formRef = useRef<FormikHelpers<FormValues> | null>(null);
  const [newDeployment, setNewDeployment] = useState(true);

  //handle drawer
  const handleDrawerClose = () => {
    if (formRef.current) {
      formRef.current.resetForm();
    }
    onClose();
    setNewDeployment(true);
  };

  const handleAddNewDeployment = () => setNewDeployment(false);

  //handle add environment
  const handleSubmit = async (values: FormValues) => {
    if (id) {
      dispatch(setLoading(true));
      try {
        let payload = {
          name: values?.name?.trim(),
          appId: id,
        };

        const res: AddResponse = (await postDataApi({
          path: `${apiRoutes.AddEnv}`,
          data: payload,
        })) as AddResponse;
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
    }
  };

  return {
    newDeployment,
    handleAddNewDeployment,
    handleDrawerClose,
    handleSubmit,
  };
};
