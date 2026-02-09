import Modal from "@mui/material/Modal";
import TrashIcon from "../../assets/svg/trash.svg?react";
import CloseIcon from "../../assets/svg/close.svg?react";

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
          <div className="mx-auto mb-4 w-20 h-20 rounded-full bg-[#FFDFDF] flex items-center justify-center">
            <TrashIcon className="w-[60px] h-[60px] text-[#E71010]" />
          </div>

          {/* Text */}
          <h2 className="text-lg font-normal mb-2">Delete</h2>
          <p className="text-[#545454] mb-8 font-light">
            Are you sure you want to{" "}
            <span className="text-[#C80C0C]">Delete</span> ?
          </p>

          {/* Actions */}
          <div className="flex justify-center gap-4">
            <button
              className="w-[100px] px-6 py-2 border rounded-md text-black bg-white border-[#CFCFCF] hover:bg-[#F1F1F1]"
              onClick={onClose}
            >
              Close
            </button>
            <button
              className="w-[100px] px-6 py-2 bg-[#E71010] text-white rounded-md hover:bg-[#C80C0C]"
              onClick={onConfirm}
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
