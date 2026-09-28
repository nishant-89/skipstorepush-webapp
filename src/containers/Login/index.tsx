import { Formik } from "formik";
import { Link } from "react-router-dom";
import { GithubIcon } from "src/utils/common/constants";
import ButtonComp from "src/components/common/Button";
import InputField from "src/components/common/InputField";
import ROUTES from "src/routes/routesPaths";
import AuthLayout from "./authLayout";
import {
  loginValidationSchema,
  useLoginHelper,
} from "./helper";

import "./login.scss";

const LoginComponent = () => {
  const {
    handleClick,
    handleEmailLogin,
    handleForgotPassword,
    loginFormValues,
  } = useLoginHelper();

  return (
    <AuthLayout
      title="Sign in"
      description="Use your email and password, or continue with GitHub."
    >
      <Formik
        initialValues={loginFormValues}
        enableReinitialize
        validationSchema={loginValidationSchema}
        onSubmit={handleEmailLogin}
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
              placeholder="Password"
              value={values.password}
              onChange={handleChange}
              onBlur={handleBlur}
              autoComplete="current-password"
              showPasswordToggle
              error={Boolean(touched.password && errors.password)}
            />
            {touched.password && errors.password ? (
              <p className="fieldError">{errors.password}</p>
            ) : null}
            <div className="authInlineActions">
              <button
                type="button"
                className="textLinkBtn"
                onClick={handleForgotPassword}
              >
                Forgot password
              </button>
            </div>
            <ButtonComp
              type="submit"
              className="primaryAuthButton"
              variant="contained"
              label="Sign in"
              disabled={!isValid || !dirty}
            />
          </form>
        )}
      </Formik>
      <div className="authDivider">
        <span>or</span>
      </div>
      <div className="buttonSection">
        <ButtonComp
          className="githubButton"
          variant="contained"
          label="Continue with GitHub"
          onClick={handleClick}
          isIcon
          icon={GithubIcon}
        />
      </div>
      <p className="authSwitch">
        New here?{" "}
        <Link to={ROUTES.REGISTER}>Register new user</Link>
      </p>
    </AuthLayout>
  );
};

export default LoginComponent;
