import Breadcrumbs from "src/components/common/BreadCrumbs";
import Button from "src/components/common/Button";
import { UserPlaceholderIcon } from "src/utils/common/constants";
import { formatDateTime } from "src/utils/common/helpers";
import { useAccountHelper } from "./helper";
import ChangePasswordModal from "./changePasswordModal";
import AccessKeyModal from "src/components/common/Modal/accessKeyModal";
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
    openAccessKeyModal,
    closeAccessKeyModal,
    openPasswordModal,
    closePasswordModal,
  } = useAccountHelper();

  return (
    <div className="accountPage">
      <Breadcrumbs title="My Account" loading={loading} />
      <div className="cardBgWrapper accountCard">
        <div className="profileHeader">
          <img
            className="profileImage"
            src={data?.profileImage || UserPlaceholderIcon}
            alt="Profile"
          />
          <div>
            <h2>{data?.fullName || "—"}</h2>
            <p className="authBadge">{authLabel(data?.authType)}</p>
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
          <div>
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
          </div>
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
              label="Copy Access Key"
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
    </div>
  );
};

export default Account;
