import { Button, Modal } from "@mui/material";
import { RootReducerType } from "src/redux/rootReducers";
import { useSelector } from "react-redux";
import { showAlert } from "src/utils/alert";

import "./index.scss";

interface CustomModalProps {
  open: boolean;
  title: string;
  description?: string;
  onClose: () => void;
  mainClass?: string;
}

const AccessKeyModal = ({
  open,
  title,
  onClose,
  mainClass = "",
}: CustomModalProps) => {
  const { user } = useSelector((state: RootReducerType) => state.auth);
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
            <h2 className="accessKeyTitle" id="modal-modal-title">
              {title}
            </h2>
            <p>{user?.accessKey}</p>
          </div>
          <div className="buttonArea">
            <Button
              variant="contained"
              className="exitBtn"
              onClick={() => {
                navigator?.clipboard?.writeText(user?.accessKey);
                showAlert(1, "Access Key copied to clipboard");
                onClose();
              }}
            >
              Copy Key
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default AccessKeyModal;
