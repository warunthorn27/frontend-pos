import { useEffect } from "react";
import CheckComplete from "../../../../assets/svg/check-circle.svg?react";

interface Props {
  count: number;
  onClose: () => void;
}

export default function InventorySuccessToast({ count, onClose }: Props) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      className="
      fixed
      top-5
      right-6
      z-50
      min-w-[320px]
      rounded-lg
      border
      border-[#43A047]
      bg-[#E8F5E9]
      px-5
      py-4
      shadow-lg
      flex
      gap-3
    "
    >
      <div className="text-[#43A047]">
        <CheckComplete className="w-6 h-6" />
      </div>

      <div>
        <div className="font-normal text-[#43A047] text-sm">Complete !</div>

        <div className="font-light text-[#43A047] text-sm">
          {count} item(s) successfully added to inventory.
        </div>
      </div>
    </div>
  );
}
