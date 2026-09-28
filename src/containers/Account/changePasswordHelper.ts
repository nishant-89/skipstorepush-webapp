import { FormikHelpers } from "formik";
import * as Yup from "yup";
import { postDataApi } from "src/apis/api";
import { fetchProfileDataRequest } from "src/containers/redux/slices/profile";
import { setLoading } from "src/redux/slices/globalSlice";
import { useDispatch } from "react-redux";
import { showAlert } from "src/utils/alert";
import { apiRoutes, getErrorMessage } from "src/utils/common/constants";
import { ChangePasswordResponse } from "../redux/types";

export type PasswordFormValues = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

export const passwordInitialValues: PasswordFormValues = {
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
};

export const passwordValidationSchema = Yup.object({
  currentPassword: Yup.string().required("Current password is required"),
  newPassword: Yup.string()
    .min(6, "New password must be at least 6 characters")
    .required("New password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("newPassword")], "Passwords must match")
    .required("Confirm password is required"),
});

export const useChangePasswordHelper = (onClose: () => void) => {
  const dispatch = useDispatch();

  const handleSubmit = async (
    values: PasswordFormValues,
    helpers: FormikHelpers<PasswordFormValues>
  ) => {
    try {
      dispatch(setLoading(true));
      const response = (await postDataApi({
        path: apiRoutes.ChangePassword,
        data: {
          currentPassword: values.currentPassword,
          newPassword: values.newPassword,
        },
      })) as ChangePasswordResponse;

      if (response?.success && response?.statusCode === 200) {
        showAlert(1, response.message || "Password changed successfully");
        helpers.resetForm();
        onClose();
        dispatch(fetchProfileDataRequest());
      }
    } catch (error) {
      showAlert(2, getErrorMessage(error));
    } finally {
      dispatch(setLoading(false));
    }
  };

  return { handleSubmit };
};
