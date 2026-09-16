import { useState, useEffect, useCallback } from "react";
import { useModalHelper } from "../components/common/Modal/helper";

const useSessionTimeout = (
  timeoutDuration = 24 * 60 * 60 * 1000,
  warningDuration = 10 * 60 * 1000
) => {
  const [remainingTime, setRemainingTime] = useState(timeoutDuration);
  const [showWarningModal, setShowWarningModal] = useState(false);
  const { logoutUser } = useModalHelper();
  const resetTimeout = useCallback(() => {
    setRemainingTime(timeoutDuration);
    setShowWarningModal(false);
  }, [timeoutDuration]);

  useEffect(() => {
    const activityEvents = ["click", "keydown"];

    const handleActivity = () => {
      resetTimeout();
    };

    activityEvents.forEach((event) =>
      window.addEventListener(event, handleActivity)
    );

    const interval = setInterval(() => {
      setRemainingTime((prev) => {
        if (prev <= warningDuration && prev > 0) {
          setShowWarningModal(true);
        }
        if (prev === 1000) {
          clearInterval(interval);
          setShowWarningModal(false);
          logoutUser();
        }
        return prev - 1000;
      });
    }, 1000);

    return () => {
      clearInterval(interval);
      activityEvents.forEach((event) =>
        window.removeEventListener(event, handleActivity)
      );
    };
  }, [resetTimeout, warningDuration]);

  return { showWarningModal, remainingTime, setShowWarningModal };
};

export default useSessionTimeout;
