import React from "react";
import type {
  AdditionalStoneForm,
  PrimaryStoneForm,
  SelectOption,
  WeightUnit,
} from "../../../../types/product";
import DropdownArrowIcon from "../../../../assets/svg/dropdown-arrow2.svg?react";
import PlusIcon from "../../../../assets/svg/plus.svg?react";
import AdditionalStoneSection from "./AdditionalStoneSection";
import RemoveIcon from "../../../../assets/svg/remove.svg?react";

/* Types */

type Props = {
  value: PrimaryStoneForm;
  additionalStones: AdditionalStoneForm[];

  onChangePrimary: (patch: Partial<PrimaryStoneForm>) => void;
  onAddStone: () => void;
  onChangeStone: (index: number, patch: Partial<AdditionalStoneForm>) => void;
  onRemoveStone: (index: number) => void;

  stoneNameOptions: SelectOption[];
  shapeOptions: SelectOption[];
  cuttingOptions: SelectOption[];
  qualityOptions: SelectOption[];
  clarityOptions: SelectOption[];
};

/* Small UI helpers */

function Label({
  children,
}: // required,
{
  children: React.ReactNode;
  // required?: boolean;
}) {
  return (
    <label className="block text-base font-normal text-black">
      {children}
      {/* {required ? <span className="text-red-500">*</span> : null} */}
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
          className="h-full bg-transparent pl-3 pr-7 text-sm font-light text-[#545454] outline-none appearance-none"
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

/* Component */

const PrimaryStoneCard: React.FC<Props> = ({
  value,
  additionalStones,
  onChangePrimary,
  onAddStone,
  onChangeStone,
  onRemoveStone,
  stoneNameOptions,
  shapeOptions,
  cuttingOptions,
  qualityOptions,
  clarityOptions,
}) => {
  return (
    <div className="rounded-2xl border border-[#E6E6E6] bg-white px-6 py-5">
      <div className="mb-4 text-lg font-normal text-[#024C8A]">
        Primary Stone
      </div>

      {/* ---------------- Primary Stone ---------------- */}
      <div className="grid grid-cols-3 gap-x-10 gap-y-4">
        <div>
          <Label>Stone Name</Label>
          <SelectField
            value={value.stoneName}
            onChange={(v) => onChangePrimary({ stoneName: v })}
            options={stoneNameOptions}
          />
        </div>

        <div>
          <Label>Shape</Label>
          <SelectField
            value={value.shape}
            onChange={(v) => onChangePrimary({ shape: v })}
            options={shapeOptions}
          />
        </div>

        <div>
          <Label>Size</Label>
          <Input
            value={value.size}
            onChange={(v) => onChangePrimary({ size: v })}
          />
        </div>

        <div>
          <Label>S. Weight</Label>
          <WeightInput
            value={value.weightCts}
            onChange={(v) => onChangePrimary({ weightCts: v })}
            unit={value.weightUnit}
            onUnitChange={(u) => onChangePrimary({ weightUnit: u })}
          />
        </div>

        <div>
          <Label>Color</Label>
          <Input
            value={value.color}
            onChange={(v) => onChangePrimary({ color: v })}
          />
        </div>

        <div>
          <Label>Cutting</Label>
          <SelectField
            value={value.cutting}
            onChange={(v) => onChangePrimary({ cutting: v })}
            options={cuttingOptions}
          />
        </div>

        <div>
          <Label>Quality</Label>
          <SelectField
            value={value.quality}
            onChange={(v) => onChangePrimary({ quality: v })}
            options={qualityOptions}
          />
        </div>

        <div>
          <Label>Clarity</Label>
          <SelectField
            value={value.clarity}
            onChange={(v) => onChangePrimary({ clarity: v })}
            options={clarityOptions}
          />
        </div>
      </div>

      {/* ---------------- Additional Stones ---------------- */}
      {additionalStones.map((stone, index) => (
        <div key={index} className="mt-5 pt-5">
          <div className="flex items-center justify-start gap-x-[10px] mb-4">
            <div className="text-lg text-[#024C8A]">Additional Stone</div>
            <button
              type="button"
              onClick={() => onRemoveStone(index)}
              className="text-[#F1F1F1] hover:text-[#BABABA]"
            >
              <RemoveIcon className="w-[20px] h-[20px]" />
            </button>
          </div>

          <AdditionalStoneSection
            value={stone}
            onChange={(patch) => onChangeStone(index, patch)}
            stoneNameOptions={stoneNameOptions}
            shapeOptions={shapeOptions}
            cuttingOptions={cuttingOptions}
            qualityOptions={qualityOptions}
            clarityOptions={clarityOptions}
          />
        </div>
      ))}

      <div className="mt-6 mb-2">
        <button
          type="button"
          onClick={onAddStone}
          className="flex items-center gap-x-[10px] text-[#0690F1] text-base"
        >
          <PlusIcon className="w-[24px] h-[24px]" />
          Add Stone
        </button>
      </div>

      {/* ---------------- Add Stone ---------------- */}
      {/* <div className="mt-6">
        <button
          type="button"
          onClick={onAddStone}
          className="flex items-center gap-x-[10px] text-[#0690F1] text-base"
        >
          <PlusIcon className="w-[24px] h-[24px]" />
          Add Stone
        </button>
      </div> */}
    </div>
  );
};

export default PrimaryStoneCard;
