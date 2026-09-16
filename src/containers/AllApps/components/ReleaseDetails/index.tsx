import { ActionArrowIcon } from "src/utils/common/constants";
import Breadcrumbs from "src/components/common/BreadCrumbs";
import ButtonComp from "src/components/common/Button";
import EditReleaseModal from "src/components/common/Modal/editReleaseModal";
import { formatDateTime } from "src/utils/common/helpers";
import PauseModal from "src/components/common/Modal/pauseModal";
import RoolbackModal from "src/components/common/Modal/roolbackModal";
import ResumeModal from "src/components/common/Modal/resumeModal";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import PromoteModal from "src/components/common/Modal/promoteModal";
import { Slider, Switch, Tooltip } from "@mui/material";
import RolloutUpdateModal from "src/components/common/Modal/rolloutUpdateModal";
import { showAlert } from "src/utils/alert";

import { ValueLabelComponentProps } from "../../types";
import { useReleaseDetailsHelper } from "./helper";
import { Modal } from "./constant";

import "./ReleaseDetails.scss";

// customise the slider tooltip
const ValueLabelComponent: React.FC<ValueLabelComponentProps> = ({
  children,
  value,
}) => {
  return (
    <Tooltip
      slotProps={{
        popper: {
          className: "rollbackTooltipSliderPopper",
        },
      }}
      enterTouchDelay={0}
      placement="bottom"
      title={`${value}%`}
      arrow
    >
      {children}
    </Tooltip>
  );
};

