import Breadcrumbs from "src/components/common/BreadCrumbs/BreadCrumbs";
import DebounceSearch from "src/components/common/Search/Search";
import TableComponent from "src/components/common/Table/Table";
import TableDataLoader from "src/components/common/Loader/tableDataLoader";
import NoData from "src/components/common/NoData/NoData";
import { useAdminAppsHelper } from "./helper";
import { adminAppColumns } from "./columns";
import "../AllApps/AllApps.scss";
import "../../scss/table.scss";
import "./admin.scss";

const AdminApps = () => {
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
  } = useAdminAppsHelper();

  return (
    <div className="AllAppsWrapper adminPage">
      <Breadcrumbs />
      <div className="cardBgWrapper AllAppsMainWrapper">
        <div className="AllAppsInnerWrapper">
          <div className="TopSection">
            <div className="toolbarActions">
              <div className="searchWrapper">
                <DebounceSearch
                  onSearch={setSearchTerm}
                  placeholder="Search apps"
                  setSearchTerm={setTerm}
                  searchTerm={term}
                  alphanumericOnly={false}
                />
              </div>
            </div>
          </div>
          <div className="tableSection appTable">
            <div className="adminAccessTableWrapper tableWrapper bgWhite p00">
              {loading ? (
                <TableDataLoader columns={adminAppColumns} />
              ) : list.length === 0 ? (
                <NoData
                  title={searchTerm.trim() ? "No Data Found" : "No apps yet"}
                />
              ) : (
                <TableComponent
                  tableData={list}
                  columns={adminAppColumns}
                  page={mainPage}
                  rowsPerPage={rowsPerPage}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                  count={count}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminApps;
