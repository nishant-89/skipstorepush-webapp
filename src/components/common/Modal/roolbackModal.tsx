import { Button, Modal } from "@mui/material";
import { RoolbackModalIcon } from "src/utils/common/constants";

import "./index.scss";

interface CustomModalProps {
  open: boolean;
  onSubmit?: () => void;
  onSecondaryClick?: () => void;
  title: string;
  description?: string;
  onClose?: () => void;
  mainClass?: string;
  isPrimaryButtonDisable?: boolean;
}

const RoolbackModal = ({
  open,
  onSubmit,
  title,
  description,
  onClose,
  mainClass = "",
  isPrimaryButtonDisable = false,
}: CustomModalProps) => {
  return (
    <Modal
      open={open}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      className="modalBackdrop"
    >
      <div className="modalBox">
        <div className={`modalWrap ${mainClass}`}>
          <div className="textWrap">
            <img src={RoolbackModalIcon} alt="Icon" />
            <h2 className="m3" id="modal-modal-title">
              {title}
            </h2>
            <p>{description}</p>
          </div>
          <div className="buttonArea">
            <Button variant="outlined" onClick={onClose}>
              Cancel
            </Button>
            <Button
              variant="contained"
              disabled={isPrimaryButtonDisable}
              className="exitBtn"
              onClick={onSubmit}
            >
              Rollback
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default RoolbackModal;
