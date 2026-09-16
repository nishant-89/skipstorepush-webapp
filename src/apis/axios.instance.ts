import axios, {
  AxiosResponse,
  AxiosError,
  InternalAxiosRequestConfig,
} from "axios";

export const apiSuccessCode = {
  success: 200,
};
import { Dispatch } from "redux";

import store from "src/redux/store";
import { detectBrowserType, getDeviceId, getDeviceType } from "./apiValidator";

import ROUTES from "src/routes/routesPaths";
import { apiRoutes } from "src/utils/common/constants";

/**
 * Creates an Axios instance with a base URL, timeout, and default headers.
 * The instance is configured to use credentials for cross-origin requests.
 */
interface ResponseData {
  message?: string;
  data?: {
    description?: string;
  };
}

const apiBaseUrl = process.env.VITE_BASE_URL;
const basicAuth = process.env.VITE_BASIC_AUTH;
const subscriptionKey = process.env.VITE_SUBSCRIPTION_KEY;

// eslint-disable-next-line
let navigateFunction: any = null;
let dispatchFunction: Dispatch | null = null;

// eslint-disable-next-line
export const setNavigate = (navigate: any) => {
  navigateFunction = navigate;
};

export const navigateToLogin = () => {
  if (navigateFunction) {
    navigateFunction(ROUTES.LOGIN);
  }
};

export const setDispatch = (dispatch: Dispatch) => {
  dispatchFunction = dispatch;
};

// eslint-disable-next-line
export const dispatchEvent = (event: () => any) => {
  if (dispatchFunction) {
    // eslint-disable-next-line
    dispatchFunction(event());
  }
};

export const $axios = axios.create({
  baseURL: apiBaseUrl,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
    accept: "application/json",
  },
});

$axios.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const state = store.getState();
    const accessToken = state.auth.accessToken;
    config.headers["device_type"] = getDeviceType();

    if (config?.headers?.device_id === undefined) {
      config.headers["device_id"] = getDeviceId();
    }
    config.headers["browser_type"] = detectBrowserType();
    if (subscriptionKey) {
      config.headers["Ocp-Apim-Subscription-Key"] = subscriptionKey || "";
    }
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    if (config.url === `/${apiRoutes.UploadLogo}`) {
      config.headers.Authorization = `Basic ${basicAuth}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

$axios.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError<ResponseData>) => {
    const { response } = error;
    console.log("error", response);
    if (response?.status === 401) {
      localStorage.removeItem("persist:root");
      if (window.location.pathname !== ROUTES.LOGIN) {
        window.location.href = ROUTES.LOGIN;
      }
    }
    return Promise.reject(error);
  }
);
