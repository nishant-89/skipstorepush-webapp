import React from "react";
import { toast, Id } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { toasterWarning, toasterSuccess } from "./common/constants";
import { eventListenerManager } from "./eventListenerFlag";

const commonErr = "OOPS! something went wrong!";

const toastList = new Set();

const MAXIMUM_TOAST = 5;

/**
 * Defines the props for the `ToastComponent` component.
 *
 * @param message - The main message to display in the toast.
 * @param subMessage - The optional sub-message to display in the toast.
 */
interface ToastComponentProps {
  message: string;
  subMessage?: string;
}

/**
 * Renders a toast component with a message and an optional sub-message.
 *
 * @param message - The main message to display in the toast.
 * @param subMessage - The optional sub-message to display in the toast.
 * @returns A React component that renders the toast.
 */
const ToastComponent: React.FC<ToastComponentProps> = ({
  message,
  // subMessage,
}) => (
  <div className="alert-container">
    <h2
      className="alert-message"
      style={{ paddingLeft: 9, paddingRight: 18, textAlign: "left" }}
    >
      {message}
    </h2>
    {/* <p className="alert-sub-message">{subMessage}</p> */}
  </div>
);

/**
 * Displays a toast notification with a message and an optional sub-message.
 *
 * @param type - The type of toast to display (1 for success, 2 for error, 3 for info).
 * @param message - The main message to display in the toast. If not provided, a default error message will be used.
 * @param subMessage - The optional sub-message to display in the toast.
 */
let isToastActive = false;
export const showAlert = (
  type: number,
  message: string = commonErr,
  subMessage: string = ""
) => {
  const isAttached = eventListenerManager.getIsEventListenerAttached();
  if (isAttached || isToastActive) {
    return;
  }
  const redirectPath = localStorage.getItem("postLoginRedirectPath");
  if (!redirectPath?.includes("invitations")) {
    isToastActive = true;
  }

  if (toast.error === undefined) {
    toast(message, {
      position: "top-left",
      autoClose: 300000,
      draggable: false,
      closeOnClick: true,
    });
  }

  const handleClose = (id: Id) => {
    toastList.delete(id);
    isToastActive = false;
  };

  switch (type) {
    case 1: {
      if (toastList.size < MAXIMUM_TOAST) {
        const id: Id = toast.success(
          <ToastComponent message={message} subMessage={subMessage} />,
          {
            icon: <img src={toasterSuccess} alt="alert" />,
            // onClose: () => toastList.delete(id),
            onClose: () => handleClose(id),
          }
        );
        toastList.add(id);
      }
      break;
    }
    case 2: {
      if (toastList.size < MAXIMUM_TOAST) {
        const id: Id = toast.error(
          <ToastComponent message={message} subMessage={subMessage} />,
          {
            icon: <img src={toasterWarning} alt="alert" />,
            // onClose: () => toastList.delete(id),
            onClose: () => handleClose(id),
          }
        );
        toastList.add(id);
      }
      break;
    }
    case 3: {
      if (toastList.size < MAXIMUM_TOAST) {
        const id: Id = toast.info(
          <ToastComponent message={message} subMessage={subMessage} />,
          {
            // onClose: () => toastList.delete(id),
            onClose: () => handleClose(id),
          }
        );
        toastList.add(id);
      }
      break;
    }
    default:
  }
};
