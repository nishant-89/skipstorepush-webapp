import * as React from "react";
import { useDispatch } from "react-redux";
import {
  ActionArrowIcon,
  ProfileImageIcon,
  ReleaseSettingIcon,
} from "src/utils/common/constants";
import TableComponent from "src/components/common/Table";
import TableDataLoader from "src/components/common/Loader/tableDataLoader";
import NoData from "src/components/common/NoData";
import Breadcrumbs from "src/components/common/BreadCrumbs";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import SettingDeleteModal from "src/components/common/Modal/deleteModal";
import ButtonComp from "src/components/common/Button";
import DebounceSearch from "src/components/common/Search";
import SelectComponent from "src/components/common/Select";

import AddAppDrawer from "../AddAppDrawer/addAppDrawer";
import { useAllAppsDetailHelper } from "./helper";
import ReleaseDrawer from "../ReleaseDrawer";
import { Modal } from "./constant";
import { handleEnvironment } from "src/containers/redux/slices/release";
import CollaboratorSection from "./collaborator";

import "./AllAppsDetails.scss";
import "../../../../scss/table.scss";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 0 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const AllAppsDetails = () => {
  const dispatch = useDispatch();
  const {
    isDrawerOpen,
    isDeleteModalOpen,
    isSettingsDrawerOpen,
    value,
    open,
    anchorEl,
    filteredData,
    loading,
    count,
    selectedFilters,
    mainPage,
    rowsPerPage,
    term,
    showFilter,
    envList,
    appDetail,
    releaseColumns,
    realeaseLoader,
    searchTerm,
    invite,
    mainPageCollab,
    rowsPerPageCollab,
    filteredDataCollab,
    loadingCollab,
    countCollab,
    setInvite,
    setTerm,
    setSearchTerm,
    handleEditButtonClick,
    handleDeleteClick,
    handleSettingsClick,
    handleOpenDrawer,
    handleCloseDrawer,
    handleChange,
    handleCloseMenu,
    setIsDeleteModalOpen,
    setIsSettingsDrawerOpen,
    handleChangePage,
    handleChangeRowsPerPage,
    handleCollabChangePage,
    handleCollabChangeRowsPerPage,
    setSelectedFilters,
    handleDelete,
    handleInvite,
    handleCollabModel,
    setDelCollab,
    delCollab,
    handleDeleteCollab,
  } = useAllAppsDetailHelper();

  const renderTableContent = () => {
    if (loading) {
      return <TableDataLoader columns={releaseColumns} />;
    }

    if (!loading && filteredData?.length === 0) {
      if (!searchTerm?.trim()) {
        return (
          <div className="releaseNoDataWrap">
            <NoData title="No Release Found" />
          </div>
        );
      } else {
        return (
          <div className="releaseNoDataWrap">
            <NoData title="No Data Found" />
          </div>
        );
      }
    }

    if (!loading && filteredData?.length > 0) {
      return (
        <TableComponent
          tableData={filteredData}
          columns={releaseColumns}
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
    <div className="AllAppsDetailWrapper">
      <Breadcrumbs
        title={appDetail?.name}
        toolTipTitle="App Details Tooltip Content "
      />

      <div className="cardBgWrapper AllAppsDetailMainWrapper">
        <div className="AllAppsDetailInnerWrapper">
          <div className="DetailsTabSection">
            <Tabs
              value={value}
              onChange={handleChange}
              aria-label="basic tabs example"
              scrollButtons="auto"
              variant="scrollable"
            >
              <Tab label="Releases" {...a11yProps(0)} />
              <Tab label="Settings" {...a11yProps(1)} />
            </Tabs>
          </div>
          {/* releases section */}
          <div className="tabContentWrapper">
            <CustomTabPanel value={value} index={0}>
              <div className="ReleaseMainWrapper">
                <div className="TopSection">
                  {showFilter && (
                    <div className="searchWrapper">
                      <DebounceSearch
                        onSearch={setSearchTerm}
                        placeholder={"Search"}
                        setSearchTerm={setTerm}
                        searchTerm={term}
                        alphanumericOnly={false}
                      />
                    </div>
                  )}
                  {envList && envList?.length > 0 && (
                    <div className="customSelect releaseSelectDropdown">
                      <SelectComponent
                        title=""
                        placeholder="Select"
                        value={selectedFilters}
                        onChange={(value: string) => {
                          setSelectedFilters(value);
                          dispatch(handleEnvironment(value));
                        }}
                        options={envList}
                      />
                    </div>
                  )}

                  {envList && envList?.length > 0 && (
                    <ButtonComp
                      className="SettingBtn"
                      variant="outlined"
                      label=""
                      isIcon
                      icon={ReleaseSettingIcon}
                      onClick={handleOpenDrawer}
                    />
                  )}
                  <ReleaseDrawer
                    open={isDrawerOpen}
                    onClose={handleCloseDrawer}
                    envList={envList}
                  />
                </div>

                <div className="tableSection releaseTable">
                  <div className="adminAccessTableWrapper tableWrapper bgWhite p00">
                    {renderTableContent()}
                  </div>
                </div>
              </div>
            </CustomTabPanel>
          </div>
          {/* setting section */}
          <div className="tabContentWrapper">
            <CustomTabPanel value={value} index={1}>
              <div className="SettingsMainWrapper">
                {!realeaseLoader ? (
                  <div className="settingCardWrapper">
                    <div className="cardHead">
                      {appDetail?.appIcon && (
                        <figure className="cardImage">
                          <img
                            src={appDetail?.appIcon || ProfileImageIcon}
                            alt="Icon"
                          />
                        </figure>
                      )}
                      <div
                        className={`cardMiddleContent ${appDetail?.appIcon ? "" : "noImage"}`}
                      >
                        <h2 className="cardTitle">{appDetail?.name}</h2>
                      </div>
                      {appDetail?.isOwner && (
                        <ButtonComp
                          className={`actionButton ${open ? "rotateIcon" : ""}`}
                          type="button"
                          label="Actions"
                          variant="contained"
                          icon={ActionArrowIcon}
                          isIcon
                          onClick={handleEditButtonClick}
                        />
                      )}

                      <Menu
                        className="menuWrapperss"
                        id="basic-menu"
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleCloseMenu}
                        anchorOrigin={{
                          vertical: "bottom",
                          horizontal: "left",
                        }}
                        transformOrigin={{
                          vertical: 0,
                          horizontal: 50,
                        }}
                      >
                        <MenuItem onClick={handleSettingsClick}>Edit</MenuItem>
                        <MenuItem onClick={handleDeleteClick}>
                          Delete App
                        </MenuItem>
                      </Menu>

                      <SettingDeleteModal
                        open={isDeleteModalOpen}
                        title={Modal.deleteTitle}
                        description={Modal.deleteDesc}
                        onClose={() => setIsDeleteModalOpen(false)}
                        onSubmit={handleDelete}
                      />

                      <AddAppDrawer
                        open={isSettingsDrawerOpen}
                        onClose={() => setIsSettingsDrawerOpen(false)}
                        editMode={true}
                        appDetail={appDetail}
                      />
                    </div>
                    <div className="detailRow">
                      <div className="detailCol">
                        <h4 className="key">Operating System</h4>
                        <p className="value">
                          {appDetail?.osType === "IOS" ? "iOS" : "Android"}
                        </p>
                      </div>
                      <div className="detailCol">
                        <h4 className="key">Platform</h4>
                        <p className="value">React Native</p>
                      </div>
                      <div className="detailCol">
                        <h4 className="key">Owner</h4>
                        <p className="value">{appDetail?.ownerName}</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="settingCardWrapper skeltonWrapper">
                    <div className="cardHead skelton-loader">
                      {appDetail?.appIcon && (
                        <figure className="cardImage skeleton-loader">
                          <img
                            src={appDetail?.appIcon || ProfileImageIcon}
                            alt="Icon"
                          />
                        </figure>
                      )}
                      <div
                        className={`cardMiddleContent ${appDetail?.appIcon ? "" : "noImage"}`}
                      >
                        <h2 className="cardTitle skeleton-loader "> </h2>
                      </div>
                      <ButtonComp
                        className="actionButton skeleton-loader"
                        type="button"
                        label=""
                        variant="contained"
                      />
                    </div>
                    <div className="detailRow">
                      <div className="detailCol">
                        <h4 className="key skeleton-loader">{""}</h4>
                        <p className="value skeleton-loader"></p>
                      </div>
                      <div className="detailCol">
                        <h4 className="key skeleton-loader">{""}</h4>
                        <p className="value skeleton-loader"></p>
                      </div>
                      <div className="detailCol">
                        <h4 className="key skeleton-loader">{""}</h4>
                        <p className="value skeleton-loader"></p>
                      </div>
                    </div>
                  </div>
                )}
                {/* collaborator section */}
                <CollaboratorSection
                  invite={invite}
                  setInvite={setInvite}
                  loadingCollab={loadingCollab}
                  filteredDataCollab={filteredDataCollab}
                  mainPageCollab={mainPageCollab}
                  rowsPerPageCollab={rowsPerPageCollab}
                  handleCollabChangePage={handleCollabChangePage}
                  countCollab={countCollab}
                  handleCollabChangeRowsPerPage={handleCollabChangeRowsPerPage}
                  handleInvite={handleInvite}
                  Modal={Modal}
                  isOwner={appDetail?.isOwner}
                  handleCollabModel={handleCollabModel}
                  delCollab={delCollab}
                  setDelCollab={setDelCollab}
                  handleDeleteCollab={handleDeleteCollab}
                />
              </div>
            </CustomTabPanel>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllAppsDetails;
