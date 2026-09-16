import React from "react";
import { Button, Modal } from "@mui/material";

import "./index.scss";

interface CustomModalProps {
  open: boolean;
  icon?: string;
  onSubmit?: () => void;
  onSecondaryClick?: () => void;
  title: string;
  description?: string;
  actionTitle: string;
  secondaryTitle?: string;
  onClose?: () => void;
  children?: React.ReactNode;
  mainClass?: string;
  isPrimaryButtonDisable?: boolean;
  isSecondaryButton?: boolean;
  descriptionElement?: JSX.Element | null;
  paddingClass?: boolean;
}

const CustomModal = ({
  open,
  onSubmit,
  onSecondaryClick,
  title,
  icon,
  description,
  descriptionElement,
  actionTitle,
  secondaryTitle = "Exit",
  onClose,
  children,
  mainClass = "",
  isPrimaryButtonDisable = false,
  isSecondaryButton = true,
  paddingClass = false,
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
            <img src={icon} alt="modal icon" />
            <h2 id="modal-modal-title">{title}</h2>
            {descriptionElement ? descriptionElement : <p>{description}</p>}
            {children}
          </div>
          {/* add class in api header modal pt10 */}
          <div className={`buttonArea ${paddingClass ? "pt12" : ""}`}>
            {isSecondaryButton && (
              <Button variant="outlined" onClick={onSecondaryClick}>
                {secondaryTitle}
              </Button>
            )}
            <Button
              variant="contained"
              disabled={isPrimaryButtonDisable}
              className="exitBtn"
              onClick={onSubmit}
            >
              {actionTitle}
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default CustomModal;
