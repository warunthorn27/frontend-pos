import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CheckIcon from "../../../assets/svg/check-reset.svg?react";
import CloseIcon from "../../../assets/svg/close.svg?react";

interface ToastItem {
  id: number;
  productName: string;
  productCode: string;
  imageUrl?: string | null;
  metal?: string;
  metalColor?: string;
}

interface Props {
  toasts: ToastItem[];
  onClose: (id: number) => void;
}

const CustomAddedToast: React.FC<Props> = ({ toasts, onClose }) => {
  const navigate = useNavigate();

  return (
    <div className="fixed top-[72px] right-6 z-[9999] flex flex-col gap-2">
      {toasts.map((toast) => (
        <ToastCard
          key={toast.id}
          toast={toast}
          onClose={() => onClose(toast.id)}
          onViewCustom={() => navigate("/pos/custom")}
        />
      ))}
    </div>
  );
};

/* ===== Individual Toast Card ===== */

interface CardProps {
  toast: ToastItem;
  onClose: () => void;
  onViewCustom: () => void;
}

const ToastCard: React.FC<CardProps> = ({ toast, onClose, onViewCustom }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="bg-white border border-gray-200 rounded-md shadow-[0_2px_12px_rgba(0,0,0,0.12)] p-[12px_14px] w-[380px] animate-[slideInToast_0.25s_ease]">
      <style>{`
        @keyframes slideInToast {
          from { opacity: 0; transform: translateX(30px); }
          to   { opacity: 1; transform: translateX(0); }
        }
      `}</style>

      {/* Header */}
      <div className="flex justify-between items-center pb-[10px] mb-[14px] border-b border-gray-200">
        <div className="flex items-center gap-2 text-[#06284B] text-[16px] font-normal">
          <CheckIcon className="w-6 h-6" />
          Just added !
        </div>

        <button
          onClick={onClose}
          className="border-none bg-transparent cursor-pointer text-gray-400"
        >
          <CloseIcon className="w-7 h-7 text-black" />
        </button>
      </div>

      {/* Product row */}
      <div className="flex gap-4 items-start mb-2">
        <div className="w-[40px] h-[40px] rounded bg-gray-100 overflow-hidden flex-shrink-0 flex items-center justify-center">
          {toast.imageUrl ? (
            <img
              src={toast.imageUrl}
              alt={toast.productName}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="bg-gray-300 rounded-md" />
          )}
        </div>

        <div>
          <div className="text-[16px] font-normal text-[#2A2A2A]">
            {toast.productName}
          </div>

          <div className="text-[12px] text-[#2A2A2A]">
            {toast.productCode}
            {toast.metal && ` · ${toast.metal}`}
            {toast.metalColor && ` ${toast.metalColor}`}
          </div>
        </div>
      </div>

      {/* Link */}
      <div className="flex justify-end">
        <button
          onClick={onViewCustom}
          className="bg-transparent border-none cursor-pointer text-[#005AA7] text-[14px] font-normal underline p-0"
        >
          View Items
        </button>
      </div>
    </div>
  );
};

export default CustomAddedToast;
export type { ToastItem };
