import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { fetchAuthenticateToken } from "src/containers/redux/slices/auth";
import { setLoading } from "src/redux/slices/globalSlice";
import { Redirect } from "./constant";

export const useLoginHelper = () => {
  const dispatch = useDispatch();

  const params = new URLSearchParams(location.search);
  const codeParam = params.get("code");

  const CLIENT_ID = process.env.VITE_CLIENT_ID;
  const REDIRECT_URI = process.env.VITE_REDIRECT_URI;

  //login with github code
  useEffect(() => {
    if (codeParam) {
      dispatch(setLoading(true));
      dispatch(
        fetchAuthenticateToken({
          code: codeParam,
        })
      );
    }
  }, []);

  // redirect login to github
  const handleClick = () => {
    window.location.assign(
      `${Redirect.github}${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=${encodeURIComponent("user:email")}`
    );
  };

  return {
    handleClick,
  };
};
