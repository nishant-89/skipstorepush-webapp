import { Drawer } from "@mui/material";
import { Formik, Form } from "formik";
import { showAlert } from "src/utils/alert";
import InputField from "src/components/common/InputField";
import ButtonComp from "src/components/common/Button";
import {
  CopyIcon,
  DrawerCloseIcon,
  // RemoveIcon,
} from "src/utils/common/constants";

import { initialValues, validationSchema } from "./constant";
import { useReleaseDrawerHelper } from "./helper";
import { FilteredEnvironment } from "../../types";

import "./releaseDrawer.scss";

interface ReleaseDrawerProps {
  open: boolean;
  onClose: () => void;
  envList: FilteredEnvironment[];
}

const ReleaseDrawer = ({ open, onClose, envList }: ReleaseDrawerProps) => {
  const {
    // newDeployment,
    // handleAddNewDeployment,
    handleDrawerClose,
    handleSubmit,
  } = useReleaseDrawerHelper({ onClose });
  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={handleDrawerClose}
      className="customDrawerBackdrop"
      slotProps={{
        paper: {
          className: "ReleaseDrawerPaper",
        },
      }}
    >
      <div className="ReleaseDrawerWrapper">
        <div className="DrawerHeader">
          <h2 className="drawerTitle">Manage Deployments</h2>
          <button
            className="closeDrawerButton"
            type="button"
            onClick={handleDrawerClose}
            aria-label="Close Drawer"
          >
            <img src={DrawerCloseIcon} alt="Close Drawer" />
          </button>
        </div>
        {/* handle form */}
        <div className="DrawerBodyWrapper">
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={(values) => handleSubmit(values)}
          >
            {(
              {
                // values,
                // errors,
                // touched,
                // isValid,
                // dirty,
                // setFieldValue,
                // handleBlur,
              }
            ) => (
              <Form>
                <div className="formWrapper">
                  {envList?.length > 0 &&
                    envList?.map((env) => (
                      <div className="contentBodySection" key={env?.value}>
                        <h3 className="labelTxt">{env?.label}</h3>
                        <div className="formFieldWrapper">
                          <div className="leftSection">
                            <div className="customInputWrapper">
                              <InputField
                                type="text"
                                value={env?.key}
                                disabled
                              />
                            </div>
                          </div>
                          <div className="rightSection">
                            <ButtonComp
                              className="copyButton"
                              label=""
                              variant="outlined"
                              isIcon
                              icon={CopyIcon}
                              onClick={() => {
                                navigator?.clipboard?.writeText(env?.key);
                                showAlert(
                                  1,
                                  "Key has been copied successfully."
                                );
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  {/* this section is hidden for now */}

                  {/* {!newDeployment ? (
                    <div className="addMoreSection">
                      <div className="leftContent">
                        <div className="customInputWrapper">
                          <InputField
                            type="text"
                            value={values.name}
                            onChange={(e) => {
                              const noSpaces = e?.target?.value?.replace(
                                /^\s+/,
                                ""
                              );
                              setFieldValue("name", noSpaces);
                            }}
                            placeholder="Name"
                            label=""
                            name="name"
                            onBlur={handleBlur}
                          />
                          {errors?.name && touched?.name && (
                            <p className="errorMsg">{errors.name}</p>
                          )}
                        </div>
                      </div>

                      <div className="rightContent">
                        <ButtonComp
                          className="removeButton"
                          label=""
                          variant="outlined"
                          isIcon
                          icon={RemoveIcon}
                          onClick={() => setFieldValue("name", "")}
                        />
                        <ButtonComp
                          className="createButton"
                          label="Create"
                          variant="contained"
                          type="submit"
                          disabled={!(isValid && dirty)}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="buttonWrapper">
                      <ButtonComp
                        type="button"
                        label="Add New Deployment"
                        variant="contained"
                        onClick={handleAddNewDeployment}
                      />
                    </div>
                  )} */}
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </Drawer>
  );
};

export default ReleaseDrawer;
