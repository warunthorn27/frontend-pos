import React from "react";
import WarningIcon from "../../assets/svg/warning-icon2.svg?react";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  open,
  title,
  message,
  confirmText = "Yes",
  cancelText = "No",
  onConfirm,
  onCancel,
}) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="w-[520px] rounded-xl bg-white shadow-lg relative px-10 py-8">
        {/* close */}
        <button onClick={onCancel} className="absolute right-5 top-5 text-xl">
          ✕
        </button>

        {/* icon */}
        <div className="flex justify-center mb-4">
          <WarningIcon className="w-20 h-20" />
        </div>

        {/* content */}
        <h2 className="text-xl font-normal text-center mb-2">{title}</h2>
        <div className="text-center text-[#545454] mb-8">{message}</div>

        {/* actions */}
        <div className="flex justify-center gap-4">
          <button
            onClick={onCancel}
            className="w-28 h-10 rounded-md bg-red-500 text-white"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className="w-28 h-10 rounded-md bg-green-500 text-white"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
