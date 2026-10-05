import * as React from "react";
import { useDispatch } from "react-redux";
import { KeyRound, Pencil, Trash2 } from "lucide-react";
import { ProfileImageIcon } from "src/utils/common/constants/constants";
import TableComponent from "src/components/common/Table/Table";
import TableDataLoader from "src/components/common/Loader/tableDataLoader";
import NoData from "src/components/common/NoData/NoData";
import Breadcrumbs from "src/components/common/BreadCrumbs/BreadCrumbs";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import SettingDeleteModal from "src/components/common/Modal/deleteModal";
import DebounceSearch from "src/components/common/Search/Search";
import SelectComponent from "src/components/common/Select/Select";

import AddAppDrawer from "../AddAppDrawer/addAppDrawer";
import { useAllAppsDetailHelper } from "./helper";
import ReleaseDrawer from "../ReleaseDrawer/ReleaseDrawer";
import { Modal } from "./constant";
import { handleEnvironment } from "src/containers/redux/slices/release";
import CollaboratorSection from "./collaborator";
import { OsBrandIcon } from "../../osIcons";

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

const osLabel = (osType?: string) => {
  if (!osType) return "N/A";
  return osType === "IOS" ? "iOS" : "Android";
};

const AllAppsDetails = () => {
  const dispatch = useDispatch();
  const {
    isDrawerOpen,
    isDeleteModalOpen,
    isSettingsDrawerOpen,
    value,
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
    handleDeleteClick,
    handleSettingsClick,
    handleOpenDrawer,
    handleCloseDrawer,
    handleChange,
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
    collabTarget,
    clearCollabRemoval,
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

  const selectedEnvLabel =
    envList?.find((env) => String(env.value) === String(selectedFilters))
      ?.label ?? "";

  return (
    <div className="AllAppsDetailWrapper">
      <Breadcrumbs
        contextName={appDetail?.name}
        loading={!appDetail?.name}
      />

      <div className="cardBgWrapper AllAppsDetailMainWrapper">
        {realeaseLoader ? (
          <div className="appDetailHero skeltonWrapper">
            <div className="appDetailHeroCopy">
              <h1 className="skeleton-loader w220"></h1>
              <p className="skeleton-loader w140"></p>
            </div>
          </div>
        ) : (
          <header className="appDetailHero">
            <div className="appDetailHeroMain">
              {appDetail?.appIcon ? (
                <>
                  <img
                    className="appDetailIcon"
                    src={appDetail.appIcon}
                    alt="Icon"
                  />
                  <span className="appDetailHeroDivider" aria-hidden="true" />
                </>
              ) : null}
              <div className="appDetailHeroCopy">
                <div className="appDetailEyebrow">
                  <OsBrandIcon osType={appDetail?.osType} />
                  {selectedEnvLabel ? (
                    <span className="appDetailOs">{selectedEnvLabel}</span>
                  ) : null}
                </div>
                <h1>{appDetail?.name || "App"}</h1>
                {appDetail?.ownerName ? (
                  <p>Owner · {appDetail.ownerName}</p>
                ) : null}
              </div>
            </div>
            <div className="appDetailCtas">
              {value === 0 && envList && envList.length > 0 ? (
                <button
                  type="button"
                  className="appBtn appBtn--secondary appBtn--sm SettingBtn"
                  aria-label="Deployment keys"
                  onClick={handleOpenDrawer}
                >
                  <KeyRound size={15} aria-hidden />
                  Keys
                </button>
              ) : null}
              {value === 1 && appDetail?.isOwner ? (
                <>
                  <button
                    type="button"
                    className="appBtn appBtn--secondary appBtn--sm"
                    onClick={handleSettingsClick}
                  >
                    <Pencil size={15} aria-hidden />
                    Edit
                  </button>
                  <button
                    type="button"
                    className="appBtn appBtn--secondary appBtn--sm appDetailCta--danger"
                    onClick={handleDeleteClick}
                  >
                    <Trash2 size={15} aria-hidden />
                    Delete App
                  </button>
                </>
              ) : null}
            </div>
          </header>
        )}

        <div className="AllAppsDetailInnerWrapper">
          <div className="DetailsTabSection">
            <Tabs
              value={value}
              onChange={handleChange}
              aria-label="App details"
              scrollButtons="auto"
              variant="scrollable"
            >
              <Tab label="Releases" {...a11yProps(0)} />
              <Tab label="Settings" {...a11yProps(1)} />
            </Tabs>
          </div>
          <div className="tabContentWrapper">
            <CustomTabPanel value={value} index={0}>
              <section className="appDetailPanel ReleaseMainWrapper">
                <div className="appDetailPanelHead TopSection">
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
                </div>

                <div className="tableSection releaseTable">
                  <div className="adminAccessTableWrapper tableWrapper bgWhite p00">
                    {renderTableContent()}
                  </div>
                </div>
              </section>
            </CustomTabPanel>
          </div>
          <div className="tabContentWrapper">
            <CustomTabPanel value={value} index={1}>
              <div className="SettingsMainWrapper">
                {!realeaseLoader ? (
                  <section className="appDetailPanel settingCardWrapper">
                    <h2>App details</h2>
                    <div className="appDetailMetaGrid detailRow">
                      <div className="appDetailField detailCol">
                        <span className="appDetailFieldLabel key">
                          Operating System
                        </span>
                        <div className="appDetailFieldValue value">
                          {osLabel(appDetail?.osType)}
                        </div>
                      </div>
                      <div className="appDetailField detailCol">
                        <span className="appDetailFieldLabel key">Platform</span>
                        <div className="appDetailFieldValue value">
                          React Native
                        </div>
                      </div>
                      <div className="appDetailField detailCol">
                        <span className="appDetailFieldLabel key">Owner</span>
                        <div className="appDetailFieldValue value">
                          {appDetail?.ownerName || "N/A"}
                        </div>
                      </div>
                    </div>
                  </section>
                ) : (
                  <div className="appDetailPanel settingCardWrapper skeltonWrapper">
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
                      <div className="actionButton skeleton-loader" />
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
                  collabTarget={collabTarget}
                  onCloseCollabModal={clearCollabRemoval}
                />
              </div>
            </CustomTabPanel>
          </div>
        </div>
      </div>

      <ReleaseDrawer
        open={isDrawerOpen}
        onClose={handleCloseDrawer}
        envList={envList}
      />

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
  );
};

export default AllAppsDetails;
