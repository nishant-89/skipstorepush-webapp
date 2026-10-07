import { useState } from "react";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { FormikHelpers } from "formik";
import * as Yup from "yup";
import { postDataApi } from "src/apis/api";
import { setLoading } from "src/redux/slices/globalSlice";
import { showAlert } from "src/utils/alert";
import { apiRoutes, getErrorMessage } from "src/utils/common/constants/constants";
import ROUTES from "src/routes/routesPaths";

export const PENDING_RESET_EMAIL_KEY = "skipstore_pending_reset_email";

export type ForgotEmailValues = {
  email: string;
};

export type ResetPasswordValues = {
  otp: string;
  newPassword: string;
  confirmPassword: string;
};

export const forgotEmailInitialValues: ForgotEmailValues = {
  email: "",
};

export const resetPasswordInitialValues: ResetPasswordValues = {
  otp: "",
  newPassword: "",
  confirmPassword: "",
};

export const forgotEmailValidationSchema = Yup.object({
  email: Yup.string()
    .email("Enter a valid email")
    .required("Email is required"),
});

export const resetPasswordValidationSchema = Yup.object({
  otp: Yup.string()
    .matches(/^\d{6}$/, "Enter the 6-digit code")
    .required("OTP is required"),
  newPassword: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("New password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("newPassword")], "Passwords must match")
    .required("Confirm password is required"),
});

type ApiMessageResponse = {
  success: boolean;
  message?: string;
};

const emailFromLocationState = (state: unknown) =>
  state && typeof state === "object" && "email" in state
    ? String((state as { email?: string }).email || "").trim()
    : "";

export const useForgotPasswordHelper = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const storedEmail =
    typeof window !== "undefined"
      ? sessionStorage.getItem(PENDING_RESET_EMAIL_KEY) || ""
      : "";
  const [step, setStep] = useState<"email" | "reset">(
    storedEmail ? "reset" : "email"
  );
  const [pendingEmail, setPendingEmail] = useState(storedEmail);
  const [savedEmail, setSavedEmail] = useState(
    storedEmail || emailFromLocationState(location.state)
  );
  const [otpNonce, setOtpNonce] = useState(0);

  const persistPendingEmail = (email: string) => {
    sessionStorage.setItem(PENDING_RESET_EMAIL_KEY, email);
    setPendingEmail(email);
    setSavedEmail(email);
    setStep("reset");
  };

  const handleRequestOtp = async (
    values: ForgotEmailValues,
    _helpers: FormikHelpers<ForgotEmailValues>
  ) => {
    try {
      dispatch(setLoading(true));
      const email = values.email.trim();
      const response = (await postDataApi({
        path: apiRoutes.ForgotPassword,
        data: { email },
      })) as ApiMessageResponse;

      if (response?.success) {
        showAlert(1, response.message || "OTP sent successfully.");
        setOtpNonce(0);
        persistPendingEmail(email);
      }
    } catch (error) {
      showAlert(2, getErrorMessage(error));
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleResetPassword = async (
    values: ResetPasswordValues,
    helpers: FormikHelpers<ResetPasswordValues>
  ) => {
    try {
      dispatch(setLoading(true));
      const response = (await postDataApi({
        path: apiRoutes.ForgotPasswordVerify,
        data: {
          email: pendingEmail,
          otp: Number(values.otp),
          newPassword: values.newPassword,
        },
      })) as ApiMessageResponse;

      if (response?.success) {
        showAlert(1, response.message || "Password reset successfully");
        helpers.resetForm();
        sessionStorage.removeItem(PENDING_RESET_EMAIL_KEY);
        navigate(ROUTES.LOGIN, { state: { email: pendingEmail } });
      }
    } catch (error) {
      showAlert(2, getErrorMessage(error));
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleResendOtp = async () => {
    if (!pendingEmail) {
      return;
    }
    try {
      dispatch(setLoading(true));
      const response = (await postDataApi({
        path: apiRoutes.ForgotPasswordResend,
        data: { email: pendingEmail },
      })) as ApiMessageResponse;

      if (response?.success) {
        showAlert(1, response.message || "OTP sent successfully.");
        setOtpNonce((current) => current + 1);
      }
    } catch (error) {
      showAlert(2, getErrorMessage(error));
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleUseDifferentEmail = () => {
    sessionStorage.removeItem(PENDING_RESET_EMAIL_KEY);
    setPendingEmail("");
    setSavedEmail("");
    setStep("email");
  };

  return {
    step,
    pendingEmail,
    savedEmail,
    otpNonce,
    handleRequestOtp,
    handleResetPassword,
    handleResendOtp,
    handleUseDifferentEmail,
  };
};
