import { Link } from "react-router-dom";
import type { ReactNode } from "react";
import Breadcrumbs from "src/components/common/BreadCrumbs/BreadCrumbs";
import ButtonComp from "src/components/common/Button/Button";
import EditReleaseModal from "src/components/common/Modal/editReleaseModal";
import { formatDateTime } from "src/utils/common/helpers";
import PauseModal from "src/components/common/Modal/pauseModal";
import RoolbackModal from "src/components/common/Modal/roolbackModal";
import ResumeModal from "src/components/common/Modal/resumeModal";
import PromoteModal from "src/components/common/Modal/promoteModal";
import { Slider, Switch, Tooltip } from "@mui/material";
import RolloutUpdateModal from "src/components/common/Modal/rolloutUpdateModal";
import { showAlert } from "src/utils/alert";
import { Pause, Pencil, Play, Rocket, Undo2 } from "lucide-react";

import { ValueLabelComponentProps, RELEASE_RESPONSE_TYPE } from "../../types";
import { OsBrandIcon } from "../../osIcons";
import { releasedByProfilePath, useReleaseDetailsHelper } from "./helper";
import { Modal } from "./constant";

import "./ReleaseDetails.scss";

const ValueLabelComponent = ({
  children,
  value,
}: ValueLabelComponentProps) => {
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

const osLabel = (osType?: string) => {
  if (!osType) return "N/A";
  return osType === "IOS" ? "iOS" : "Android";
};

const ReleasedByValue = ({
  releasedBy,
  currentUserId,
}: {
  releasedBy?: RELEASE_RESPONSE_TYPE["releasedBy"] | null;
  currentUserId?: string | number | null;
}) => {
  if (!releasedBy) {
    return "N/A";
  }
  const name = releasedBy.fullName?.trim();
  const email = releasedBy.email?.trim();
  const href = name ? releasedByProfilePath(releasedBy, currentUserId) : null;

  if (!name && !email) {
    return "N/A";
  }

  return (
    <>
      {href ? (
        <Link
          to={href}
          state={{
            id: releasedBy.id,
            fullName: releasedBy.fullName,
            email: releasedBy.email,
            profileImage: releasedBy.profileImage,
          }}
          className="releaseByName"
        >
          {name}
        </Link>
      ) : (
        name || null
      )}
      {name && email ? " " : null}
      {email ? <span className="releaseByEmail">({email})</span> : null}
    </>
  );
};

const ReleaseField = ({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) => (
  <div className="releaseField">
    <span className="releaseFieldLabel">{label}</span>
    <div className="releaseFieldValue">{children}</div>
  </div>
);

const ReleaseDetails = () => {
  const {
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
    currentUserId,
    selectedEnvName,
  } = useReleaseDetailsHelper();

  const envTag =
    selectedEnvName || release?.environmentName || "";

  const canAct = release?.status !== "ROLLED_BACK";
  const canPromote =
    release?.environmentName === "Staging" && !release?.isPromoted;
  const rolloutComplete =
    release?.rollout === null || release?.rollout === 100 || value === 100;
  const rolloutLocked =
    release?.rollout === null ||
    release?.rollout === 100 ||
    release?.status === "ROLLED_BACK";

  const openPromote = () => {
    if (release?.rollout === null || release?.rollout === 100) {
      setPromoteModal(true);
    } else {
      showAlert(2, Modal.promoteMsg);
    }
  };

  return (
    <div className="ReleaseDetailWrapper">
      <Breadcrumbs
        loading={!release?.appName}
        contextName={release?.appName}
      />
      <div className="cardBgWrapper releasePage">
        {releaseLoader ? (
          <div className="releaseHero skeltonWrapper">
            <div className="releaseHeroCopy">
              <h1 className="skeleton-loader w220"></h1>
              <p className="skeleton-loader w140"></p>
            </div>
          </div>
        ) : (
          <header className="releaseHero">
            <div className="releaseHeroMain">
              {release?.appIcon ? (
                <>
                  <img
                    className="releaseAppIcon"
                    src={release.appIcon}
                    alt=""
                  />
                  <span className="releaseHeroDivider" aria-hidden="true" />
                </>
              ) : null}
              <div className="releaseHeroCopy">
                <div className="releaseEyebrow">
                  <OsBrandIcon osType={release?.osType} />
                  {envTag ? (
                    <span className="releaseEnv">{envTag}</span>
                  ) : null}
                </div>
                <h1>{release?.releaseVersion ?? "Release"}</h1>
                <p>
                  {release?.appName || "App"}
                  {release?.targetVersion
                    ? ` · Build ${release.targetVersion}`
                    : ""}
                </p>
              </div>
            </div>
            {canAct ? (
              <div className="releaseCtas">
                {release?.status === "LIVE" ? (
                  <button
                    type="button"
                    className="appBtn appBtn--secondary"
                    onClick={() => setPauseModal(true)}
                  >
                    <Pause size={15} aria-hidden />
                    Pause
                  </button>
                ) : (
                  <button
                    type="button"
                    className="appBtn appBtn--secondary"
                    onClick={() => setResumeModal(true)}
                  >
                    <Play size={15} aria-hidden />
                    Resume
                  </button>
                )}
                {canPromote ? (
                  <button
                    type="button"
                    className="appBtn appBtn--primary"
                    onClick={openPromote}
                  >
                    <Rocket size={15} aria-hidden />
                    Promote
                  </button>
                ) : null}
                <button
                  type="button"
                  className="appBtn appBtn--secondary releaseCta--danger"
                  onClick={() => setRollbackModal(true)}
                >
                  <Undo2 size={15} aria-hidden />
                  Rollback
                </button>
              </div>
            ) : null}
          </header>
        )}

        {releaseLoader ? (
          <section className="releasePanel skeltonWrapper">
            <div className="releaseMetaGrid">
              {Array.from({ length: 6 }).map((_, index) => (
                <div className="releaseField" key={`sk-${index}`}>
                  <span className="key skeleton-loader"></span>
                  <p className="value skeleton-loader"></p>
                </div>
              ))}
            </div>
          </section>
        ) : (
          <section className="releasePanel">
            <h2>Release details</h2>
            <div className="releaseMetaGrid">
              <ReleaseField label="Operating System">
                {osLabel(release?.osType)}
              </ReleaseField>
              <ReleaseField label="Build Number">
                {release?.targetVersion ?? "N/A"}
              </ReleaseField>
              <ReleaseField label="Version">
                {release?.releaseVersion ?? "N/A"}
              </ReleaseField>
              <ReleaseField label="Date & Time">
                {release?.createdDate
                  ? formatDateTime(release?.createdDate)
                  : "N/A"}
              </ReleaseField>
              <ReleaseField label="Mandatory Update?">
                <div className="toggleSwitch">
                  <Switch
                    checked={isSwitchOn}
                    onChange={handleSwitchToggle}
                    color="primary"
                    disabled={release?.status === "ROLLED_BACK"}
                    inputProps={{ "aria-label": "Mandatory update" }}
                  />
                </div>
              </ReleaseField>
              <ReleaseField label="Released By">
                <ReleasedByValue
                  releasedBy={release?.releasedBy}
                  currentUserId={currentUserId}
                />
              </ReleaseField>
            </div>
          </section>
        )}

        {releaseLoader ? (
          <section className="releasePanel skeltonWrapper">
            <div className="releasePanelHead">
              <h2 className="skeleton-loader w140"></h2>
              <ButtonComp
                className="updateButton skelton-loader"
                type="button"
                label=""
              />
            </div>
            <div className="sliderOuterSection skeleton-loader"></div>
          </section>
        ) : (
          <section className="releasePanel">
            <div className="releasePanelHead">
              <div>
                <h2>Release rollout</h2>
                <p className="releasePanelHint">
                  Increase the share of devices that receive this update. This
                  cannot be reduced later.
                </p>
              </div>
              <div className="releaseRolloutMeta">
                <span className="progressValue">
                  {value}% {rolloutComplete ? "rolled out" : "selected"}
                </span>
                <ButtonComp
                  className="updateButton"
                  type="button"
                  label="Update"
                  variant="contained"
                  disabled={
                    release?.rollout === null || release?.rollout === value
                  }
                  onClick={() => {
                    setRolloutModal(true);
                  }}
                />
              </div>
            </div>
            <div className="sliderOuterSection">
              <Slider
                value={value}
                disabled={rolloutLocked}
                onChange={handleSliderChange}
                valueLabelDisplay="auto"
                components={{
                  ValueLabel: ValueLabelComponent,
                }}
              />
            </div>
          </section>
        )}

        {releaseLoader ? (
          <section className="releasePanel skeltonWrapper">
            <div className="releasePanelHead">
              <h2 className="skeleton-loader w220"></h2>
              <ButtonComp
                className="editButton skelton-loader"
                type="button"
                label=""
              />
            </div>
            <div className="releaseNotesContentWrapper skeleton-loader">
              <p className="skeleton-loader"></p>
            </div>
          </section>
        ) : (
          <section className="releasePanel">
            <div className="releasePanelHead">
              <div>
                <h2>Release Notes (Optional)</h2>
                <p className="releasePanelHint">
                  Shown with this update on devices that download it.
                </p>
              </div>
              <button
                type="button"
                className="appBtn appBtn--secondary"
                onClick={handleEditOpen}
              >
                <Pencil size={15} aria-hidden />
                Edit
              </button>
            </div>
            <div className="releaseNotesContentWrapper">
              {release?.releaseNote || "No release notes yet."}
            </div>
          </section>
        )}
      </div>

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
