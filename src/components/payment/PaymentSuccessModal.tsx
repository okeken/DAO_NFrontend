import Modal from "../core/MainModal";
import { Close } from "@mui/icons-material";
import Button from "../core/Button";
import SuccesIcon from "../../icons/SuccesIcon";
import Link from "next/link";

interface PaymentSuccessModalProps {
  isOpen: boolean;
  togglePaymentSuccessModal: () => void;
}

const PaymentSuccessModal = ({
  isOpen,
  togglePaymentSuccessModal,
}: PaymentSuccessModalProps) => {
  return (
    <Modal
      backgroundColor="transparent"
      isOpen={isOpen}
      onDismiss={togglePaymentSuccessModal}
      maxWidth={400}
      isFullWidth={true}
      noPadding={true}
    >
      <div style={{zIndex: '9999' }} className="flex justify-center items-center w-auto h-full">
        <div className="w-full rounded md:w-1/2 py-6 lg:py-6 px-10 xl:w-1/3 bg-white max-h-[85vh] overflow-y-auto no-scrollbar">
          <div className="flex justify-between items-center pt-4">
            <h1 className="flex-1 text-center font-work_sans font-semibold text-base text-dark2">
              Success
            </h1>
            {/* <button onClick={togglePaymentSuccessModal}>
              <Close className="text-dark5" />
            </button> */}
          </div>

          <div className="pt-8 pb-6">
            <div className="flex justify-center items-center w-20 h-20 mx-auto rounded-full bg-[#EBFCD5]">
              <SuccesIcon />
            </div>
          </div>

          <p className="font-work_sans text-[#5C657D] text-label text-center">
            Payment made successfully
          </p>

          <Link href={"/"} passHref>
            <Button
              onClick={togglePaymentSuccessModal}
              className="w-full bg-[#EF4444] !h-[48px] mt-8"
            >
              <h1 className="font-outfit font-semibold text-sm text-white">
                Close
              </h1>
            </Button>
          </Link>
        </div>
      </div>
    </Modal>
  );
};

export default PaymentSuccessModal;
