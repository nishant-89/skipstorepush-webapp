import React from "react";
import ButtonComp from "src/components/common/Button/Button";
import TableDataLoader from "src/components/common/Loader/tableDataLoader";

import InviteCollaborateModal from "src/components/common/Modal/inviteCollaborateModal";
import TableComponent from "src/components/common/Table/Table";
import { InviteShareIcon } from "src/utils/common/constants/constants";
import { COLLABRATOR_RESPONSE_TYPE, InviteFormValues } from "../../types";

import CollabDeleteModal from "src/components/common/Modal/deleteModal";
import { getCollabratorColumns } from "./column";

interface CollaboratorSectionProps {
  invite: boolean;
  setInvite: (val: boolean) => void;
  loadingCollab: boolean;
  filteredDataCollab: COLLABRATOR_RESPONSE_TYPE[];
  mainPageCollab: number;
  rowsPerPageCollab: number;
  handleCollabChangePage: (newPage: number) => void;
  countCollab: number;
  handleCollabChangeRowsPerPage: (newRowsPerPage: number) => void;
  handleInvite: (values: InviteFormValues) => void;
  Modal: {
    inviteTitle: string;
    inviteDesc: string;
    deleteCollabTitle: string;
    deleteCollabDesc: string;
    removeCollabTitle: string;
    removeCollabDesc: string;
  };
  isOwner: boolean;
  handleCollabModel: (collaborator: COLLABRATOR_RESPONSE_TYPE) => void;
  delCollab: boolean;
  setDelCollab: React.Dispatch<React.SetStateAction<boolean>>;
  handleDeleteCollab: () => void;
  collabTarget?: { type: "invite" | "member" } | null;
  onCloseCollabModal?: () => void;
}

const CollaboratorSection: React.FC<CollaboratorSectionProps> = ({
  invite,
  setInvite,
  loadingCollab,
  filteredDataCollab,
  mainPageCollab,
  rowsPerPageCollab,
  handleCollabChangePage,
  countCollab,
  handleCollabChangeRowsPerPage,
  handleInvite,
  Modal,
  isOwner,
  handleCollabModel,
  delCollab,
  setDelCollab,
  handleDeleteCollab,
  collabTarget,
  onCloseCollabModal,
}) => {
  const columns = getCollabratorColumns(handleCollabModel, isOwner);
  const isMemberRemoval = collabTarget?.type === "member";
  return (
    <div className="collaboratorWrapper">
      <div className="collaboratorHeader">
        <h2 className="headerTitle">Collaborators</h2>
        {isOwner && (
          <ButtonComp
            className="InviteBtn"
            variant="contained"
            label="Invite"
            isIcon
            icon={InviteShareIcon}
            onClick={() => setInvite(true)}
          />
        )}
      </div>
      {/* collaborator table and loder skelton */}
      <div className="tableSection collaboratorTable">
        <div className="adminAccessTableWrapper tableWrapper bgWhite p00">
          {loadingCollab ? (
            <TableDataLoader columns={columns} />
          ) : (
            <TableComponent
              tableData={filteredDataCollab}
              columns={columns}
              page={mainPageCollab}
              rowsPerPage={rowsPerPageCollab}
              onPageChange={handleCollabChangePage}
              count={countCollab}
              onRowsPerPageChange={handleCollabChangeRowsPerPage}
            />
          )}
        </div>
      </div>
      {/* collaborator model */}
      <InviteCollaborateModal
        open={invite}
        title={Modal.inviteTitle}
        description={Modal.inviteDesc}
        onClose={() => {
          setInvite(false);
        }}
        handleSubmit={handleInvite}
      />
      <CollabDeleteModal
        open={delCollab}
        title={
          isMemberRemoval ? Modal?.removeCollabTitle : Modal?.deleteCollabTitle
        }
        description={
          isMemberRemoval ? Modal?.removeCollabDesc : Modal?.deleteCollabDesc
        }
        isCollabModal={true}
        confirmLabel={isMemberRemoval ? "Remove" : "Delete"}
        onClose={() =>
          onCloseCollabModal ? onCloseCollabModal() : setDelCollab(false)
        }
        onSubmit={handleDeleteCollab}
      />
    </div>
  );
};

export default CollaboratorSection;
