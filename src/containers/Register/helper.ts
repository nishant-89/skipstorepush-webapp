import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FormikHelpers } from "formik";
import * as Yup from "yup";
import { postDataApi } from "src/apis/api";
import { setLoading } from "src/redux/slices/globalSlice";
import { showAlert } from "src/utils/alert";
import { apiRoutes, getErrorMessage } from "src/utils/common/constants/constants";
import ROUTES from "src/routes/routesPaths";

export const PENDING_VERIFY_EMAIL_KEY = "skipstore_pending_verify_email";

export type RegisterFormValues = {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export type OtpFormValues = {
  otp: string;
};

export const registerInitialValues: RegisterFormValues = {
  fullName: "",
  email: "",
  password: "",
  confirmPassword: "",
};

export const otpInitialValues: OtpFormValues = {
  otp: "",
};

export const registerValidationSchema = Yup.object({
  fullName: Yup.string()
    .trim()
    .max(50, "Full name must be 50 characters or less")
    .required("Full name is required"),
  email: Yup.string()
    .email("Enter a valid email")
    .required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords must match")
    .required("Confirm password is required"),
});

export const otpValidationSchema = Yup.object({
  otp: Yup.string()
    .matches(/^\d{6}$/, "Enter the 6-digit code")
    .required("OTP is required"),
});

type ApiMessageResponse = {
  success: boolean;
  message?: string;
};

export const useRegisterHelper = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const storedEmail =
    typeof window !== "undefined"
      ? sessionStorage.getItem(PENDING_VERIFY_EMAIL_KEY) || ""
      : "";
  const [step, setStep] = useState<"form" | "otp">(
    storedEmail ? "otp" : "form"
  );
  const [pendingEmail, setPendingEmail] = useState(storedEmail);
  const [savedFormValues, setSavedFormValues] = useState(registerInitialValues);
  const [otpNonce, setOtpNonce] = useState(0);

  const persistPendingEmail = (email: string) => {
    sessionStorage.setItem(PENDING_VERIFY_EMAIL_KEY, email);
    setPendingEmail(email);
    setStep("otp");
  };

  const handleRegister = async (
    values: RegisterFormValues,
    _helpers: FormikHelpers<RegisterFormValues>
  ) => {
    try {
      dispatch(setLoading(true));
      const response = (await postDataApi({
        path: apiRoutes.Register,
        data: {
          fullName: values.fullName.trim(),
          email: values.email.trim(),
          password: values.password,
        },
      })) as ApiMessageResponse;

      if (response?.success) {
        showAlert(
          1,
          response.message ||
            "User registered successfully. Please verify your email."
        );
        setSavedFormValues(values);
        setOtpNonce(0);
        persistPendingEmail(values.email.trim());
      }
    } catch (error) {
      showAlert(2, getErrorMessage(error));
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleVerifyOtp = async (
    values: OtpFormValues,
    helpers: FormikHelpers<OtpFormValues>
  ) => {
    try {
      dispatch(setLoading(true));
      const response = (await postDataApi({
        path: apiRoutes.VerifyOtp,
        data: {
          email: pendingEmail,
          otp: Number(values.otp),
        },
      })) as ApiMessageResponse;

      if (response?.success) {
        showAlert(1, response.message || "OTP verified successfully.");
        helpers.resetForm();
        sessionStorage.removeItem(PENDING_VERIFY_EMAIL_KEY);
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
        path: apiRoutes.SendOtp,
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
    sessionStorage.removeItem(PENDING_VERIFY_EMAIL_KEY);
    setPendingEmail("");
    setSavedFormValues((current) => ({ ...current, email: "" }));
    setStep("form");
  };

  return {
    step,
    pendingEmail,
    savedFormValues,
    otpNonce,
    handleRegister,
    handleVerifyOtp,
    handleResendOtp,
    handleUseDifferentEmail,
  };
};
