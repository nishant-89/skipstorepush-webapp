import { logoutIcon } from "src/utils/common/constants";
import CustomModal from ".";
import { useModalHelper } from "./helper";

interface LogoutProps {
  isOpen: boolean;
  handleClose: () => void;
}
const LogoutModal: React.FC<LogoutProps> = ({
  isOpen,
  handleClose,
}: LogoutProps) => {
  const { logoutUser } = useModalHelper();
  const handleSubmit = () => {
    logoutUser();
    handleClose();
  };
  return (
    <CustomModal
      title="Are You Sure You Want To Logout?"
      description=""
      actionTitle="Logout"
      secondaryTitle="Cancel"
      onSubmit={handleSubmit}
      //onClose={handleClose}
      onSecondaryClick={handleClose}
      icon={logoutIcon}
      open={isOpen}
      paddingClass={true}
    ></CustomModal>
  );
};

export default LogoutModal;
