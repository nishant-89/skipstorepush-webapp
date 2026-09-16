import { useInviteHelper } from "./helper";
import { useEffect } from "react";
import { useParams } from "react-router-dom";

export const Invite = () => {
  const { id } = useParams();
  const { handleCheckInvite } = useInviteHelper(id ?? "");

  // check inivitation link of collaborator
  useEffect(() => {
    id && handleCheckInvite();
  }, []);

  return null;
};
