import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getDataApi } from "src/apis/api";
import { setLoading } from "src/redux/slices/globalSlice";
import { apiRoutes, getErrorMessage } from "src/utils/common/constants/constants";
import { RootState } from "src/redux/rootReducers";
import ROUTES from "src/routes/routesPaths";
import { showAlert } from "src/utils/alert";

export type PublicProfileData = {
  id: number;
  fullName: string;
  email: string;
  profileImage?: string | null;
};

type PublicProfileResponse = {
  success?: boolean;
  data?: PublicProfileData;
};

export const usePublicProfileHelper = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const currentUserId = useSelector((state: RootState) => {
    const profileId = state.profile?.data?.id;
    const authUser = state.auth?.user;
    return profileId ?? authUser?.userId ?? authUser?.id ?? null;
  });
  const seeded = location.state as PublicProfileData | null;
  const [profile, setProfile] = useState<PublicProfileData | null>(
    seeded?.id && String(seeded.id) === String(id) ? seeded : null
  );
  const [missing, setMissing] = useState(false);

  useEffect(() => {
    if (!id) {
      setMissing(true);
      return;
    }
    if (currentUserId != null && String(currentUserId) === String(id)) {
      navigate(ROUTES.MY_ACCOUNT, { replace: true });
      return;
    }

    let cancelled = false;
    const load = async () => {
      try {
        dispatch(setLoading(true));
        setMissing(false);
        const response = (await getDataApi({
          path: `${apiRoutes.PublicProfile}/${id}`,
        })) as PublicProfileResponse;
        if (cancelled) {
          return;
        }
        if (response?.success && response.data) {
          setProfile(response.data);
        } else {
          setProfile(null);
          setMissing(true);
        }
      } catch (error) {
        if (!cancelled) {
          setProfile(null);
          setMissing(true);
          showAlert(2, getErrorMessage(error));
        }
      } finally {
        dispatch(setLoading(false));
      }
    };

    void load();
    return () => {
      cancelled = true;
    };
  }, [id, currentUserId, dispatch, navigate]);

  return { profile, missing };
};
