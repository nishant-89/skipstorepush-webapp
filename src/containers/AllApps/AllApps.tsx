import Breadcrumbs from "src/components/common/BreadCrumbs/BreadCrumbs";
import DebounceSearch from "src/components/common/Search/Search";
import Button from "src/components/common/Button/Button";
import { AddButtonIcon } from "src/utils/common/constants/constants";
import TableComponent from "src/components/common/Table/Table";
import TableDataLoader from "src/components/common/Loader/tableDataLoader";
import NoData from "src/components/common/NoData/NoData";
import AllAppFilterPopUp from "src/components/common/Filter/allAppFilter";

import AddAppDrawer from "./components/AddAppDrawer/addAppDrawer";
import { osFilterLabel, useAllAppsHelper } from "./helper";
import { allAppsColumns } from "./column";

import "./AllApps.scss";
import "../../scss/table.scss";

const AllApps = () => {
  const {
    handleOpenDrawer,
    handleCloseDrawer,
    isDrawerOpen,
    filteredData,
    loading,
    setSearchTerm,
    setTerm,
    term,
    mainPage,
    count,
    rowsPerPage,
    handleChangePage,
    handleChangeRowsPerPage,
    selectedFilters,
    setSelectedFilters,
    setIsRedIndicator,
    isRedIndicator,
    searchTerm,
    clearOsFilter,
    clearAllSavedFilters,
  } = useAllAppsHelper();

  const renderTableContent = () => {
    if (loading) {
      return <TableDataLoader columns={allAppsColumns} />;
    }

    if (!loading && filteredData?.length === 0) {
      if (selectedFilters?.length === 0 && !searchTerm?.trim()) {
        return (
          <div className="appListingFirstNodataWrapper">
            <NoData
              title="No App Found"
              buttonAction={handleOpenDrawer}
              buttonLabel="New App"
            />
          </div>
        );
      } else {
        return (
          <div className="appListingNodataWrapper">
            <NoData title="No Data Found" />
          </div>
        );
      }
    }

    if (!loading && filteredData?.length > 0) {
      return (
        <TableComponent
          tableData={filteredData}
          columns={allAppsColumns}
          page={mainPage}
          rowsPerPage={rowsPerPage}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          count={count}
        />
      );
    }

    return null;
  };

  return (
    <div className="AllAppsWrapper">
      <Breadcrumbs />

      <div className="cardBgWrapper AllAppsMainWrapper">
        <div className="AllAppsInnerWrapper">
          <div className="TopSection">
            <div className="toolbarActions">
              <div className="searchWrapper">
                <DebounceSearch
                  onSearch={setSearchTerm}
                  placeholder={"Search"}
                  setSearchTerm={setTerm}
                  searchTerm={term}
                  alphanumericOnly={false}
                />
              </div>
              <AllAppFilterPopUp
                selectedFilters={selectedFilters}
                setSelectedFilters={setSelectedFilters}
                setIsRedIndicator={setIsRedIndicator}
                isRedIndicator={isRedIndicator}
              />
              <Button
                className="addNewBtns addNewBtn"
                variant="contained"
                label="New App"
                isIcon
                icon={AddButtonIcon}
                onClick={handleOpenDrawer}
              />
            </div>
          </div>
          {selectedFilters.length > 0 || searchTerm.trim() ? (
            <div className="savedFilterRow">
              {selectedFilters.map((filter) => (
                <button
                  key={filter}
                  type="button"
                  className="savedFilterChip"
                  onClick={() => clearOsFilter(filter)}
                >
                  {osFilterLabel(filter)}
                  <span aria-hidden="true">×</span>
                </button>
              ))}
              {searchTerm.trim() ? (
                <span className="savedFilterChip isSearch">
                  “{searchTerm.trim()}”
                </span>
              ) : null}
              <button
                type="button"
                className="clearSavedFilters textLinkBtn"
                onClick={clearAllSavedFilters}
              >
                Clear saved
              </button>
            </div>
          ) : null}
          {/* render table section */}
          <div className="tableSection appTable">
            <div className="adminAccessTableWrapper tableWrapper bgWhite p00">
              {renderTableContent()}
            </div>
          </div>
        </div>
      </div>

      <AddAppDrawer
        open={isDrawerOpen}
        onClose={handleCloseDrawer}
        editMode={false}
      />
    </div>
  );
};

export default AllApps;
