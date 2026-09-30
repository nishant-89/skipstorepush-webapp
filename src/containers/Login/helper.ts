import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { FormikHelpers } from "formik";
import * as Yup from "yup";
import { postDataApi } from "src/apis/api";
import {
  fetchAuthenticateToken,
  fetchAuthenticateTokenSuccess,
} from "src/containers/redux/slices/auth";
import { AuthResponse } from "src/containers/redux/types/types";
import { setLoading } from "src/redux/slices/globalSlice";
import { showAlert } from "src/utils/alert";
import { apiRoutes, getErrorMessage } from "src/utils/common/constants/constants";
import { Redirect } from "./constant";
import ROUTES from "src/routes/routesPaths";

export type LoginFormValues = {
  email: string;
  password: string;
};

export const loginInitialValues: LoginFormValues = {
  email: "",
  password: "",
};

export const loginValidationSchema = Yup.object({
  email: Yup.string()
    .email("Enter a valid email")
    .required("Email is required"),
  password: Yup.string().required("Password is required"),
});

export const useLoginHelper = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const routerLocation = useLocation();
  const prefilledEmail =
    routerLocation.state &&
    typeof routerLocation.state === "object" &&
    "email" in routerLocation.state
      ? String((routerLocation.state as { email?: string }).email || "")
      : "";
  const loginFormValues: LoginFormValues = {
    email: prefilledEmail,
    password: "",
  };

  const params = new URLSearchParams(location.search);
  const codeParam = params.get("code");

  const CLIENT_ID = process.env.VITE_CLIENT_ID;
  const REDIRECT_URI = process.env.VITE_REDIRECT_URI;

  useEffect(() => {
    if (codeParam) {
      dispatch(setLoading(true));
      dispatch(
        fetchAuthenticateToken({
          code: codeParam,
        })
      );
    }
  }, []);

  const handleClick = () => {
    window.location.assign(
      `${Redirect.github}${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=${encodeURIComponent("user:email")}`
    );
  };

  const handleEmailLogin = async (
    values: LoginFormValues,
    helpers: FormikHelpers<LoginFormValues>
  ) => {
    try {
      dispatch(setLoading(true));
      const response = (await postDataApi({
        path: apiRoutes.BasicLogin,
        data: {
          email: values.email.trim(),
          password: values.password,
        },
      })) as AuthResponse;

      if (response?.success) {
        showAlert(1, response.message || "Successfully logged in");
        helpers.resetForm();
        dispatch(
          fetchAuthenticateTokenSuccess({
            accessToken: response.data.userAuthToken,
            user: response.data.userData,
          })
        );
      }
    } catch (error) {
      showAlert(2, getErrorMessage(error));
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleForgotPassword = (email?: string) => {
    navigate(ROUTES.FORGOT_PASSWORD, {
      state: { email: email?.trim() || "" },
    });
  };

  return {
    handleClick,
    handleEmailLogin,
    handleForgotPassword,
    loginFormValues,
  };
};
