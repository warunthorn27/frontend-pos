import React, { useEffect, useRef, useState } from "react";
import DropdownArrowIcon from "../../../assets/svg/dropdown-arrow2.svg?react";

export type CurrencyOption = {
  code: string;
  label?: string;
};

const DEFAULT_OPTIONS: CurrencyOption[] = [
  { code: "THB", label: "THB" },
  { code: "USD", label: "USD" },
];

interface Props {
  value: string;
  onChange: (val: string) => void;

  options?: CurrencyOption[];
  placeholder?: string;
  disabled?: boolean;
  label?: string;
  required?: boolean;
  error?: string | null;
}

const CurrencySelect: React.FC<Props> = ({
  value,
  onChange,
  options = DEFAULT_OPTIONS,
  placeholder = "Select",
  disabled = false,
  label,
  required,
  error,
}) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const selected = options.find((o) => o.code === value);

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
    <div className="w-full">
      {label && (
        <label className="block mb-2 text-base">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      <div className="relative w-full" ref={ref}>
        {/* BUTTON */}
        <button
          type="button"
          disabled={disabled}
          onClick={() => !disabled && setOpen(!open)}
          className={`
            w-full h-[38px] rounded-md border px-3 text-sm
            flex items-center justify-between transition-colors
            ${
              disabled
                ? "bg-[#F1F1F1] border-[#E6E6E6] text-gray-400 cursor-default"
                : error
                  ? "bg-white border-red-500 focus:outline-none focus:border-red-500"
                  : "bg-white border-[#CFCFCF] focus:outline-none focus:border-[#005AA7]"
            }
          `}
        >
          <span
            className={
              disabled
                ? "text-black"
                : selected
                  ? "text-black"
                  : "text-gray-400"
            }
          >
            {selected?.label || selected?.code || placeholder}
          </span>

          {!disabled && (
            <DropdownArrowIcon
              className={`w-3 h-3 transition-transform ${
                open ? "rotate-180" : ""
              } text-gray-400`}
            />
          )}
        </button>

        {/* PANEL */}
        {open && !disabled && (
          <div className="absolute z-50 mt-2 w-full max-h-60 overflow-auto rounded-md bg-white shadow-lg ring-1 ring-black/5">
            {options.map((opt) => (
              <div
                key={opt.code}
                onClick={() => {
                  onChange(opt.code);
                  setOpen(false);
                }}
                className={`
                  cursor-pointer px-4 py-2 text-sm transition-colors
                  hover:bg-blue-50
                  ${value === opt.code ? "bg-blue-50" : ""}
                `}
              >
                {opt.label || opt.code}
              </div>
            ))}
          </div>
        )}
      </div>

      {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
    </div>
  );
};

export default CurrencySelect;
