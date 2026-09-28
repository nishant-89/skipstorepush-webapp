import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProfileDataRequest } from "src/containers/redux/slices/profile";
import { RootState } from "src/redux/rootReducers";

export const useAccountHelper = () => {
  const dispatch = useDispatch();
  const { data, loading, error } = useSelector(
    (state: RootState) => state.profile
  );
  const { user } = useSelector((state: RootState) => state.auth);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isAccessKeyModalOpen, setIsAccessKeyModalOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchProfileDataRequest());
  }, [dispatch]);

  const isGithubAuth = data?.authType === "GITHUB";
  const githubProfileUrl = data?.fullName
    ? `https://github.com/${data.fullName}`
    : "";

  const openAccessKeyModal = () => setIsAccessKeyModalOpen(true);
  const closeAccessKeyModal = () => setIsAccessKeyModalOpen(false);
  const openPasswordModal = () => setIsPasswordModalOpen(true);
  const closePasswordModal = () => setIsPasswordModalOpen(false);

  return {
    data,
    loading,
    error,
    accessKey: user?.accessKey || "",
    isGithubAuth,
    githubProfileUrl,
    isPasswordModalOpen,
    isAccessKeyModalOpen,
    openAccessKeyModal,
    closeAccessKeyModal,
    openPasswordModal,
    closePasswordModal,
  };
};
