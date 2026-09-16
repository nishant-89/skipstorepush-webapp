import { $axios } from "./axios.instance";
import ROUTES from "src/routes/routesPaths";
import { v4 as uuidv4 } from "uuid";
import { deviceType } from "src/utils/common/constants";
import { getDeviceIdData, setDeviceIdData } from "src/utils/common/session";

export const getDeviceType = (): number => {
  const userAgent = navigator.userAgent.toLowerCase();

  if (/mobi|android/i.test(userAgent)) return deviceType.MOBILE;
  const isTouchDevice =
    "ontouchstart" in window || navigator.maxTouchPoints > 1;

  const isIpad =
    /ipad/.test(userAgent) ||
    (isTouchDevice && navigator.maxTouchPoints > 1 && /mac os/.test(userAgent));

  if (/mobi|android/i.test(userAgent) && !isIpad) {
    return deviceType.MOBILE;
  }

  if (
    isIpad ||
    (/tablet|playbook|kindle|silk/i.test(userAgent) && isTouchDevice)
  ) {
    return deviceType.TABLET;
  }

  if (/mac|windows|linux/i.test(userAgent)) return deviceType.DESKTOP;
  if (/wearable|watch/i.test(userAgent)) return deviceType.WEARABLE;
  if (/iot|raspberry|arduino|esp32|smarthome/i.test(userAgent))
    return deviceType.IOT;

  return deviceType.DESKTOP;
};

/**
 * Retrieves the browser fingerprint (device ID).
 */
export const getDeviceId = () => {
  const deviceId = getDeviceIdData();
  if (deviceId) {
    return deviceId;
  } else {
    const uuid = uuidv4().replace(/-/g, "");
    setDeviceIdData(uuid || "");
    return uuid || "";
  }
};

/**
 * Fetches the user's IP address.
 * @returns {Promise<string>} - The user's IP address.
 */
export const getIpAddress = async (): Promise<string> => {
  try {
    const response = await $axios.get(ROUTES.IP_ROUTE);
    return response.data.ip || "";
  } catch (error) {
    console.error("Error fetching IP address:", error);
    return "";
  }
};

export const browserType = {
  CHROME: 1,
  FIREFOX: 2,
  SAFARI: 3,
  EDGE: 4,
  OPERA: 5,
  IE: 6,
  OTHER: 7,
};

export const returnBrowserType = (type: string) => {
  if (browserType.CHROME.toString() === type) {
    return "Chrome";
  } else if (browserType.FIREFOX.toString() === type) {
    return "FireFox";
  } else if (browserType.SAFARI.toString() === type) {
    return "Safari";
  } else if (browserType.EDGE.toString() === type) {
    return "Edge";
  } else if (browserType.OPERA.toString() === type) {
    return "Opera";
  } else if (browserType.IE.toString() === type) {
    return "Internet Explorer";
  } else if (browserType.OTHER.toString() === type) {
    return "Other";
  } else if (type === "") {
    return "Mobile";
  } else return "Unknown Browser";
};
export const detectBrowserType = (): number => {
  const userAgent = navigator.userAgent.toLowerCase();

  // Edge detection (Edge now uses Chrome engine, so check before Chrome)
  if (userAgent.includes("edg")) {
    return browserType.EDGE;
  }

  // Opera detection
  if (userAgent.includes("opera") || userAgent.includes("opr")) {
    return browserType.OPERA;
  }

  // Chrome detection (Exclude Edge and Opera because they contain 'chrome' in the user agent)
  if (
    userAgent.includes("chrome") &&
    !userAgent.includes("edg") &&
    !userAgent.includes("opr")
  ) {
    return browserType.CHROME;
  }

  // Firefox detection
  if (userAgent.includes("firefox")) {
    return browserType.FIREFOX;
  }

  // Safari detection (Exclude Chrome as Safari user agent also includes 'chrome')
  if (userAgent.includes("safari") && !userAgent.includes("chrome")) {
    return browserType.SAFARI;
  }

  // Internet Explorer detection (Legacy versions)
  if (userAgent.includes("msie") || userAgent.includes("trident")) {
    return browserType.IE;
  }

  // If none of the above match, return OTHER
  return browserType.OTHER;
};
