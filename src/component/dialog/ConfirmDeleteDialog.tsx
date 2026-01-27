import Modal from "@mui/material/Modal";
import TrashIcon from "../../assets/svg/trash.svg?react";

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
        <div className="w-[420px] bg-white rounded-xl px-8 py-8 text-center relative">
          {/* Close */}
          <button className="absolute right-4 top-4 text-xl" onClick={onClose}>
            ✕
          </button>

          {/* Icon */}
          <div className="mx-auto mb-5 w-20 h-20 rounded-full bg-red-100 flex items-center justify-center">
            <TrashIcon className="w-10 h-10 text-red-600" />
          </div>

          {/* Text */}
          <h2 className="text-xl font-medium mb-2">Delete</h2>
          <p className="text-gray-500 mb-8">
            Are you sure you want to{" "}
            <span className="text-red-600">Delete</span> ?
          </p>

          {/* Actions */}
          <div className="flex justify-center gap-4">
            <button className="px-6 py-2 border rounded-md" onClick={onClose}>
              Close
            </button>
            <button
              className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
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
