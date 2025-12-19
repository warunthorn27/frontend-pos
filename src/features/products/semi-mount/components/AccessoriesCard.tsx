import React, { useMemo } from "react";
import type { SelectOption } from "../../../../types/product";
import DropdownArrowIcon from "../../../../assets/svg/dropdown-arrow2.svg?react";

type AccessoryOption = SelectOption & {
  weightG?: number;
};

type Props = {
  value: string; // accessoriesCode ที่เลือก
  options: AccessoryOption[];
  onChange: (v: string) => void;

  // น้ำหนักที่แสดง/แก้ไขได้ (เก็บเป็น string ใน form)
  weightValue: string;
  onWeightChange: (v: string) => void;
};

function SelectField({
  value,
  onChange,
  options,
  icon,
}: {
  value: string;
  onChange: (v: string) => void;
  options: SelectOption[];
  icon?: React.ReactNode;
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-[38px] rounded-md border border-[#CFCFCF] bg-white px-3 pr-10 text-sm text-[#545454] font-light outline-none appearance-none"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      {icon && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
          {icon}
        </div>
      )}
    </div>
  );
}

function UnitInput({
  value,
  onChange,
  unit,
}: {
  value: string;
  onChange: (v: string) => void;
  unit: string;
}) {
  return (
    <div className="relative">
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        inputMode="decimal"
        className="w-full h-[38px] rounded-md border border-[#CFCFCF] bg-white pl-3 pr-10 text-sm outline-none"
      />
      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-[#7A7A7A]">
        {unit}
      </span>
    </div>
  );
}

const AccessoriesCard: React.FC<Props> = ({
  value,
  options,
  onChange,
  weightValue,
  onWeightChange,
}) => {
  const selected = useMemo(
    () => options.find((o) => o.value === value) ?? null,
    [options, value]
  );

  return (
    <div className="rounded-2xl border border-[#E6E6E6] bg-white px-6 py-5">
      <h3 className="text-base font-normal text-[#1F1F1F]">Accessories</h3>

      <div className="w-[240px]">
        <SelectField
          value={value}
          onChange={onChange}
          options={options}
          icon={<DropdownArrowIcon className="w-3 h-3 text-black" />}
        />
      </div>

      {/* แสดงฟิลด์ที่ผูกกับ accessories code เมื่อเลือกแล้ว */}
      {value && (
        <div className="w-[240px]">
          <label className="block text-base font-normal text-black">
            Weight
          </label>

          <UnitInput value={weightValue} onChange={onWeightChange} unit="g" />

          {/* (optional) ถ้าอยากโชว์น้ำหนัก default จาก accessories */}
          {typeof selected?.weightG === "number" && (
            <p className="mt-1 text-xs text-[#7A7A7A]">
              Default: {selected.weightG} g
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default AccessoriesCard;
