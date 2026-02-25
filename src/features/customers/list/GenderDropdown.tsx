import React, { useEffect, useRef, useState } from "react";
import DropdownArrowIcon from "../../../assets/svg/dropdown-arrow2.svg?react";

type Props = {
  value?: string;
  options: string[];
  placeholder?: string;
  onChange: (value?: string) => void;
  width?: string;
};

const GenderDropdown: React.FC<Props> = ({
  value,
  options,
  placeholder,
  onChange,
  width = "w-full",
}) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className={`relative ${width}`}>
      {/* HEADER */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center justify-between w-full h-[38px]
        rounded-md border border-[#CFCFCF] bg-white px-3 text-sm cursor-pointer focus:border-[#005AA7] focus:outline-none"
      >
        <span className={value ? "text-black" : "text-gray-400"}>
          {value || placeholder}
        </span>

        {/* RIGHT */}
        <div className="flex items-center gap-1">
          {value && (
            <span
              onMouseDown={(e) => {
                e.stopPropagation();
                onChange(undefined);
              }}
            ></span>
          )}

          <DropdownArrowIcon className="w-3 h-3" />
        </div>
      </button>

      {/* DROPDOWN */}
      {open && (
        <ul
          className="absolute z-50 mt-1 w-full rounded-md
          border border-[#CFCFCF] bg-white text-sm font-light shadow-md overflow-hidden"
        >
          {options.map((o) => (
            <li
              key={o}
              onMouseDown={() => {
                onChange(o);
                setOpen(false);
              }}
              className="px-3 py-2 hover:bg-[#F3F4F6] cursor-pointer"
            >
              {o}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default GenderDropdown;
