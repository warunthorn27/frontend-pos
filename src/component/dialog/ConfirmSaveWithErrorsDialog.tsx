import CloseIcon from "../../assets/svg/close.svg?react";
import WarningIcon from "../../assets/svg/warning-icon3.svg?react";

interface Props {
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export default function ConfirmSaveWithErrorsDialog({
  open,
  onCancel,
  onConfirm,
}: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[1500] flex items-center justify-center bg-black/30">
      <div className="w-[500px] bg-white rounded-xl px-8 py-8 text-center relative shadow-xl">
        <button className="absolute right-4 top-4" onClick={onCancel}>
          <CloseIcon className="w-5 h-5" />
        </button>

        <div className="flex flex-col items-center text-center gap-2">
          <WarningIcon />

          <h2 className="text-lg font-normal text-black mt-3">
            Save with errors
          </h2>

          <p className="text-base text-gray-600 font-light">
            Items with errors will not be saved. Do you want to confirm saving?
          </p>

          <div className="flex gap-4 mt-6">
            <button
              onClick={onCancel}
              className="w-24 px-4 py-[6px] bg-white border border-[#CFCFCF] text-base hover:bg-[#F1F1F1] text-black rounded-md"
            >
              Cancel
            </button>

            <button
              onClick={onConfirm}
              className="w-24 px-4 py-[6px] rounded-md text-base font-normal bg-[#005AA7] hover:bg-[#084072] text-white"
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
