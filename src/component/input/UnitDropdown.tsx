import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import DropdownArrowIcon from "../../assets/svg/dropdown-arrow2.svg?react";

type Unit = "pcs" | "g";

type Option = {
  label: string;
  value: Unit;
};

interface Props {
  value: Unit;
  options: readonly Option[];
  onChange: (value: Unit) => void;
}

export default function UnitDropdown({ value, options, onChange }: Props) {
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0, width: 0 });

  const ref = useRef<HTMLDivElement>(null);

  const selected = options.find((o) => o.value === value);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggle = () => {
    if (!open && ref.current) {
      const rect = ref.current.getBoundingClientRect();

      setPosition({
        top: rect.bottom + window.scrollY + 4,
        left: rect.left + window.scrollX,
        width: rect.width,
      });
    }

    setOpen((v) => !v);
  };

  return (
    <>
      {/* trigger */}
      <div ref={ref} className="relative w-full">
        <button
          type="button"
          onClick={toggle}
          className="
            w-full
            h-[38px]
            px-3
            border border-[#CFCFCF]
            rounded-md
            bg-white
            text-sm
            flex items-center
            justify-between
            hover:border-gray-400
            focus:outline-none focus:border-[#005AA7]
          "
        >
          <span>{selected?.label}</span>
          <DropdownArrowIcon className="w-[10px] h-[10px] opacity-70" />
        </button>
      </div>

      {/* dropdown via portal */}
      {open &&
        createPortal(
          <div
            style={{
              position: "absolute",
              top: position.top,
              left: position.left,
              width: position.width,
            }}
            className="
              rounded-md
              border
              border-[#CFCFCF]
              bg-white
              shadow-lg
              z-[9999]
            "
          >
            {options.map((opt) => (
              <div
                key={opt.value}
                onMouseDown={() => {
                  onChange(opt.value);
                  setOpen(false);
                }}
                className="
                  px-3
                  py-2
                  text-sm
                  cursor-pointer
                  hover:bg-[#F1F1F1]
                "
              >
                {opt.label}
              </div>
            ))}
          </div>,
          document.body,
        )}
    </>
  );
}
