import CloseIcon from "../../assets/svg/close.svg?react";

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
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-[420px] rounded-lg shadow-lg p-6 relative">
        <button className="absolute right-4 top-4" onClick={onCancel}>
          <CloseIcon className="w-5 h-5" />
        </button>

        <div className="flex flex-col items-center text-center gap-4">
          <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center">
            <div className="w-14 h-14 rounded-full border-4 border-red-500 flex items-center justify-center text-red-500 text-xl font-bold">
              !
            </div>
          </div>

          <h2 className="text-lg font-medium">Save with errors</h2>

          <p className="text-sm text-gray-600">
            Items with errors will not be saved.
          </p>

          <p className="text-sm text-gray-600">
            Do you want to confirm saving?
          </p>

          <div className="flex gap-4 mt-4">
            <button onClick={onCancel} className="px-5 py-2 border rounded-md">
              Cancel
            </button>

            <button
              onClick={onConfirm}
              className="px-5 py-2 bg-[#2C5AA0] text-white rounded-md"
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
