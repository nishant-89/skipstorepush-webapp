import { CheckCircle2, CircleAlert, Info } from "lucide-react";

import "./toast.scss";

export type ToastKind = "success" | "error" | "info";

const KIND_ICONS: Record<ToastKind, typeof CheckCircle2> = {
  success: CheckCircle2,
  error: CircleAlert,
  info: Info,
};

interface ToastAlertProps {
  message: string;
  subMessage?: string;
  kind: ToastKind;
}

const ToastAlert = ({ message, subMessage, kind }: ToastAlertProps) => {
  const Icon = KIND_ICONS[kind];

  return (
    <div className={`skipToastCard skipToastCard--${kind}`}>
      <span className="skipToastMark" aria-hidden="true">
        <Icon size={22} strokeWidth={2.4} />
      </span>
      <div className="skipToastCopy">
        <p className="skipToastMessage">{message}</p>
        {subMessage ? <p className="skipToastSub">{subMessage}</p> : null}
      </div>
    </div>
  );
};

export default ToastAlert;
