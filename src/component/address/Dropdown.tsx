import React, { useEffect, useRef, useState } from "react";
import DropdownArrowIcon from "../../assets/svg/dropdown-arrow2.svg?react";

interface Props {
  value: string;
  options: string[];
  placeholder?: string;
  disabled?: boolean;
  onChange: (val: string) => void;
}

const Dropdown: React.FC<Props> = ({
  value,
  options,
  placeholder = "Select",
  disabled = false,
  onChange,
}) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // ปิดเมื่อคลิกข้างนอก
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div className="relative w-full" ref={ref}>
      {/* Button */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setOpen(!open)}
        className={`
          w-full h-[38px] rounded-md border px-3 text-sm flex items-center justify-between
          transition-colors
          ${
            disabled
              ? "bg-[#F1F1F1] border-[#E6E6E6] text-gray-400 cursor-default"
              : "bg-white border-[#CFCFCF] focus:outline-none focus:border-[#005AA7]"
          }
        `}
      >
        <span
          className={
            disabled ? "text-black" : value ? "text-black" : "text-gray-400"
          }
        >
          {value || placeholder}
        </span>

        {!disabled && (
          <DropdownArrowIcon
            className={`w-3 h-3 transition-transform ${
              open ? "rotate-180" : ""
            } text-gray-400`}
          />
        )}
      </button>

      {/* Dropdown Panel */}
      {open && !disabled && options.length > 0 && (
        <div className="absolute z-50 mt-2 w-full max-h-60 overflow-auto rounded-md bg-white shadow-lg ring-1 ring-black/5">
          {options.length === 0 ? (
            <div className="px-4 py-2 text-sm text-gray-400">No options</div>
          ) : (
            options.map((opt) => (
              <div
                key={opt}
                onClick={() => {
                  onChange(opt);
                  setOpen(false);
                }}
                className="cursor-pointer px-4 py-2 text-sm hover:bg-blue-50 transition-colors"
              >
                {opt}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default Dropdown;
