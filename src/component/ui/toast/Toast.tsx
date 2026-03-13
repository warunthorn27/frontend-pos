import { useEffect } from "react";
import type { ToastItem } from "./context";

import CheckComplete from "../../../assets/svg/check-circle.svg?react";
import WarningIcon from "../../../assets/svg/warning-icon.svg?react";

interface Props {
  toast: ToastItem;
  onClose: (id: number) => void;
}

export default function Toast({ toast, onClose }: Props) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(toast.id);
    }, 3000);

    return () => clearTimeout(timer);
  }, [toast.id, onClose]);

  const config = {
    success: {
      border: "border-[#34C759]",
      bg: "bg-[#F1FCF3]",
      text: "text-[#34C759]",
      title: "Complete!",
      icon: <CheckComplete className="w-6 h-6 text-[#34C759]" />,
    },
    error: {
      border: "border-[#E71010]",
      bg: "bg-[#FDECEA]",
      text: "text-[#E71010]",
      title: "Error",
      icon: <WarningIcon className="w-6 h-6 text-[#E71010]" />,
    },
    warning: {
      border: "border-[#FB8C00]",
      bg: "bg-[#FFF3E0]",
      text: "text-[#FB8C00]",
      title: "Warning",
      icon: <WarningIcon className="w-6 h-6 text-[#FB8C00]" />,
    },
    info: {
      border: "border-[#1E88E5]",
      bg: "bg-[#E3F2FD]",
      text: "text-[#1E88E5]",
      title: "Info",
      icon: <WarningIcon className="w-6 h-6 text-[#1E88E5]" />,
    },
  }[toast.type];

  return (
    <div
      className={`
        w-[360px]
        rounded-lg
        border
        px-5
        py-4
        shadow-lg
        flex
        gap-3
        items-start
        break-words
        ${config.border}
        ${config.bg}
      `}
    >
      <div>{config.icon}</div>

      <div className="flex flex-col">
        <div className={`font-normal text-base ${config.text}`}>
          {config.title}
        </div>

        <div
          className={`
            font-light
            text-sm
            whitespace-normal
            break-words
            ${config.text}
          `}
        >
          {toast.message}
        </div>
      </div>
    </div>
  );
}
