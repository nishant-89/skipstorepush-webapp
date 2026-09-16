import { Button, Modal } from "@mui/material";
import { RooloutUpdateIcon } from "src/utils/common/constants";

import "./index.scss";

interface CustomModalProps {
  open: boolean;
  onSubmit?: () => void;
  title: string;
  description?: string;
  onClose?: () => void;
  mainClass?: string;
}

const RolloutUpdateModal = ({
  open,
  onSubmit,
  title,
  description,
  onClose,
  mainClass = "",
}: CustomModalProps) => {
  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      className="modalBackdrop"
    >
      <div className="modalBox">
        <div className={`modalWrap ${mainClass}`}>
          <div className="textWrap">
            <img src={RooloutUpdateIcon} alt="Icon" />
            <h2 className="mb6" id="modal-modal-title">
              {title}
            </h2>
            <p>{description}</p>
          </div>
          <div className="buttonArea">
            <Button variant="outlined" onClick={onClose}>
              Cancel
            </Button>
            <Button variant="contained" className="exitBtn" onClick={onSubmit}>
              Confirm
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default RolloutUpdateModal;
