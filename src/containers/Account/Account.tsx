import { useState } from "react";
import { KeyRound, Lock, LogOut, User } from "lucide-react";
import Breadcrumbs from "src/components/common/BreadCrumbs/BreadCrumbs";
import Button from "src/components/common/Button/Button";
import { GithubIcon, UserPlaceholderIcon } from "src/utils/common/constants/constants";
import { formatDateTime } from "src/utils/common/helpers";
import { useAccountHelper, PROFILE_IMAGE_ACCEPT } from "./helper";
import ChangePasswordModal from "./changePasswordModal";
import AccessKeyModal from "src/components/common/Modal/accessKeyModal";
import LogoutModal from "src/components/common/Modal/logoutModal";
import "./account.scss";

const authLabel = (authType?: string) =>
  authType === "BASIC" ? "Email / password" : "GitHub";

const AccountField = ({
  label,
  value,
  mono = false,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) => (
  <div className="accountField">
    <span className="accountFieldLabel">{label}</span>
    <span className={`accountFieldValue${mono ? " isMono" : ""}`}>{value}</span>
  </div>
);

const Account = () => {
  const {
    data,
    accessKey,
    isGithubAuth,
    githubUsername,
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
  const isBasicAuth = data?.authType === "BASIC";

  return (
    <div className="accountPage">
      <Breadcrumbs currentLabel="My Profile" />
      <div className="accountLayout">
        <aside className="cardBgWrapper accountNav">
          <nav className="accountNavList" aria-label="Profile actions">
            <button
              type="button"
              className="accountNavItem isActive"
              aria-current="page"
            >
              <User size={16} aria-hidden />
              Profile
            </button>
            {isBasicAuth ? (
              <button
                type="button"
                className="accountNavItem"
                onClick={openPasswordModal}
              >
                <Lock size={16} aria-hidden />
                Change password
              </button>
            ) : null}
            {accessKey ? (
              <button
                type="button"
                className="accountNavItem"
                onClick={openAccessKeyModal}
              >
                <KeyRound size={16} aria-hidden />
                Access key
              </button>
            ) : null}
            {isGithubAuth && githubProfileUrl ? (
              <button
                type="button"
                className="accountNavItem"
                onClick={() => window.open(githubProfileUrl, "_blank")}
              >
                <img src={GithubIcon} alt="" width={16} height={16} />
                GitHub
              </button>
            ) : null}
          </nav>
          <button
            type="button"
            className="accountNavSignOut"
            onClick={() => setIsLogoutOpen(true)}
          >
            <LogOut size={16} aria-hidden />
            Sign out
          </button>
        </aside>

        <div className="cardBgWrapper accountMain">
          <header className="accountMainHead">
            <h1>My Profile</h1>
            <p>Manage your details and account security.</p>
          </header>

          <div className="accountHero">
            <section className="accountPanel accountIdentity">
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
              <h2>{data?.fullName || "—"}</h2>
              {isGithubAuth && githubUsername ? (
                <p className="githubHandle">@{githubUsername}</p>
              ) : null}
              <p className="authBadge">{authLabel(data?.authType)}</p>
              <button
                type="button"
                className="textLinkBtn"
                onClick={openProfileImagePicker}
              >
                Change photo
              </button>
            </section>

            <section className="accountPanel">
              <h3>General information</h3>
              <div className="accountFieldGrid">
                <AccountField label="Email" value={data?.email || "—"} />
                {isGithubAuth && githubUsername ? (
                  <AccountField
                    label="GitHub username"
                    value={githubUsername}
                    mono
                  />
                ) : null}
                <AccountField
                  label="Last login"
                  value={
                    data?.lastLogin ? formatDateTime(data.lastLogin) : "—"
                  }
                />
              </div>
            </section>
          </div>

          <section className="accountPanel">
            <h3>Security</h3>
            <div className="accountFieldGrid">
              <AccountField
                label="Sign-in method"
                value={authLabel(data?.authType)}
              />
              {isBasicAuth ? (
                <AccountField label="Password" value="••••••" mono />
              ) : null}
              <AccountField
                label="Account active since"
                value={
                  data?.createdDate ? formatDateTime(data.createdDate) : "—"
                }
              />
            </div>
            <div className="accountPanelActions">
              {isBasicAuth ? (
                <Button
                  label="Change password"
                  variant="outlined"
                  onClick={openPasswordModal}
                />
              ) : null}
              {accessKey ? (
                <Button
                  label="Access key"
                  variant="outlined"
                  onClick={openAccessKeyModal}
                />
              ) : null}
              {isGithubAuth && githubProfileUrl ? (
                <Button
                  label="My GitHub"
                  variant="outlined"
                  onClick={() => window.open(githubProfileUrl, "_blank")}
                />
              ) : null}
            </div>
          </section>
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
