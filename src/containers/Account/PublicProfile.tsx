import Breadcrumbs from "src/components/common/BreadCrumbs/BreadCrumbs";
import NoData from "src/components/common/NoData/NoData";
import UserAvatar from "src/components/common/UserAvatar/UserAvatar";
import { usePublicProfileHelper } from "./publicProfileHelper";
import "./account.scss";

const PublicProfile = () => {
  const { profile, missing } = usePublicProfileHelper();

  if (missing) {
    return (
      <div className="accountPage">
        <Breadcrumbs currentLabel="Profile" />
        <NoData
          title="Profile not found"
          subtitle="This person is not on an app you collaborate on, or the profile is unavailable."
        />
      </div>
    );
  }

  return (
    <div className="accountPage">
      <Breadcrumbs currentLabel={profile?.fullName || "Profile"} />
      <div className="cardBgWrapper accountMain publicProfileCard">
        <header className="accountMainHead">
          <h1>Profile</h1>
          <p>Public details for this user.</p>
        </header>
        <section className="accountPanel accountIdentity">
          <UserAvatar
            className="profileImage"
            src={profile?.profileImage}
            alt={profile?.fullName || "Profile photo"}
            iconSize={36}
          />
          <h2>{profile?.fullName || "—"}</h2>
          <p className="publicProfileEmail">{profile?.email || "—"}</p>
        </section>
      </div>
    </div>
  );
};

export default PublicProfile;
