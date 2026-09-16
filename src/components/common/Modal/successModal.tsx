import CustomModal from ".";
import { CircleCheck } from "src/utils/common/constants";

interface ModalProps {
  open: boolean;
  setOpen: (value: boolean) => void;
}
const SuccessModal = ({ open, setOpen }: ModalProps) => {
  const handleSubmit = () => {
    setOpen(false);
  };
  return (
    <CustomModal
      title="User Added Successfully"
      description="An email with the account information has been sent to the user."
      open={open}
      actionTitle="Exit"
      // secondaryTitle="Cancel"
      isSecondaryButton={false}
      icon={CircleCheck}
      onSubmit={handleSubmit}
    ></CustomModal>
  );
};

export default SuccessModal;
