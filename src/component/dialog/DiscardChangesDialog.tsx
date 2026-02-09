import Modal from "@mui/material/Modal";
import CloseIcon from "../../assets/svg/close.svg?react";
import WarningIcon from "../../assets/svg/warning-icon2.svg?react";

type Props = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

export default function ConfirmDeleteDialog({
  open,
  onClose,
  onConfirm,
}: Props) {
  return (
    <Modal open={open} onClose={onClose}>
      <div className="fixed inset-0 flex items-center justify-center bg-black/40">
        <div className="w-[500px] bg-white rounded-xl px-8 py-8 text-center relative">
          {/* Close */}
          <button className="absolute right-4 top-3" onClick={onClose}>
            <CloseIcon className="w-7 h-7" />
          </button>

          {/* Icon */}
          <div className="mx-auto mb-4 flex items-center justify-center">
            <WarningIcon className="w-20 h-20" />
          </div>

          {/* Text */}
          <h2 className="text-lg font-normal mb-2">Discard changes</h2>
          <p className="text-[#545454] mb-8 font-light">
            Changes won't be saved. Continue?
          </p>

          {/* Actions */}
          <div className="flex justify-center gap-4">
            <button
              className="w-[140px] px-6 py-2 border rounded-md text-black bg-white border-[#CFCFCF] hover:bg-[#F1F1F1]"
              onClick={onClose}
            >
              Keep editing
            </button>
            <button
              className="w-[100px] px-6 py-2 bg-[#E71010] text-white rounded-md hover:bg-[#C80C0C]"
              onClick={onConfirm}
            >
              Discard
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
