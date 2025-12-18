import React from "react";
import type {
  PrimaryStoneForm,
  SelectOption,
  WeightUnit,
} from "../../../../types/product";
import DropdownArrowIcon from "../../../../assets/svg/dropdown-arrow2.svg?react";

type Props = {
  value: PrimaryStoneForm;
  onChange: (patch: Partial<PrimaryStoneForm>) => void;
  stoneNameOptions: SelectOption[];
  shapeOptions: SelectOption[];
  cuttingOptions: SelectOption[];
  qualityOptions: SelectOption[];
  clarityOptions: SelectOption[];

  weightCts: string;
  weightUnit: WeightUnit;
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

      <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
        {icon ?? <DropdownArrowIcon className="w-3 h-3 text-black" />}
      </span>
    </div>
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
          className="h-full w-full bg-transparent pl-3 pr-7 text-sm font-light text-[#545454] outline-none appearance-none"
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

const PrimaryStoneCard: React.FC<Props> = ({
  value,
  onChange,
  stoneNameOptions,
  shapeOptions,
  cuttingOptions,
  qualityOptions,
  clarityOptions,
}) => {
  return (
    <div className="rounded-2xl border border-[#E6E6E6] bg-white px-6 py-5 h-full">
      <div className="mb-4 text-lg font-normal text-[#024C8A]">
        Primary Stone
      </div>

      <div className="grid grid-cols-3 gap-x-10 gap-y-4">
        <div>
          <Label required>Stone Name</Label>
          <SelectField
            value={value.stoneName}
            onChange={(v) => onChange({ stoneName: v })}
            options={stoneNameOptions}
            icon={<DropdownArrowIcon className="w-3 h-3 text-black" />}
          />
        </div>

        <div>
          <Label required>Shape</Label>
          <SelectField
            value={value.shape}
            onChange={(v) => onChange({ shape: v })}
            options={shapeOptions}
            icon={<DropdownArrowIcon className="w-3 h-3 text-black" />}
          />
        </div>

        <div>
          <Label required>Size</Label>
          <Input value={value.size} onChange={(v) => onChange({ size: v })} />
        </div>

        <div>
          <Label required>Weight</Label>
          <WeightInput
            value={value.weightCts}
            onChange={(v) => onChange({ weightCts: v })}
            unit={value.weightUnit}
            onUnitChange={(u) => onChange({ weightUnit: u })}
            icon={<DropdownArrowIcon className="w-3 h-3 text-black" />}
          />
        </div>

        <div>
          <Label>Color</Label>
          <Input value={value.color} onChange={(v) => onChange({ color: v })} />
        </div>

        <div>
          <Label>Cutting</Label>
          <SelectField
            value={value.cutting}
            onChange={(v) => onChange({ cutting: v })}
            options={cuttingOptions}
            icon={<DropdownArrowIcon className="w-3 h-3 text-black" />}
          />
        </div>

        <div>
          <Label>Quality</Label>
          <SelectField
            value={value.quality}
            onChange={(v) => onChange({ quality: v })}
            options={qualityOptions}
            icon={<DropdownArrowIcon className="w-3 h-3 text-black" />}
          />
        </div>

        <div>
          <Label>Clarity</Label>
          <SelectField
            value={value.clarity}
            onChange={(v) => onChange({ clarity: v })}
            options={clarityOptions}
            icon={<DropdownArrowIcon className="w-3 h-3 text-black" />}
          />
        </div>

        <div />
      </div>
    </div>
  );
};

export default PrimaryStoneCard;
