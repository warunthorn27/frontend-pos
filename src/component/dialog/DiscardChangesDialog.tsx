
import CloseIcon from "../../assets/svg/close.svg?react";
import WarningIcon from "../../assets/svg/warning-icon2.svg?react";

type Props = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  variant?: "default" | "userForm";
};

export default function ConfirmDeleteDialog({
  open,
  onClose,
  onConfirm,
  variant = "default",
}: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[1500] flex items-center justify-center bg-black/40">
      <div className="w-[500px] bg-white rounded-xl px-8 py-8 text-center relative shadow-xl">
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
          Your changes won't be saved. Do you want to continue?
        </p>

        {/* Actions */}
        <div className="flex justify-center gap-4">
          <button
            className={
              variant === "userForm"
                ? "px-4 py-[6px] rounded-md bg-white border border-[#CFCFCF] text-base hover:bg-[#F1F1F1] text-black whitespace-nowrap"
                : "w-[140px] px-6 py-2 border rounded-md text-black bg-white border-[#CFCFCF] hover:bg-[#F1F1F1]"
            }
            onClick={onClose}
          >
            Keep editing
          </button>
          <button
            className={
              variant === "userForm"
                ? "px-4 py-[6px] min-w-[100px] rounded-md bg-[#E71010] hover:bg-[#C80C0C] text-white text-base font-normal whitespace-nowrap"
                : "w-[100px] px-6 py-2 bg-[#E71010] text-white rounded-md hover:bg-[#C80C0C]"
            }
            onClick={onConfirm}
          >
            Discard
          </button>
        </div>
      </div>
    </div>
  );
}
