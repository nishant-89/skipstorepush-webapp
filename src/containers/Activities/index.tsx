import Breadcrumbs from "src/components/common/BreadCrumbs";
import DebounceSearch from "src/components/common/Search";
import TableComponent from "src/components/common/Table";
import TableDataLoader from "src/components/common/Loader/tableDataLoader";
import NoData from "src/components/common/NoData";
import { activityColumns } from "./column";
import { useActivitiesHelper } from "./helper";
import "../AllApps/AllApps.scss";
import "../../scss/table.scss";
import "./activities.scss";

const Activities = () => {
  const {
    list,
    count,
    loading,
    mainPage,
    rowsPerPage,
    searchTerm,
    term,
    setTerm,
    setSearchTerm,
    handleChangePage,
    handleChangeRowsPerPage,
  } = useActivitiesHelper();

  const renderTableContent = () => {
    if (loading) {
      return <TableDataLoader columns={activityColumns} />;
    }

    if (list.length === 0) {
      return (
        <div className="appListingFirstNodataWrapper">
          <NoData
            title={searchTerm.trim() ? "No Data Found" : "No activities yet"}
          />
        </div>
      );
    }

    return (
      <TableComponent
        tableData={list}
        columns={activityColumns}
        page={mainPage}
        rowsPerPage={rowsPerPage}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        count={count}
      />
    );
  };

  return (
    <div className="AllAppsWrapper activitiesPage">
      <Breadcrumbs />
      <div className="cardBgWrapper AllAppsMainWrapper">
        <div className="AllAppsInnerWrapper">
          <div className="TopSection">
            <div className="toolbarActions">
              <div className="searchWrapper">
                <DebounceSearch
                  onSearch={setSearchTerm}
                  placeholder="Search"
                  setSearchTerm={setTerm}
                  searchTerm={term}
                  alphanumericOnly={false}
                />
              </div>
            </div>
          </div>
          <div className="tableSection appTable">
            <div className="adminAccessTableWrapper tableWrapper bgWhite p00">
              {renderTableContent()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Activities;