const ReleaseDetails = () => {
  const {
    open,
    anchorEl,
    handleClick,
    handleClose,
    isEditModalOpen,
    handleEditOpen,
    handleEditClose,
    release,
    notes,
    setNotes,
    handleUpdates,
    handleAppStatus,
    pauseModal,
    setPauseModal,
    rollbackModal,
    setRollbackModal,
    resumeModal,
    setResumeModal,
    setPromoteModal,
    promote,
    handlePromote,
    value,
    handleSliderChange,
    rolloutModal,
    setRolloutModal,
    handleRollout,
    handleRollback,
    isSwitchOn,
    releaseLoader,
    handleSwitchToggle,
    getReleasedByLabel,
  } = useReleaseDetailsHelper();

  return (
    <div className="ReleaseDetailWrapper">
      <Breadcrumbs
        loading={release?.releaseVersion ? false : true}
        title={`${release?.releaseVersion} Details`}
        toolTipTitle="Releases Detail Tooltip Content"
      />
      <div className="cardBgWrapper ReleasesDetailMainWrapper">
        {/* detail section */}
        {releaseLoader ? (
          <div className="topSection skeltonWrapper">
            <div className="headingSection skelton-loader">
              {release?.status !== "ROLLED_BACK" && (
                <>
                  <ButtonComp
                    className="actionButton skelton-loader"
                    type="button"
                    label=""
                  />
                </>
              )}
            </div>
            <div className="detailRow">
              <div className="detailCol">
                <h4 className="key skeleton-loader"></h4>
                <p className="value skeleton-loader"></p>
              </div>
              <div className="detailCol">
                <h4 className="key skeleton-loader"></h4>
                <p className="value skeleton-loader"></p>
              </div>
              <div className="detailCol">
                <h4 className="key skeleton-loader"></h4>
                <p className="value skeleton-loader"></p>
              </div>
              <div className="detailCol">
                <h4 className="key skeleton-loader"></h4>
                <p className="value skeleton-loader"></p>
              </div>
              <div className="detailCol">
                <h4 className="key skeleton-loader"></h4>
                <p className="value skeleton-loader"></p>
              </div>

              <div className="detailCol">
                <h4 className="key skeleton-loader"></h4>
                <p className="value skeleton-loader"></p>
              </div>
            </div>
          </div>
        ) : (
          <div className="topSection">
            <div className="headingSection">
              {release?.status !== "ROLLED_BACK" && (
                <>
                  <ButtonComp
                    className={`actionButton ${open ? "rotateIcon" : ""}`}
                    type="button"
                    label="Actions"
                    variant="contained"
                    icon={ActionArrowIcon}
                    isIcon
                    onClick={handleClick}
                  />

                  <Menu
                    className="menuWrapperss"
                    id="basic-menu"
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                    anchorOrigin={{
                      vertical: "bottom",
                      horizontal: "left",
                    }}
                    transformOrigin={{
                      vertical: 0,
                      horizontal: 50,
                    }}
                  >
                    {release?.status === "LIVE" ? (
                      <MenuItem
                        onClick={() => {
                          setPauseModal(true);
                          handleClose();
                        }}
                      >
                        Pause
                      </MenuItem>
                    ) : (
                      <MenuItem
                        onClick={() => {
                          setResumeModal(true);
                          handleClose();
                        }}
                      >
                        Resume
                      </MenuItem>
                    )}

                    {release?.status !== "ROLLED_BACK" && (
                      <MenuItem
                        onClick={() => {
                          setRollbackModal(true);
                          handleClose();
                        }}
                      >
                        Rollback
                      </MenuItem>
                    )}
                    {release?.environmentName === "Staging" &&
                      !release?.isPromoted && (
                        <MenuItem
                          onClick={() => {
                            if (
                              release?.rollout === null ||
                              release?.rollout === 100
                            ) {
                              setPromoteModal(true);
                            } else {
                              showAlert(2, Modal.promoteMsg);
                            }
                            handleClose();
                          }}
                        >
                          Promote
                        </MenuItem>
                      )}
                  </Menu>
                </>
              )}
            </div>
            <div className="detailRow">
              <div className="detailCol">
                <h4 className="key">Operating System</h4>
                <p className="value">
                  {" "}
                  {release?.osType
                    ? release?.osType === "IOS"
                      ? "iOS"
                      : "Android"
                    : "N/A"}
                </p>
              </div>
              <div className="detailCol">
                <h4 className="key">Build Number</h4>
                <p className="value">{release?.target_version ?? "N/A"}</p>
              </div>
              <div className="detailCol">
                <h4 className="key">Version</h4>
                <p className="value">{release?.releaseVersion ?? "N/A"}</p>
              </div>
              <div className="detailCol">
                <h4 className="key">Date & Time</h4>
                <p className="value">
                  {release?.createdDate
                    ? formatDateTime(release?.createdDate)
                    : "N/A"}
                </p>
              </div>
              <div className="detailCol">
                <h4 className="key">Mandatory Update?</h4>
                <div className="toggleSwitch">
                  <Switch
                    checked={isSwitchOn}
                    onChange={handleSwitchToggle}
                    color="primary"
                    disabled={release?.status === "ROLLED_BACK"}
                  />
                </div>
              </div>

              <div className="detailCol">
                <h4 className="key">Released By</h4>
                <p className="value">
                  {getReleasedByLabel(release?.released_by)}
                </p>
              </div>
            </div>
          </div>
        )}
        {/* rollout section */}
        {releaseLoader ? (
          <div className="rooloutSection skeltonWrapper">
            <div className="progressSection">
              <div className="progressHeader skelton-loader">
                <h2 className="progressTitle skeleton-loader w140"></h2>
                <p className="progressValue skeleton-loader w140"></p>
              </div>

              <div className="sliderOuterSection skeleton-loader"></div>
            </div>
            <ButtonComp
              className="updateButton skeleton-loader"
              type="button"
              label=""
            />
          </div>
        ) : (
          <div className="rooloutSection">
            <div className="progressSection">
              <div className="progressHeader">
                <h2 className="progressTitle">Release Rollout</h2>
                <p className="progressValue">
                  {value}%{" "}
                  {release?.rollout === null ||
                  release?.rollout === 100 ||
                  value === 100
                    ? "Rollout"
                    : "Done"}
                </p>
              </div>

              <div className="sliderOuterSection">
                <Slider
                  value={value}
                  disabled={
                    release?.rollout === null ||
                    release?.rollout === 100 ||
                    release?.status === "ROLLED_BACK"
                  }
                  onChange={handleSliderChange}
                  valueLabelDisplay="auto"
                  components={{
                    ValueLabel: ValueLabelComponent,
                  }}
                />
              </div>
            </div>
            <ButtonComp
              className="updateButton"
              type="button"
              label="Update"
              variant="contained"
              disabled={release?.rollout === null || release?.rollout === value}
              onClick={() => {
                setRolloutModal(true);
              }}
            />
          </div>
        )}

        {/* notes section */}
        {releaseLoader ? (
          <div className="releaseNotesSection skeltonWrapper">
            <div className="releaseHeadingWrapper">
              <h3 className="releaseHeading skeleton-loader w220"></h3>
              <ButtonComp
                className="editButton skelton-loader"
                type="button"
                label=""
              />
            </div>

            <div className="releaseNotesContentWrapper skeleton-loader">
              <p className="skeleton-loader"></p>
            </div>
          </div>
        ) : (
          <div className="releaseNotesSection">
            <div className="releaseHeadingWrapper">
              <h3 className="releaseHeading">Release Notes (Optional)</h3>
              <ButtonComp
                className="editButton"
                type="button"
                label="Edit"
                variant="contained"
                onClick={handleEditOpen}
              />
            </div>

            <div className="releaseNotesContentWrapper">
              {release?.releaseNote}
            </div>
          </div>
        )}
      </div>

      {/* models section */}

      <EditReleaseModal
        open={isEditModalOpen}
        onClose={handleEditClose}
        title={Modal.notesTitle}
        description={Modal.notesDesc}
        notes={notes}
        setNotes={setNotes}
        onSubmit={() => handleUpdates("notes")}
      />
      <RoolbackModal
        open={rollbackModal}
        onClose={() => {
          setRollbackModal(false);
        }}
        title={Modal.rollbackTitle}
        description={Modal.rollbackDesc}
        onSubmit={handleRollback}
      />
      <PauseModal
        open={pauseModal}
        onClose={() => {
          setPauseModal(false);
        }}
        title={Modal.pauseTitle}
        description={Modal.pasuseDesc}
        onSubmit={() => handleAppStatus("pause")}
      />

      <ResumeModal
        open={resumeModal}
        onClose={() => {
          setResumeModal(false);
        }}
        title={Modal.resumeTitle}
        description={Modal.resumeDesc}
        onSubmit={() => handleAppStatus("resume")}
      />
      <PromoteModal
        open={promote}
        onClose={() => {
          setPromoteModal(false);
        }}
        title={Modal.promoteTitle}
        description={Modal.promoteDesc}
        onSubmit={handlePromote}
      />
      <RolloutUpdateModal
        open={rolloutModal}
        title={Modal.rolloutTitle}
        description={Modal.rolloutDesc}
        onSubmit={handleRollout}
        onClose={() => {
          setRolloutModal(false);
        }}
      />
    </div>
  );
};

export default ReleaseDetails;
export { ValueLabelComponent };
