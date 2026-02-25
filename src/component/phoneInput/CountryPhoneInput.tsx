import React, { useEffect, useRef, useState } from "react";
import DropdownArrow from "../../assets/svg/dropdown-arrow2.svg?react";
import { buildE164, COUNTRIES } from "../../utils/phone";

export type CountryCode = "TH" | "US" | "JP";

interface Props {
  value: string; // E.164 จาก parent
  country: CountryCode;
  disabled?: boolean;
  onCountryChange: (c: CountryCode) => void;
  onChange: (phoneE164: string, raw: string) => void;
}

function restoreLocalNumber(e164: string, dial: string) {
  const digits = e164.replace(/\D/g, "");

  if (dial === "+66") {
    return "0" + digits.slice(2);
  }

  if (dial === "+81") {
    return "0" + digits.slice(2);
  }

  if (dial === "+1") {
    return digits.slice(1);
  }

  return digits;
}

const CountryPhoneInput: React.FC<Props> = ({
  value,
  country,
  disabled,
  onCountryChange,
  onChange,
}) => {
  const selected = COUNTRIES.find((c) => c.code === country)!;
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  const raw = !value
    ? ""
    : value.startsWith(selected.dial)
      ? restoreLocalNumber(value, selected.dial)
      : value;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (!rootRef.current) return;

      if (!rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    window.addEventListener("click", handleClickOutside);
    return () => window.removeEventListener("click", handleClickOutside);
  }, []);

  const rawNumber = value.startsWith(selected.dial)
    ? value.slice(selected.dial.length)
    : value;

  return (
    <div ref={rootRef} className="relative">
      {/* ชั้นนี้เอาไว้ให้ dropdown ลอย */}
      {/* INPUT CONTAINER */}
      <div
        className="
        flex h-[38px] rounded-md
        border border-[#CFCFCF]
        bg-white
        focus-within:border-[#005AA7]
      "
      >
        {/* COUNTRY */}
        <div className="relative">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setOpen((v) => !v);
            }}
            disabled={disabled}
            className="h-full pl-3 pr-8 text-sm flex items-center bg-transparent"
          >
            {selected.dial}
          </button>

          <DropdownArrow className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400" />
        </div>

        <div className="w-px bg-[#E5E5E5] shrink-0" />

        <input
          value={raw}
          onChange={(e) => {
            const v = e.target.value;

            const e164 = buildE164(selected.dial, v);
            onChange(e164, v);
          }}
          disabled={disabled}
          className="flex-1 px-3 text-sm border-none outline-none bg-transparent"
        />
      </div>
      {/* DROPDOWN — ย้ายออกมานอกกรอบ */}
      {open && (
        <div
          className="
          absolute top-full left-0
          mt-1 w-16
          rounded-md bg-white
          shadow-lg border border-gray-200
          z-50
        "
          onClick={(e) => e.stopPropagation()}
        >
          {COUNTRIES.map((c) => (
            <div
              key={c.code}
              onClick={() => {
                onCountryChange(c.code);
                const e164 = buildE164(c.dial, rawNumber);
                onChange(e164, rawNumber);
                setOpen(false);
              }}
              className="px-3 py-2 text-sm cursor-pointer hover:bg-gray-100"
            >
              {c.dial}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CountryPhoneInput;
