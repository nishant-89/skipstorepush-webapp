import { Formik } from "formik";
import CustomModal from "src/components/common/Modal/Modal";
import InputField from "src/components/common/InputField/InputField";
import {
  passwordInitialValues,
  passwordValidationSchema,
  useChangePasswordHelper,
} from "./changePasswordHelper";

interface ChangePasswordModalProps {
  open: boolean;
  onClose: () => void;
}

const ChangePasswordModal = ({ open, onClose }: ChangePasswordModalProps) => {
  const { handleSubmit } = useChangePasswordHelper(onClose);

  return (
    <Formik
      initialValues={passwordInitialValues}
      validationSchema={passwordValidationSchema}
      onSubmit={handleSubmit}
      enableReinitialize
    >
      {({
        values,
        errors,
        touched,
        handleChange,
        handleBlur,
        handleSubmit: submitForm,
        isValid,
        dirty,
      }) => (
        <CustomModal
          open={open}
          title="Change Password"
          description="Enter your current password and a new password. Other sessions will be signed out; this session stays active."
          actionTitle="Update Password"
          secondaryTitle="Cancel"
          onSubmit={submitForm}
          onSecondaryClick={onClose}
          onClose={onClose}
          isPrimaryButtonDisable={!isValid || !dirty}
          paddingClass
        >
          <div className="changePasswordFields">
            <InputField
              type="password"
              name="currentPassword"
              label="Current password"
              placeholder="Current password"
              value={values.currentPassword}
              onChange={handleChange}
              onBlur={handleBlur}
              error={Boolean(touched.currentPassword && errors.currentPassword)}
            />
            <InputField
              type="password"
              name="newPassword"
              label="New password"
              placeholder="New password"
              value={values.newPassword}
              onChange={handleChange}
              onBlur={handleBlur}
              error={Boolean(touched.newPassword && errors.newPassword)}
            />
            <InputField
              type="password"
              name="confirmPassword"
              label="Confirm password"
              placeholder="Confirm password"
              value={values.confirmPassword}
              onChange={handleChange}
              onBlur={handleBlur}
              error={Boolean(touched.confirmPassword && errors.confirmPassword)}
            />
          </div>
        </CustomModal>
      )}
    </Formik>
  );
};

export default ChangePasswordModal;
