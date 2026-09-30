import { Formik } from "formik";
import { Link } from "react-router-dom";
import ButtonComp from "src/components/common/Button/Button";
import InputField from "src/components/common/InputField/InputField";
import OtpInput from "src/components/common/OtpInput/OtpInput";
import ROUTES from "src/routes/routesPaths";
import AuthLayout from "src/containers/Login/authLayout";
import {
  otpInitialValues,
  otpValidationSchema,
  registerValidationSchema,
  useRegisterHelper,
} from "./helper";
import "src/containers/Login/login.scss";

const OTP_LENGTH = 6;

const Register = () => {
  const {
    step,
    pendingEmail,
    savedFormValues,
    otpNonce,
    handleRegister,
    handleVerifyOtp,
    handleResendOtp,
    handleUseDifferentEmail,
  } = useRegisterHelper();

  if (step === "otp") {
    return (
      <AuthLayout
        title="Verify your email"
        description={
          <>
            Enter the 6-digit code sent to <strong>{pendingEmail}</strong>.
          </>
        }
      >
        <Formik
          key={otpNonce}
          initialValues={otpInitialValues}
          validationSchema={otpValidationSchema}
          onSubmit={handleVerifyOtp}
        >
          {({
            values,
            errors,
            touched,
            submitCount,
            setFieldValue,
            setFieldTouched,
            handleSubmit,
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
                <ButtonComp
                  type="submit"
                  className="primaryAuthButton"
                  variant="contained"
                  label="Verify email"
                  disabled={!isOtpComplete}
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
      title="Create account"
      description="Register with your email. We’ll send a one-time code to verify it."
    >
      <Formik
        initialValues={savedFormValues}
        enableReinitialize
        validationSchema={registerValidationSchema}
        validateOnMount
        onSubmit={handleRegister}
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          handleSubmit,
          isValid,
          dirty,
        }) => (
          <form className="authForm" onSubmit={handleSubmit}>
            <InputField
              type="text"
              name="fullName"
              label="Full name"
              placeholder="Full name"
              value={values.fullName}
              onChange={handleChange}
              onBlur={handleBlur}
              autoComplete="name"
              maxLength={50}
              error={Boolean(touched.fullName && errors.fullName)}
            />
            {touched.fullName && errors.fullName ? (
              <p className="fieldError">{errors.fullName}</p>
            ) : null}
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
            <InputField
              type="password"
              name="password"
              label="Password"
              placeholder="At least 6 characters"
              value={values.password}
              onChange={handleChange}
              onBlur={handleBlur}
              autoComplete="new-password"
              showPasswordToggle
              error={Boolean(touched.password && errors.password)}
            />
            {touched.password && errors.password ? (
              <p className="fieldError">{errors.password}</p>
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
              error={Boolean(touched.confirmPassword && errors.confirmPassword)}
            />
            {touched.confirmPassword && errors.confirmPassword ? (
              <p className="fieldError">{errors.confirmPassword}</p>
            ) : null}
            <ButtonComp
              type="submit"
              className="primaryAuthButton"
              variant="contained"
              label="Register"
              disabled={!isValid || !dirty}
            />
          </form>
        )}
      </Formik>
      <p className="authSwitch">
        Already have an account? <Link to={ROUTES.LOGIN}>Sign in</Link>
      </p>
    </AuthLayout>
  );
};

export default Register;
