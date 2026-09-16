import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { postDataApi } from "src/apis/api";
import { resetAccessToken } from "src/containers/redux/slices/auth";

import { setLoading } from "src/redux/slices/globalSlice";
import ROUTES from "src/routes/routesPaths";
import { showAlert } from "src/utils/alert";
import { apiRoutes, getErrorMessage } from "src/utils/common/constants";
import { LogoutResponse } from "src/utils/types";

export const useModalHelper = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  //logout user api integration
  const logoutUser = async () => {
    try {
      dispatch(setLoading(true));
      const response: unknown = await postDataApi({ path: apiRoutes.Logout });
      const typedResponse = response as LogoutResponse;

      if (typedResponse && typedResponse.statusCode === 200) {
        localStorage.removeItem("persist:root");
        dispatch(resetAccessToken());
        showAlert(1, typedResponse?.data?.message);
        navigate(ROUTES.LOGIN);
      }
      dispatch(setLoading(false));
    } catch (error) {
      dispatch(setLoading(false));
      const errorMessage = getErrorMessage(error);
      showAlert(2, errorMessage);
    }
  };

  const formatRemainingTime = (milliseconds: number): string => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    const formattedMinutes = minutes.toString().padStart(2, "0");
    const formattedSeconds = seconds.toString().padStart(2, "0");

    return `${formattedMinutes}:${formattedSeconds}`;
  };

  return { logoutUser, formatRemainingTime };
};
