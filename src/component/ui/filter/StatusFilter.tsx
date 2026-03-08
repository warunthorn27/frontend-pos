import { useState } from "react";
import DropdownArrowIcon from "../../../assets/svg/dropdown-arrow2.svg?react";
import CloseIcon from "../../../assets/svg/close.svg?react";

type Props = {
  value?: string;
  onChange: (value?: string) => void;
};

const options = ["All", "In Stock", "Out of Stock"];

export default function StatusFilter({ value, onChange }: Props) {
  const [open, setOpen] = useState(false);

  const handleSelect = (status: string) => {
    onChange(status);
    setOpen(false);
  };

  return (
    <div className="relative w-[180px]">
      <button
        onClick={() => setOpen(!open)}
        className={`w-full h-[40px] rounded-md px-3 flex items-center justify-between
        bg-white text-sm transition-colors
        ${open ? "border border-[#005AA7]" : "border border-[#CFCFCF]"}`}
      >
        {/* LEFT */}
        <span className={value ? "text-black" : "text-gray-400 font-light"}>
          {value || "Status"}
        </span>

        {/* RIGHT */}
        <div className="flex items-center gap-1">
          {value && (
            <button
              onMouseDown={(e) => {
                e.stopPropagation();
                onChange(undefined);
              }}
              className="hover:bg-gray-100 rounded-xl"
            >
              <CloseIcon className="w-6 h-6" />
            </button>
          )}

          <DropdownArrowIcon
            className={`w-3 h-3 transition-transform ${
              open ? "rotate-180" : ""
            }`}
          />
        </div>
      </button>

      {open && (
        <div className="absolute z-50 mt-1 w-full bg-white border border-[#E6E6E6] rounded-md shadow-md">
          {options.map((opt) => (
            <div
              key={opt}
              onMouseDown={() => handleSelect(opt)}
              className={`px-3 py-2 text-sm cursor-pointer font-light hover:bg-[#F3F6FA]
              ${value === opt ? "bg-[#F3F4F6]" : ""}`}
            >
              {opt}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
