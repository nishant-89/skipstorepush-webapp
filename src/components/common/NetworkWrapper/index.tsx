import React, { useState, useEffect, ReactNode } from "react";
import NoInternetFound from "../NoInternetFound";
import { noInternet } from "src/utils/common/constants";
interface NetworkWrapperProps {
  children: ReactNode;
}
interface NetworkInformation extends EventTarget {
  effectiveType: string;
  downlink: number;
  rtt: number;
  saveData: boolean;
  addEventListener: (
    type: "change",
    listener: (this: NetworkInformation, ev: Event) => void,
  ) => void;
  removeEventListener: (
    type: "change",
    listener: (this: NetworkInformation, ev: Event) => void,
  ) => void;
}

const getConnection = (): NetworkInformation | undefined => {
  return "connection" in navigator
    ? (navigator.connection as NetworkInformation)
    : undefined;
};

const NetworkWrapper: React.FC<NetworkWrapperProps> = ({ children }) => {
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);

  const cacheImage = async (imageUrl: string): Promise<void> => {
    try {
      const response: Response = await fetch(imageUrl);
      const blob: Blob = await response.blob();
      const reader: FileReader = new FileReader();

      reader.onloadend = function (): void {
        if (typeof reader.result === "string") {
          localStorage.setItem("noInternetImage", reader.result);
        } else {
          console.error("Failed to convert image to a string");
        }
      };

      reader.readAsDataURL(blob);
    } catch (error) {
      console.error("Error fetching image:", error);
    }
  };

  const updateNetworkStatus = () => {
    const connection = getConnection();

    if (connection) {
      setIsOnline(connection.downlink > 0 && navigator.onLine);
    } else {
      setIsOnline(navigator.onLine);
    }
  };

  useEffect(() => {
    cacheImage(noInternet);

    updateNetworkStatus();

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    const connection = getConnection();
    if (connection) {
      connection.addEventListener("change", updateNetworkStatus);
    }

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      if (connection) {
        connection.removeEventListener("change", updateNetworkStatus);
      }
    };
  }, []);

  return <div>{isOnline ? children : <NoInternetFound />}</div>;
};

export default NetworkWrapper;
