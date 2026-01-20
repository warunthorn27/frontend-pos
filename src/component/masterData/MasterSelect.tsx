import React, { useEffect, useRef, useState } from "react";
import DropdownArrowIcon from "../../assets/svg/dropdown-arrow2.svg?react";
import CheckFilterIcon from "../../assets/svg/checkFilter.svg?react";
import CloseIcon from "../../assets/svg/close.svg?react";
import type { SelectOption } from "../../types/shared/select";

type Props = {
  values: string[];
  options: SelectOption[];
  onChange: (values: string[]) => void;
  placeholder?: string;
  disabled?: boolean;
};

const MasterSelect: React.FC<Props> = ({
  values,
  options,
  onChange,
  placeholder = "Category",
  disabled = false,
}) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const count = values.length;

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const toggleValue = (value: string) => {
    onChange(
      values.includes(value)
        ? values.filter((v) => v !== value)
        : [...values, value],
    );
  };

  const clearAll = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange([]);
    setOpen(false);
  };

  return (
    <div ref={ref} className="relative w-[220px]">
      {/* HEADER */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-items-start h-[38px]
          rounded-md border border-[#CFCFCF] bg-white px-3 text-sm"
      >
        {/* LEFT */}
        <div className="flex items-center gap-2">
          <span className="font-light">{placeholder}</span>

          {count > 0 && (
            <span
              className="flex h-[22px] w-[25px] items-center justify-center
              rounded bg-[#EFF7FF] text-[#0690F1] text-sm font-normal mx-3"
            >
              {count}
            </span>
          )}
        </div>

        {/* RIGHT */}
        <div className="flex items-center px-11">
          <DropdownArrowIcon className="w-3 h-3" />

          {count > 0 && (
            <button
              type="button"
              onClick={clearAll}
              className=" hover:bg-gray-100 rounded-xl mx-1"
            >
              <CloseIcon className="w-6 h-6" />
            </button>
          )}
        </div>
      </button>

      {/* DROPDOWN */}
      {open && (
        <ul
          className="absolute z-50 mt-1 w-full rounded-md
          border border-[#CFCFCF] bg-white text-sm shadow-md"
        >
          {options.map((o) => {
            const active = values.includes(o.value);
            return (
              <li
                key={o.value}
                onMouseDown={() => toggleValue(o.value)}
                className="flex items-center justify-between px-3 py-2
                hover:bg-[#F3F4F6] cursor-pointer font-light"
              >
                <span className={active ? "font-medium" : ""}>{o.label}</span>

                {active && <CheckFilterIcon />}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default MasterSelect;
