import { Drawer, FormControlLabel, Radio, RadioGroup } from "@mui/material";
import { Formik, Form } from "formik";
import InputField from "src/components/common/InputField";
import ButtonComp from "src/components/common/Button";
import {
  CloseImageIcon,
  DrawerCloseIcon,
  ImageUploadIcon,
  ProfileImageIcon,
} from "src/utils/common/constants";

import { validationSchema } from "./constant";
import { useAllAppsHelper } from "./helper";
import { AppDetailItem } from "../../types";

import "./addAppDrawer.scss";
import "../../../../scss/reset.scss";

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
      <div className="AddAppDrawerWrapper">
        <div className="DrawerHeader">
          <h2 className="drawerTitle">
            {editMode ? "Edit App" : "Add New App"}
          </h2>
          <button
            className="closeDrawerButton"
            type="button"
            onClick={handleDrawerClose}
            aria-label="Close Drawer"
            data-testid="add-app"
          >
            <img src={DrawerCloseIcon} alt="Close Drawer" />
          </button>
        </div>

        {/* add/edit app form section */}
        <div className="DrawerBodyWrapper">
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
              <Form>
                <p className="drawerDescription">
                  {`Please ${editMode ? "edit" : "enter"} the information for your new React Native application`}
                </p>

                <div className="tabSelectSection">
                  <h3 className="tabTitle">Operating System</h3>
                  {editMode ? (
                    <p>{values.platform === "ANDROID" ? "Android" : "iOS"}</p>
                  ) : (
                    <div className="radioGroupWrapper">
                      <RadioGroup
                        aria-label="platform"
                        name="platform"
                        value={values.platform}
                        onChange={handleChange}
                      >
                        <FormControlLabel
                          className="radioWrapper"
                          value="ANDROID"
                          control={<Radio />}
                          label="Android"
                        />
                        <FormControlLabel
                          className="radioWrapper"
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

                <div className="tabContentWrapper">
                  <div className="customInputWrapper">
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

                  <div className="iconUploadMainWrapper">
                    <p className="label">Add Icon (Optional)</p>

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
                          e.preventDefault(); // Required to allow drop
                        }}
                        onDrop={(e) => {
                          e.preventDefault();
                          const file = e?.dataTransfer?.files?.[0];
                          if (file) handleFile(file);
                        }}
                      >
                        <div className="imgBox">
                          <img src={ImageUploadIcon} alt="Upload" />
                          <p>
                            <span className="boldtxt">Click To Upload</span> or
                            drag and drop
                          </p>
                          <ul className="listBox">
                            <li>Max file size should be 10mb</li>
                          </ul>
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
                          <img src={CloseImageIcon} alt="Remove Icon" />
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

                <div className="buttonWrapper">
                  <ButtonComp
                    type="submit"
                    label={editMode ? "Save Changes" : "Save"}
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
      </div>
    </Drawer>
  );
};

export default AddAppDrawer;
