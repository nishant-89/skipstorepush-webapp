import Breadcrumbs from "src/components/common/BreadCrumbs/BreadCrumbs";
import DebounceSearch from "src/components/common/Search/Search";
import TableComponent from "src/components/common/Table/Table";
import TableDataLoader from "src/components/common/Loader/tableDataLoader";
import NoData from "src/components/common/NoData/NoData";
import { useAdminCustomersHelper } from "./helper";
import { adminCustomerColumns } from "./columns";
import "../AllApps/AllApps.scss";
import "../../scss/table.scss";
import "./admin.scss";

const AdminCustomers = () => {
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
  } = useAdminCustomersHelper();

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
                  placeholder="Search customers"
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
                <TableDataLoader columns={adminCustomerColumns} />
              ) : list.length === 0 ? (
                <NoData
                  title={searchTerm.trim() ? "No Data Found" : "No customers yet"}
                />
              ) : (
                <TableComponent
                  tableData={list}
                  columns={adminCustomerColumns}
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

export default AdminCustomers;
