import { useState } from "react";

interface Props {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export default function DecimalWeightInput({
  value,
  onChange,
  disabled,
}: Props) {
  const [isFocused, setIsFocused] = useState(false);

  const format = (val: string) => {
    const num = Number(val);

    if (isNaN(num)) return "0.00";

    const rounded = Math.ceil(num * 100) / 100;

    return rounded.toFixed(2);
  };

  return (
    <div className="relative">
      <input
        type="text"
        value={isFocused && value === "0.00" ? "" : value}
        disabled={disabled}
        inputMode="decimal"
        onFocus={() => setIsFocused(true)}
        onBlur={(e) => {
          setIsFocused(false);
          onChange(format(e.target.value || "0"));
        }}
        onChange={(e) => {
          const val = e.target.value;

          if (/^\d*\.?\d*$/.test(val)) {
            onChange(val);
          }
        }}
        className="
          w-full h-[38px] pr-8
          rounded-md border border-[#CFCFCF] text-right text-sm
          focus:outline-none focus:border-[#005AA7]
        "
      />

      {/* <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7A7A7A] text-sm">
        g
      </span> */}
    </div>
  );
}
