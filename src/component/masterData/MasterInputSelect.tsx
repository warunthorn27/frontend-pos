import React, { useEffect, useMemo, useRef, useState } from "react";
import DropdownArrowIcon from "../../assets/svg/dropdown-arrow2.svg?react";
import type { SelectOption } from "../../types/shared/select";

type Props = {
  value: string; // id หรือ free text
  options: SelectOption[];
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
};

const MasterInputSelect: React.FC<Props> = ({
  value,
  options,
  onChange,
  placeholder = "Select",
  disabled = false,
}) => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [openUpward, setOpenUpward] = useState(false);

  const calculateDropdownPosition = () => {
    if (!inputRef.current) return;

    const rect = inputRef.current.getBoundingClientRect();
    const dropdownHeight = 270; // max-h-52 ≈ 13rem ≈ 208px
    const spaceBelow = window.innerHeight - rect.bottom;
    const spaceAbove = rect.top;

    setOpenUpward(spaceBelow < dropdownHeight && spaceAbove > dropdownHeight);
  };

  /* หา option จาก value (_id) */
  const selectedOption = useMemo(() => {
    return options.find((o) => o.value === value) ?? null;
  }, [options, value]);

  /* filter options ด้วย query */
  const filteredOptions = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return options;
    return options.filter((o) => o.label.toLowerCase().includes(q));
  }, [options, query]);

  /* display value */
  const displayValue = useMemo(() => {
    if (open) return query;
    if (selectedOption) return selectedOption.label;
    return value ?? ""; // free text
  }, [open, query, selectedOption, value]);

  /* open dropdown */
  const openDropdown = () => {
    if (!inputRef.current) return;
    setQuery(displayValue);
    calculateDropdownPosition();
    setOpen(true);
  };

  /* close on outside click */
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const container = inputRef.current?.parentElement;
      if (container && !container.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="relative">
      <input
        ref={inputRef}
        value={displayValue}
        disabled={disabled}
        placeholder={placeholder}
        onFocus={openDropdown}
        onChange={(e) => {
          const val = e.target.value;
          setQuery(val);
          {
            /* ใช้ val ที่ user พิมพ์ */
          }
          setOpen(true);

          onChange(val);
        }}
        className="
          w-full h-[38px]
          rounded-md border border-[#CFCFCF]
          bg-white px-3 pr-10
          text-sm text-[#545454]
          outline-none
        "
      />

      <button
        type="button"
        tabIndex={-1}
        onClick={() => {
          calculateDropdownPosition();
          setOpen((o) => !o);
        }}
        className="absolute right-3 top-1/2 -translate-y-1/2"
      >
        <DropdownArrowIcon className="w-3 h-3" />
      </button>

      {open && filteredOptions.length > 0 && (
        <ul
          className={`absolute left-0 z-50 w-full
            max-h-52 overflow-auto
            rounded-md border border-[#CFCFCF]
            bg-white text-sm shadow-md
            ${openUpward ? "bottom-full mb-1" : "top-full mt-1"}
          `}
        >
          {filteredOptions.map((o) => (
            <li
              key={o.value}
              onMouseDown={() => {
                onChange(o.value);
                setQuery(o.label);
                setOpen(false);
              }}
              className="cursor-pointer px-3 py-2 hover:bg-[#F3F4F6]"
            >
              {o.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MasterInputSelect;
