import { Formik } from "formik";
import { Link } from "react-router-dom";
import ButtonComp from "src/components/common/Button/Button";
import InputField from "src/components/common/InputField/InputField";
import OtpInput from "src/components/common/OtpInput/OtpInput";
import ROUTES from "src/routes/routesPaths";
import AuthLayout from "src/containers/Login/authLayout";
import {
  forgotEmailValidationSchema,
  resetPasswordInitialValues,
  resetPasswordValidationSchema,
  useForgotPasswordHelper,
} from "./helper";
import "src/containers/Login/login.scss";

const OTP_LENGTH = 6;

const ForgotPassword = () => {
  const {
    step,
    pendingEmail,
    savedEmail,
    otpNonce,
    handleRequestOtp,
    handleResetPassword,
    handleResendOtp,
    handleUseDifferentEmail,
  } = useForgotPasswordHelper();

  if (step === "reset") {
    return (
      <AuthLayout
        title="Reset password"
        description={
          <>
            Enter the 6-digit code sent to <strong>{pendingEmail}</strong> and
            choose a new password.
          </>
        }
      >
        <Formik
          key={otpNonce}
          initialValues={resetPasswordInitialValues}
          validationSchema={resetPasswordValidationSchema}
          onSubmit={handleResetPassword}
        >
          {({
            values,
            errors,
            touched,
            submitCount,
            setFieldValue,
            setFieldTouched,
            handleChange,
            handleBlur,
            handleSubmit,
            isValid,
          }) => {
            const showOtpErrors = Boolean(touched.otp || submitCount > 0);
            const errorIndexes = Array.from(
              { length: OTP_LENGTH },
              (_, index) => showOtpErrors && !/\d/.test(values.otp[index] || "")
            );
            const isOtpComplete = /^\d{6}$/.test(values.otp);

            return (
              <form className="authForm" onSubmit={handleSubmit}>
                <label className="otpLabel">One-time code</label>
                <OtpInput
                  value={values.otp}
                  onChange={(nextValue) => setFieldValue("otp", nextValue)}
                  onBlur={() => setFieldTouched("otp", true)}
                  errorIndexes={errorIndexes}
                />
                <div className="fieldErrorSlot">
                  {showOtpErrors && errors.otp ? (
                    <p className="fieldError">{errors.otp}</p>
                  ) : null}
                </div>
                <InputField
                  type="password"
                  name="newPassword"
                  label="New password"
                  placeholder="At least 6 characters"
                  value={values.newPassword}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  autoComplete="new-password"
                  showPasswordToggle
                  error={Boolean(touched.newPassword && errors.newPassword)}
                />
                {touched.newPassword && errors.newPassword ? (
                  <p className="fieldError">{errors.newPassword}</p>
                ) : null}
                <InputField
                  type="password"
                  name="confirmPassword"
                  label="Confirm password"
                  placeholder="Confirm password"
                  value={values.confirmPassword}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  autoComplete="new-password"
                  showPasswordToggle
                  error={Boolean(
                    touched.confirmPassword && errors.confirmPassword
                  )}
                />
                {touched.confirmPassword && errors.confirmPassword ? (
                  <p className="fieldError">{errors.confirmPassword}</p>
                ) : null}
                <ButtonComp
                  type="submit"
                  className="primaryAuthButton"
                  variant="contained"
                  label="Reset password"
                  disabled={!isOtpComplete || !isValid}
                />
              </form>
            );
          }}
        </Formik>
        <p className="authSwitch">
          Didn’t get a code?{" "}
          <button
            type="button"
            className="textLinkBtn"
            onClick={handleResendOtp}
          >
            Resend OTP
          </button>
        </p>
        <p className="authSwitch">
          <button
            type="button"
            className="textLinkBtn"
            onClick={handleUseDifferentEmail}
          >
            Use a different email
          </button>
        </p>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Forgot password"
      description="Enter your email and we’ll send a one-time code to reset your password."
    >
      <Formik
        initialValues={{ email: savedEmail }}
        enableReinitialize
        validationSchema={forgotEmailValidationSchema}
        validateOnMount
        onSubmit={handleRequestOtp}
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          handleSubmit,
          isValid,
        }) => (
          <form className="authForm" onSubmit={handleSubmit}>
            <InputField
              type="email"
              name="email"
              label="Email"
              placeholder="you@example.com"
              value={values.email}
              onChange={handleChange}
              onBlur={handleBlur}
              autoComplete="email"
              error={Boolean(touched.email && errors.email)}
            />
            {touched.email && errors.email ? (
              <p className="fieldError">{errors.email}</p>
            ) : null}
            <ButtonComp
              type="submit"
              className="primaryAuthButton"
              variant="contained"
              label="Send code"
              disabled={!isValid}
            />
          </form>
        )}
      </Formik>
      <p className="authSwitch">
        Remembered your password? <Link to={ROUTES.LOGIN}>Sign in</Link>
      </p>
    </AuthLayout>
  );
};

export default ForgotPassword;
