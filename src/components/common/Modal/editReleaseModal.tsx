import { Button, Modal, TextareaAutosize } from "@mui/material";
import { EditReleaseModalIcon } from "src/utils/common/constants";

import "./editReleaseModal.scss";
import "./index.scss";

interface CustomModalProps {
  open: boolean;
  onSubmit?: () => void;
  title: string;
  description?: string;
  onClose?: () => void;
  notes: string;
  setNotes: React.Dispatch<React.SetStateAction<string>>;
}

const EditReleaseModal = ({
  open,
  onSubmit,
  title,
  description,
  onClose,
  notes,
  setNotes,
}: CustomModalProps) => {
  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      className="modalBackdrop"
    >
      <div className="modalBox releaseModalWrappper">
        <div className="modalWrap ">
          <div className="textWrap">
            <img src={EditReleaseModalIcon} alt="Icon" />
            <h2 id="modal-modal-title">{title}</h2>
            <p>{description}</p>
          </div>
          <div className="textAreaWrapper">
            <div className="form-field textarea">
              <TextareaAutosize
                placeholder="Enter Notes "
                value={notes}
                className="popupTextarea h250"
                onChange={(e) => {
                  setNotes(e?.target?.value);
                }}
              />
            </div>
          </div>
          <div className="buttonArea">
            <Button variant="outlined" onClick={onClose}>
              Cancel
            </Button>
            <Button
              variant="contained"
              disabled={notes.trim()?.length === 0}
              className="exitBtn"
              onClick={onSubmit}
            >
              Save
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default EditReleaseModal;
