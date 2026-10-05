import { Drawer, FormControlLabel, Radio, RadioGroup } from "@mui/material";
import { Formik, Form } from "formik";
import InputField from "src/components/common/InputField/InputField";
import ButtonComp from "src/components/common/Button/Button";
import {
  CloseImageIcon,
  DrawerCloseIcon,
  ImageUploadIcon,
  ProfileImageIcon,
} from "src/utils/common/constants/constants";

import { validationSchema } from "./constant";
import { useAllAppsHelper } from "./helper";
import { AppDetailItem } from "../../types";

import "./addAppDrawer.scss";

interface AddAppDrawerProps {
  open: boolean;
  onClose: () => void;
  editMode: boolean;
  appDetail?: AppDetailItem;
}

const AddAppDrawer = ({
  open,
  onClose,
  editMode,
  appDetail,
}: AddAppDrawerProps): JSX.Element => {
  const {
    uploadedImage,
    handleRemoveImage,
    handleImageChange,
    handleUploadClick,
    handleDrawerClose,
    fileInputRef,
    formRef,
    handleSubmit,
    initial,
    handleFile,
  } = useAllAppsHelper({ onClose, appDetail, editMode });

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={handleDrawerClose}
      className="customDrawerBackdrop"
      slotProps={{
        paper: {
          className: "addAppDrawerPaper",
        },
      }}
    >
      <div className="appSheet AddAppDrawerWrapper">
        <header className="appSheetHead">
          <div>
            <p className="appSheetKicker">
              {editMode ? "App settings" : "Create"}
            </p>
            <h2 className="appSheetTitle">
              {editMode ? "Edit App" : "Add New App"}
            </h2>
          </div>
          <button
            className="appSheetClose"
            type="button"
            onClick={handleDrawerClose}
            aria-label="Close Drawer"
            data-testid="add-app"
          >
            <img src={DrawerCloseIcon} alt="" />
          </button>
        </header>

        <Formik
          initialValues={initial}
          validationSchema={validationSchema}
          onSubmit={(values) => handleSubmit(values)}
          enableReinitialize
          innerRef={(instance) => {
            if (instance) {
              formRef.current = instance;
            }
          }}
        >
          {({
            values,
            errors,
            touched,
            setFieldValue,
            handleBlur,
            handleChange,
            isValid,
            dirty,
          }) => (
            <Form className="appSheetForm">
              <div className="appSheetBody">
                <p className="appSheetLead">
                  {editMode
                    ? "Update the name or icon. The operating system stays the same."
                    : "iOS and Android are separate apps. Staging and Production keys are created after you save."}
                </p>

                <div className="sheetField">
                  <h3 className="sheetLabel">Operating System</h3>
                  {editMode ? (
                    <p className="osLocked">
                      {values.platform === "ANDROID" ? "Android" : "iOS"}
                    </p>
                  ) : (
                    <div className="osCardGroup">
                      <RadioGroup
                        aria-label="platform"
                        name="platform"
                        value={values.platform}
                        onChange={handleChange}
                      >
                        <FormControlLabel
                          className={`osCard ${values.platform === "ANDROID" ? "isActive" : ""}`}
                          value="ANDROID"
                          control={<Radio />}
                          label="Android"
                        />
                        <FormControlLabel
                          className={`osCard ${values.platform === "IOS" ? "isActive" : ""}`}
                          value="IOS"
                          control={<Radio />}
                          label="iOS"
                        />
                      </RadioGroup>
                      {errors.platform && touched.platform && (
                        <p className="errorMsg">{errors.platform}</p>
                      )}
                    </div>
                  )}
                </div>

                <div className="sheetField">
                  <InputField
                    type="text"
                    value={values.name}
                    onChange={(e) => {
                      const noSpaces = e?.target?.value?.replace(/^\s+/, "");
                      setFieldValue("name", noSpaces);
                    }}
                    placeholder="Enter App Name"
                    label="App Name"
                    name="name"
                    onBlur={handleBlur}
                  />
                  {errors?.name && touched?.name && (
                    <p className="errorMsg">{errors.name}</p>
                  )}
                </div>

                <div className="sheetField">
                  <p className="sheetLabel">Add Icon (Optional)</p>
                  <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={handleImageChange}
                    style={{ display: "none" }}
                  />

                  {!uploadedImage && (
                    <button
                      type="button"
                      className="fileUpload"
                      onClick={handleUploadClick}
                      tabIndex={0}
                      onKeyDown={handleUploadClick}
                      onDragOver={(e) => {
                        e.preventDefault();
                      }}
                      onDrop={(e) => {
                        e.preventDefault();
                        const file = e?.dataTransfer?.files?.[0];
                        if (file) handleFile(file);
                      }}
                    >
                      <div className="imgBox">
                        <img src={ImageUploadIcon} alt="" />
                        <p>
                          <span className="boldtxt">Click To Upload</span> or
                          drag and drop
                        </p>
                        <p className="uploadHint">PNG, JPG or SVG · max 10 MB</p>
                      </div>
                    </button>
                  )}
                  {uploadedImage && (
                    <figure className="fileUploaded">
                      <button
                        type="button"
                        className="CloseIcon"
                        onClick={handleRemoveImage}
                        aria-label="Remove Image"
                      >
                        <img src={CloseImageIcon} alt="" />
                      </button>
                      <img
                        className="profileImage"
                        src={uploadedImage ?? ProfileImageIcon}
                        alt="Uploaded Icon"
                      />
                    </figure>
                  )}
                </div>
              </div>

              <div className="appSheetFoot">
                <ButtonComp
                  type="submit"
                  label="Save"
                  variant="contained"
                  disabled={
                    editMode
                      ? !(isValid && dirty) &&
                        uploadedImage === appDetail?.appIcon
                      : !(isValid && dirty)
                  }
                />
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </Drawer>
  );
};

export default AddAppDrawer;
