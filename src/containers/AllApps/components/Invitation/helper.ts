import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setLoading } from "src/redux/slices/globalSlice";
import ROUTES from "src/routes/routesPaths";
import { getDataApi } from "src/apis/api";
import { apiRoutes, getErrorMessage } from "src/utils/common/constants";
import { showAlert } from "src/utils/alert";

import { ApiResponse } from "../../types";

export const useInviteHelper = (id: string) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // check collaborator invite
  const handleCheckInvite = async () => {
    dispatch(setLoading(true));
    try {
      const res: ApiResponse = (await getDataApi({
        path: `${apiRoutes.CheckInvite}?invitationId=${id}`,
      })) as ApiResponse;

      if (res?.statusCode === 200) {
        handleAcceptInvite();
      }
    } catch (error) {
      dispatch(setLoading(false));
      navigate(ROUTES.ALL_APPS);
      const errorMessage = getErrorMessage(error);
      showAlert(2, errorMessage ?? "Error");
    }
  };
  // accept collaborator invite
  const handleAcceptInvite = async () => {
    try {
      const res: ApiResponse = (await getDataApi({
        path: `${apiRoutes.AcceptInvite}?invitationId=${id}`,
      })) as ApiResponse;

      if (res?.statusCode === 200) {
        dispatch(setLoading(false));
        localStorage.removeItem("postLoginRedirectPath");
        showAlert(1, res?.message);
        navigate(ROUTES.ALL_APPS);
      }
    } catch (error) {
      dispatch(setLoading(false));
      navigate(ROUTES.ALL_APPS);
      const errorMessage = getErrorMessage(error);
      localStorage.removeItem("postLoginRedirectPath");
      showAlert(2, errorMessage ?? "Error");
    }
  };

  return { handleCheckInvite };
};
