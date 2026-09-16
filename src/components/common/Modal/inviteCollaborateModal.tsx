import { Modal, Button } from "@mui/material";
import { Formik, Form } from "formik";
import InputField from "src/components/common/InputField";
import { InviteCollaboratorIcon } from "src/utils/common/constants";
import { validationSchema } from "src/containers/AllApps/components/AllAppsDetails/constant";
import { InviteFormValues } from "src/containers/AllApps/types";

import "./inviteCollaborateModal.scss";
import "./index.scss";

interface CustomModalProps {
  open: boolean;
  title: string;
  description?: string;
  handleSubmit: (values: InviteFormValues) => void;
  onClose?: () => void;
}

const InviteCollaborateModal = ({
  open,
  title,
  description,
  onClose,
  handleSubmit,
}: CustomModalProps) => {
  const initialValues: InviteFormValues = {
    email: "",
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      className="modalBackdrop"
    >
      <div className="modalBox inviteCollaboratorModalWrappper">
        <div className="modalWrap">
          <div className="textWrap">
            <img src={InviteCollaboratorIcon} alt="Icon" />
            <h2 id="modal-modal-title">{title}</h2>
            {description && <p>{description}</p>}
          </div>

          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={(values) => handleSubmit(values)}
          >
            {({
              values,
              errors,
              touched,
              dirty,
              isValid,
              setFieldValue,
              handleBlur,
            }) => (
              <Form className="formWrapper">
                <div className="customInputWrapper">
                  <InputField
                    type="text"
                    value={values.email}
                    onChange={(e) => setFieldValue("email", e?.target?.value)}
                    placeholder="Enter Email"
                    label="Email Address"
                    name="email"
                    onBlur={handleBlur}
                  />
                  {errors.email && touched.email && (
                    <p className="errorMsg">{errors.email}</p>
                  )}
                </div>

                <div className="buttonArea">
                  <Button variant="outlined" onClick={onClose}>
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={!(isValid && dirty)}
                  >
                    Invite
                  </Button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </Modal>
  );
};

export default InviteCollaborateModal;
