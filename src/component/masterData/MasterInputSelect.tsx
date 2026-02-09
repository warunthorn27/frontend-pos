import React, { useEffect, useMemo, useRef, useState } from "react";
import DropdownArrowIcon from "../../assets/svg/dropdown-arrow2.svg?react";
import type { SelectOption } from "../../types/shared/select";

type Props = {
  value: string;
  options: SelectOption[];
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  allowCreate?: boolean;
  required?: boolean;
};

const MasterInputSelect: React.FC<Props> = ({
  value,
  options,
  onChange,
  placeholder = "Select",
  disabled = false,
  allowCreate = true,
  required = false,
}) => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState<string>("");
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
    const q = (query ?? "").toLowerCase();

    return options.filter((o) => (o.label ?? "").toLowerCase().includes(q));
  }, [options, query]);

  const hasExactMatch = useMemo(() => {
    const q = (query ?? "").trim().toLowerCase();
    if (!q) return true;

    return options.some((o) => (o.label ?? "").toLowerCase() === q);
  }, [options, query]);

  const displayValue = useMemo(() => {
    if (open) return query ?? "";
    if (selectedOption) return selectedOption.label ?? "";
    if (allowCreate) return value ?? "";
    return "";
  }, [open, query, selectedOption, value, allowCreate]);

  const openDropdown = () => {
    if (!inputRef.current) return;

    setQuery(selectedOption?.label ?? "");
    calculateDropdownPosition();
    setOpen(true);
  };

  const handleCloseDropdown = React.useCallback(() => {
    setOpen(false);

    if (required && !value && selectedOption) {
      onChange(selectedOption.value);
      setQuery(selectedOption.label ?? "");
    }
  }, [required, value, selectedOption, onChange]);

  /* close on outside click */
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const container = inputRef.current?.parentElement;
      if (container && !container.contains(e.target as Node)) {
        handleCloseDropdown();
      }
    };

    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [handleCloseDropdown]);

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
          setOpen(true);

          // required field !!
          if (required) {
            // ห้ามว่าง และห้าม "-"
            if (val.trim() === "" || val.trim() === "-") {
              return;
            }
          }

          // optional field ให้เป็น "", "-" ได้
          if (allowCreate) {
            onChange(val);
          }
        }}
        className="
          w-full h-[38px]
          rounded-md border border-[#CFCFCF]
          bg-white px-3 pr-10
          text-sm text-black
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
                if (required && !o.value) return;

                onChange(o.value);
                setQuery(o.label);
                setOpen(false);
              }}
              className="cursor-pointer px-3 py-2 hover:bg-[#F3F4F6]"
            >
              {o.label}
            </li>
          ))}

          {/* CREATE NEW OPTION */}
          {allowCreate && query && !hasExactMatch && (
            <li
              onMouseDown={() => {
                onChange(query);
                setOpen(false);
              }}
              className="cursor-pointer px-3 py-2 text-blue-600 hover:bg-[#F3F4F6]"
            >
              + Create "{query}"
            </li>
          )}
        </ul>
      )}
    </div>
  );
};

export default MasterInputSelect;
