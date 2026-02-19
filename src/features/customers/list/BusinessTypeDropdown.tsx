import React, { useEffect, useRef, useState } from "react";
import DropdownArrowIcon from "../../../assets/svg/dropdown-arrow2.svg?react";
import CloseIcon from "../../../assets/svg/close.svg?react";

const OPTIONS = ["Individual", "Corporation"];

type Props = {
  value?: string;
  onChange: (value?: string) => void;
};

const BusinessTypeSelect: React.FC<Props> = ({ value, onChange }) => {
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
    <div ref={ref} className="relative w-[180px]">
      {/* HEADER */}
      <div
        onClick={() => setOpen((o) => !o)}
        className="flex items-center justify-between h-[40px]
        rounded-md border border-[#CFCFCF] bg-white px-3 text-sm cursor-pointer"
      >
        {/* LEFT */}
        <span className={value ? "text-black" : "text-gray-400"}>
          {value || "Business Type"}
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

          <DropdownArrowIcon className="w-3 h-3" />
        </div>
      </div>

      {/* DROPDOWN */}
      {open && (
        <ul
          className="absolute z-50 mt-1 w-full rounded-md
          border border-[#CFCFCF] bg-white text-sm font-light shadow-md"
        >
          {OPTIONS.map((o) => (
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

export default BusinessTypeSelect;
