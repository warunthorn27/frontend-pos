import React from "react";
import type { WeightUnit, OthersForm } from "../../../../types/product";
import DropdownArrowIcon from "../../../../assets/svg/dropdown-arrow2.svg?react";

type Props = {
  value: OthersForm;
  onChange: (patch: Partial<OthersForm>) => void;
};

function Label({
  children,
  required,
}: {
  children: React.ReactNode;
  required?: boolean;
}) {
  return (
    <label className="block text-base font-normal text-black">
      {children} {required ? <span className="text-red-500">*</span> : null}
    </label>
  );
}

function WeightInput({
  value,
  onChange,
  unit,
  onUnitChange,
  icon,
}: {
  value: string;
  onChange: (v: string) => void;
  unit: WeightUnit;
  onUnitChange: (u: WeightUnit) => void;
  icon?: React.ReactNode;
}) {
  return (
    <div className="relative">
      {/* ตัวเลข */}
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        inputMode="decimal"
        className="w-full h-[38px] rounded-md border border-[#CFCFCF] bg-white pl-3 pr-[88px] text-sm outline-none"
      />

      {/* dropdown หน่วย */}
      <div className="absolute right-0 top-0 h-[38px] pr-1">
        <select
          value={unit}
          onChange={(e) => onUnitChange(e.target.value as WeightUnit)}
          className="h-[38px] w-full bg-transparent pl-3 pr-7 text-sm font-light text-[#545454] outline-none appearance-none"
        >
          <option value="cts">cts</option>
          <option value="g">g</option>
        </select>

        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
          {icon ?? <DropdownArrowIcon className="w-3 h-3 text-black" />}
        </span>
      </div>
    </div>
  );
}

function Input({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full h-[38px] rounded-md border border-[#CFCFCF] bg-white px-3 text-sm outline-none"
    />
  );
}

const OthersInfoCard: React.FC<Props> = ({ value, onChange }) => {
  return (
    <div className="h-full min-h-0 w-full rounded-2xl border bg-white flex flex-col overflow-hidden">
      {/* BODY (scroll ได้) */}
      <div className="flex-1 min-h-0 overflow-y-auto px-6 py-5">
        <div className="grid grid-cols-1 max-w-[525px] w-full">
          {/* LEFT */}
          <div className="flex flex-col gap-y-4">
            <div>
              <Label required>Product Name</Label>
              <Input
                value={value.productName}
                onChange={(v) => onChange({ productName: v })}
              />
            </div>

            <div>
              <Label required>Code</Label>
              <Input
                value={value.code}
                onChange={(v) => onChange({ code: v })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-x-10 mb-4">
            <div className="flex flex-col gap-y-4 mt-4">
              <div>
                <Label required>Product Size</Label>
                <Input
                  value={value.productSize}
                  onChange={(v) => onChange({ productSize: v })}
                />
              </div>
            </div>

            <div className="flex flex-col gap-y-4 mt-4">
              <div>
                <Label required>Weight</Label>
                <WeightInput
                  value={value.weight}
                  onChange={(v) => onChange({ weight: v })}
                  unit={value.weightUnit}
                  onUnitChange={(u) => onChange({ weightUnit: u })}
                  icon={<DropdownArrowIcon className="w-3 h-3 text-black" />}
                />
              </div>
            </div>
          </div>

          <div>
            <Label>Description</Label>
            <textarea
              value={value.description}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                onChange({ description: e.target.value })
              }
              maxLength={300}
              className="w-full h-[120px] rounded-md border border-[#CFCFCF] bg-white px-3 py-2 text-[13px] outline-none resize-none"
            />
            <p className="text-xs text-[#7A7A7A]">
              *Description should not exceed 300 letters
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OthersInfoCard;
