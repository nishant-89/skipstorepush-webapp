import { useState } from "react";
import Breadcrumbs from "src/components/common/BreadCrumbs";
import Button from "src/components/common/Button";
import { UserPlaceholderIcon } from "src/utils/common/constants";
import { formatDateTime } from "src/utils/common/helpers";
import { useAccountHelper, PROFILE_IMAGE_ACCEPT } from "./helper";
import ChangePasswordModal from "./changePasswordModal";
import AccessKeyModal from "src/components/common/Modal/accessKeyModal";
import LogoutModal from "src/components/common/Modal/logoutModal";
import "./account.scss";

const authLabel = (authType?: string) =>
  authType === "BASIC" ? "Email / password" : "GitHub";

const Account = () => {
  const {
    data,
    loading,
    accessKey,
    isGithubAuth,
    githubProfileUrl,
    isPasswordModalOpen,
    isAccessKeyModalOpen,
    fileInputRef,
    openAccessKeyModal,
    closeAccessKeyModal,
    openPasswordModal,
    closePasswordModal,
    openProfileImagePicker,
    handleProfileImageChange,
  } = useAccountHelper();
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);

  return (
    <div className="accountPage">
      <Breadcrumbs title="My Account" loading={loading} />
      <div className="cardBgWrapper accountCard">
        <div className="profileHeader">
          <input
            ref={fileInputRef}
            className="profileImageInput"
            type="file"
            accept={PROFILE_IMAGE_ACCEPT}
            onChange={handleProfileImageChange}
          />
          <button
            type="button"
            className="profileImageButton"
            onClick={openProfileImagePicker}
            aria-label="Change profile photo"
          >
            <img
              className="profileImage"
              src={data?.profileImage || UserPlaceholderIcon}
              alt=""
            />
            <span className="profileImageOverlay">Change</span>
          </button>
          <div>
            <h2>{data?.fullName || "—"}</h2>
            <p className="authBadge">{authLabel(data?.authType)}</p>
            <button
              type="button"
              className="textLinkBtn"
              onClick={openProfileImagePicker}
            >
              Change photo
            </button>
          </div>
        </div>

        <dl className="profileGrid">
          <div>
            <dt>Username</dt>
            <dd>{data?.fullName || "—"}</dd>
          </div>
          <div>
            <dt>Email</dt>
            <dd>{data?.email || "—"}</dd>
          </div>
          <div>
            <dt>Full name</dt>
            <dd>{data?.fullName || "—"}</dd>
          </div>
          <div>
            <dt>Auth type</dt>
            <dd>{authLabel(data?.authType)}</dd>
          </div>
          <div>
            <dt>Last login</dt>
            <dd>{data?.lastLogin ? formatDateTime(data.lastLogin) : "—"}</dd>
          </div>
          {/* <div>
            <dt>Current session started</dt>
            <dd>
              {data?.session?.createdDate
                ? formatDateTime(data.session.createdDate)
                : "—"}
            </dd>
          </div>
          <div>
            <dt>Session ID</dt>
            <dd className="sessionId">{data?.session?.sessionId || "—"}</dd>
          </div> */}
          <div>
            <dt>Account active since</dt>
            <dd>
              {data?.createdDate ? formatDateTime(data.createdDate) : "—"}
            </dd>
          </div>
        </dl>

        <div className="profileActions">
          {accessKey ? (
            <Button
              label="Access Key"
              variant="outlined"
              onClick={openAccessKeyModal}
            />
          ) : null}
          {isGithubAuth && githubProfileUrl ? (
            <Button
              label="View GitHub profile"
              variant="contained"
              onClick={() => window.open(githubProfileUrl, "_blank")}
            />
          ) : null}
          {data?.authType === "BASIC" ? (
            <Button
              label="Change password"
              variant="contained"
              onClick={openPasswordModal}
            />
          ) : null}
          <Button
            label="Logout"
            variant="outlined"
            onClick={() => setIsLogoutOpen(true)}
          />
        </div>
      </div>
      <AccessKeyModal
        open={isAccessKeyModalOpen}
        title="Access Key"
        onClose={closeAccessKeyModal}
      />
      <ChangePasswordModal
        open={isPasswordModalOpen}
        onClose={closePasswordModal}
      />
      <LogoutModal
        isOpen={isLogoutOpen}
        handleClose={() => setIsLogoutOpen(false)}
      />
    </div>
  );
};

export default Account;
