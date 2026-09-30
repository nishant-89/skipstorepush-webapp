import { useSelector } from "react-redux";
import Breadcrumbs from "src/components/common/BreadCrumbs/BreadCrumbs";
import { RootState } from "src/redux/rootReducers";

const Dashboard = () => {
  const fullName = useSelector(
    (state: RootState) => state.profile.data?.fullName
  )?.trim();
  const greeting = fullName ? `Hello, ${fullName}` : "Hello";

  return (
    <div className="dashboardPage">
      <Breadcrumbs currentLabel={greeting} />
    </div>
  );
};

export default Dashboard;
