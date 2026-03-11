import { useState } from "react";

interface Props {
  value: number;
  onChange: (value: number) => void;
  className?: string;
}

export default function DecimalInput({ value, onChange, className }: Props) {
  const [text, setText] = useState(value.toFixed(2));
  const [isFocused, setIsFocused] = useState(false);

  const handleChange = (val: string) => {
    if (/^\d*\.?\d*$/.test(val)) {
      setText(val);
    }
  };

  const handleBlur = () => {
    const num = Number(text || 0);
    const rounded = Math.ceil(num * 100) / 100;

    onChange(rounded);
    setText(rounded.toFixed(2));
    setIsFocused(false);
  };

  return (
    <input
      type="text"
      inputMode="decimal"
      value={isFocused && text === "0.00" ? "" : text}
      onFocus={() => setIsFocused(true)}
      onChange={(e) => handleChange(e.target.value)}
      onBlur={handleBlur}
      className={`
  w-full
  h-[38px]
  px-3
  rounded-md
  border
  ${className ? className : "border-[#CFCFCF]"}
  bg-white
  text-right
  text-sm
  focus:outline-none focus:border-[#005AA7]
`}
    />
  );
}
