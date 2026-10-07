import React from "react";
import { toast, Id } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ToastAlert, { ToastKind } from "src/components/common/ToastAlert/ToastAlert";
import { eventListenerManager } from "./eventListenerFlag";

const commonErr = "OOPS! something went wrong!";
const toastList = new Set<Id>();
const MAXIMUM_TOAST = 5;

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
      position: "bottom-right",
      autoClose: 4000,
      draggable: false,
      closeOnClick: false,
      closeButton: false,
    });
    return;
  }

  const kind: ToastKind =
    type === 1 ? "success" : type === 3 ? "info" : "error";
  const notify =
    kind === "success"
      ? toast.success
      : kind === "info"
        ? toast.info
        : toast.error;

  if (toastList.size >= MAXIMUM_TOAST) {
    return;
  }

  const id: Id = notify(
    <ToastAlert message={message} subMessage={subMessage} kind={kind} />,
    {
      icon: false,
      closeButton: false,
      closeOnClick: false,
      draggable: false,
      className: `skipToast skipToast--${kind}`,
      onClose: () => {
        toastList.delete(id);
        isToastActive = false;
      },
    }
  );
  toastList.add(id);
};
