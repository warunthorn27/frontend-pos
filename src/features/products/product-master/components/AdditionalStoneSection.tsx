import React from "react";
import type {
  AdditionalStoneForm,
  SelectOption,
  WeightUnit,
} from "../../../../types/product";
import DropdownArrowIcon from "../../../../assets/svg/dropdown-arrow2.svg?react";

type Props = {
  value: AdditionalStoneForm;
  onChange: (patch: Partial<AdditionalStoneForm>) => void;

  stoneNameOptions: SelectOption[];
  shapeOptions: SelectOption[];
  cuttingOptions: SelectOption[];
  qualityOptions: SelectOption[];
  clarityOptions: SelectOption[];
};

/* ---------------- UI helpers ---------------- */

function Label({ children }: { children: React.ReactNode }) {
  return (
    <label className="block text-base font-normal text-black">{children}</label>
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
}: {
  value: string;
  onChange: (v: string) => void;
  options: SelectOption[];
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-[38px] rounded-md border border-[#CFCFCF] bg-white px-3 pr-10 text-sm text-[#545454] outline-none appearance-none"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>

      <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
        <DropdownArrowIcon className="w-3 h-3 text-black" />
      </span>
    </div>
  );
}

function WeightInput({
  value,
  onChange,
  unit,
  onUnitChange,
}: {
  value: string;
  onChange: (v: string) => void;
  unit: WeightUnit;
  onUnitChange: (u: WeightUnit) => void;
}) {
  return (
    <div className="relative">
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        inputMode="decimal"
        className="w-full h-[38px] rounded-md border border-[#CFCFCF] bg-white pl-3 pr-[88px] text-sm outline-none"
      />

      <div className="absolute right-0 top-0 h-[38px] pr-1">
        <select
          value={unit}
          onChange={(e) => onUnitChange(e.target.value as WeightUnit)}
          className="h-full bg-transparent pl-3 pr-7 text-sm text-[#545454] outline-none appearance-none"
        >
          <option value="cts">cts</option>
          <option value="g">g</option>
        </select>

        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
          <DropdownArrowIcon className="w-3 h-3 text-black" />
        </span>
      </div>
    </div>
  );
}

/* ---------------- Component ---------------- */

const AdditionalStoneSection: React.FC<Props> = ({
  value,
  onChange,
  stoneNameOptions,
  shapeOptions,
  cuttingOptions,
  qualityOptions,
  clarityOptions,
}) => {
  return (
    <div className="grid grid-cols-3 gap-x-10 gap-y-4">
      <div>
        <Label>Stone Name</Label>
        <SelectField
          value={value.stoneName}
          onChange={(v) => onChange({ stoneName: v })}
          options={stoneNameOptions}
        />
      </div>

      <div>
        <Label>Shape</Label>
        <SelectField
          value={value.shape}
          onChange={(v) => onChange({ shape: v })}
          options={shapeOptions}
        />
      </div>

      <div>
        <Label>Size</Label>
        <Input value={value.size} onChange={(v) => onChange({ size: v })} />
      </div>

      <div>
        <Label>S. Weight</Label>
        <WeightInput
          value={value.weightCts}
          onChange={(v) => onChange({ weightCts: v })}
          unit={value.weightUnit}
          onUnitChange={(u) => onChange({ weightUnit: u })}
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
        />
      </div>

      <div>
        <Label>Quality</Label>
        <SelectField
          value={value.quality}
          onChange={(v) => onChange({ quality: v })}
          options={qualityOptions}
        />
      </div>

      <div>
        <Label>Clarity</Label>
        <SelectField
          value={value.clarity}
          onChange={(v) => onChange({ clarity: v })}
          options={clarityOptions}
        />
      </div>

      {"qty" in value && (
        <div>
          <Label>Qty</Label>
          <Input
            value={value.qty ?? ""}
            onChange={(v) => onChange({ qty: v })}
          />
        </div>
      )}
    </div>
  );
};

export default AdditionalStoneSection;
