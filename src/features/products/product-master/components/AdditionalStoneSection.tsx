import React from "react";
import type {
  AdditionalStoneForm,
  SelectOption,
  WeightUnit,
} from "../../../../types/product";
import PlusIcon from "../../../../assets/svg/plus.svg?react";
import DropdownArrowIcon from "../../../../assets/svg/dropdown-arrow2.svg?react";

type Props = {
  stones: AdditionalStoneForm[];
  onAdd: () => void;
  onChangeStone: (index: number, patch: Partial<AdditionalStoneForm>) => void;
  onRemoveStone: (index: number) => void;

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

const AdditionalStoneSection: React.FC<Props> = ({
  stones,
  onAdd,
  onChangeStone,
  onRemoveStone,
  stoneNameOptions,
  shapeOptions,
  cuttingOptions,
  qualityOptions,
  clarityOptions,
}) => {
  return (
    <div className="mt-6">
      {stones.length > 0 && (
        <div className="flex flex-col gap-6">
          {stones.map((st, idx) => (
            <div
              key={`add-${idx}`}
              className="grid grid-cols-[minmax(0,2fr),minmax(0,1.2fr)] gap-6"
            >
              <div className="rounded-2xl border border-[#E6E6E6] bg-white px-6 py-5">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-lg font-normal text-[#024C8A]">
                    Additional Stone
                  </div>

                  <button
                    type="button"
                    className="text-[#0F0F0F]"
                    onClick={() => onRemoveStone(idx)}
                    aria-label="remove additional stone"
                    title="Remove"
                  >
                    ✕
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-x-10 gap-y-4">
                  <div>
                    <Label>Stone Name</Label>
                    <SelectField
                      value={st.stoneName}
                      onChange={(v) => onChangeStone(idx, { stoneName: v })}
                      options={stoneNameOptions}
                      icon={
                        <DropdownArrowIcon className="w-3 h-3 text-black" />
                      }
                    />
                  </div>

                  <div>
                    <Label>Shape</Label>
                    <SelectField
                      value={st.shape}
                      onChange={(v) => onChangeStone(idx, { shape: v })}
                      options={shapeOptions}
                      icon={
                        <DropdownArrowIcon className="w-3 h-3 text-black" />
                      }
                    />
                  </div>

                  <div>
                    <Label>Size</Label>
                    <Input
                      value={st.size}
                      onChange={(v) => onChangeStone(idx, { size: v })}
                    />
                  </div>

                  <div>
                    <Label>Weight</Label>
                    <WeightInput
                      value={st.weightCts}
                      onChange={(v) => onChangeStone(idx, { weightCts: v })}
                      unit={st.weightUnit}
                      onUnitChange={(u) =>
                        onChangeStone(idx, { weightUnit: u })
                      }
                      icon={
                        <DropdownArrowIcon className="w-3 h-3 text-black" />
                      }
                    />
                  </div>

                  <div>
                    <Label>Color</Label>
                    <Input
                      value={st.color}
                      onChange={(v) => onChangeStone(idx, { color: v })}
                    />
                  </div>

                  <div>
                    <Label>Cutting</Label>
                    <SelectField
                      value={st.cutting}
                      onChange={(v) => onChangeStone(idx, { cutting: v })}
                      options={cuttingOptions}
                      icon={
                        <DropdownArrowIcon className="w-3 h-3 text-black" />
                      }
                    />
                  </div>

                  <div>
                    <Label>Quality</Label>
                    <SelectField
                      value={st.quality}
                      onChange={(v) => onChangeStone(idx, { quality: v })}
                      options={qualityOptions}
                      icon={
                        <DropdownArrowIcon className="w-3 h-3 text-black" />
                      }
                    />
                  </div>

                  <div>
                    <Label>Clarity</Label>
                    <SelectField
                      value={st.clarity}
                      onChange={(v) => onChangeStone(idx, { clarity: v })}
                      options={clarityOptions}
                      icon={
                        <DropdownArrowIcon className="w-3 h-3 text-black" />
                      }
                    />
                  </div>

                  <div>
                    <Label>Qty</Label>
                    <Input
                      value={st.qty}
                      onChange={(v) => onChangeStone(idx, { qty: v })}
                    />
                  </div>
                </div>
              </div>

              <div />
            </div>
          ))}
        </div>
      )}

      <div className="mt-6">
        <button
          type="button"
          onClick={onAdd}
          className="flex items-center gap-x-[10px] text-[#0690F1] text-base"
        >
          <PlusIcon className="w-[24px] h-[24px]" />
          Add Stone
        </button>
      </div>
    </div>
  );
};

export default AdditionalStoneSection;
