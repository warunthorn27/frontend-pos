import React from "react";
import ToggleSwitch from "../../../../component/ui/ToggleSwitch";
import WeightInput from "../../../../component/input/WeightInput";
import type { StoneDiamondForm } from "../../../../types/product/form";
import type { SelectOption } from "../../../../types/shared/select";
import { WEIGHT_UNIT_OPTIONS } from "../../../../types/shared/unit";
import MasterInputSelect from "../../../../component/masterData/MasterInputSelect";

type Props = {
  value: StoneDiamondForm;
  onChange: (patch: Partial<StoneDiamondForm>) => void;
  readonly?: boolean;
  stoneNameOptions: SelectOption[];
  shapeOptions: SelectOption[];
  cuttingOptions: SelectOption[];
  qualityOptions: SelectOption[];
  clarityOptions: SelectOption[];
};

function Label({
  children,
  required,
}: {
  children: React.ReactNode;
  required?: boolean;
}) {
  return (
    <label className="block text-base font-normal text-black mb-2">
      {children} {required ? <span className="text-red-500">*</span> : null}
    </label>
  );
}

function Input({
  value,
  onChange,
  readonly,
}: {
  value: string;
  onChange: (v: string) => void;
  readonly?: boolean;
}) {
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={readonly}
      className="w-full h-[38px] rounded-md border border-[#CFCFCF] bg-white px-3 text-sm outline-none"
    />
  );
}

const StoneDiamondInfoCard: React.FC<Props> = ({
  value,
  onChange,
  readonly,
  stoneNameOptions,
  shapeOptions,
  cuttingOptions,
  qualityOptions,
  clarityOptions,
}) => {
  return (
    <div className="w-full rounded-2xl border bg-white">
      <div className="px-6 py-5">
        {/* HEADER : Toggle */}
        <div className="flex items-center gap-3 mb-4">
          <ToggleSwitch
            checked={value.active}
            onChange={(checked) => onChange({ active: checked })}
          />
          <span className="text-sm text-[#1F2937]">
            {value.active ? "Active" : "Inactive"}
          </span>
        </div>
        <div className="grid grid-cols-1 max-w-[525px] w-full">
          {/* LEFT */}
          <div className="flex flex-col gap-y-4">
            <div>
              <Label required>Product Name</Label>
              <Input
                value={value.productName}
                onChange={(v) => onChange({ productName: v })}
                readonly={readonly}
              />
            </div>

            <div>
              <Label required>Code</Label>
              <Input
                value={value.code}
                onChange={(v) => onChange({ code: v })}
                readonly={readonly}
              />
            </div>

            <div>
              <Label>Description</Label>
              <textarea
                value={value.description}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                  onChange({ description: e.target.value })
                }
                maxLength={300}
                className="w-full h-[38px] rounded-md border border-[#CFCFCF] bg-white px-3 py-2 text-[13px] outline-none"
              />
              <p className="text-xs text-[#7A7A7A]">
                *Description should not exceed 300 letters
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-x-10">
            {/* MID */}
            <div className="flex flex-col gap-y-4 mt-4">
              <div>
                <Label required>Stone Name</Label>
                <MasterInputSelect
                  value={value.stoneName}
                  onChange={(v) => onChange({ stoneName: v })}
                  options={stoneNameOptions}
                />
              </div>

              <div>
                <Label required>Size</Label>
                <Input
                  value={value.size}
                  onChange={(v) => onChange({ size: v })}
                  readonly={readonly}
                />
              </div>

              <div>
                <Label>Color</Label>
                <Input
                  value={value.color}
                  onChange={(v) => onChange({ color: v })}
                  readonly={readonly}
                />
              </div>

              <div>
                <Label>Quality</Label>
                <MasterInputSelect
                  value={value.quality}
                  onChange={(v) => onChange({ quality: v })}
                  options={qualityOptions}
                />
              </div>
            </div>

            {/* RIGHT */}
            <div className="flex flex-col gap-y-4 mt-4">
              <div>
                <Label required>Shape</Label>
                <MasterInputSelect
                  value={value.shape}
                  onChange={(v) => onChange({ shape: v })}
                  options={shapeOptions}
                />
              </div>

              <div>
                <Label required>S. Weight</Label>
                <WeightInput
                  value={value.weight}
                  unit={value.unit}
                  unitOptions={WEIGHT_UNIT_OPTIONS}
                  onChangeValue={(v) => onChange({ weight: v })}
                  onChangeUnit={(u) => onChange({ unit: u })}
                />
              </div>

              <div>
                <Label>Cutting</Label>
                <MasterInputSelect
                  value={value.cutting}
                  onChange={(v) => onChange({ cutting: v })}
                  options={cuttingOptions}
                />
              </div>

              <div>
                <Label>Clarity</Label>
                <MasterInputSelect
                  value={value.clarity}
                  onChange={(v) => onChange({ clarity: v })}
                  options={clarityOptions}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoneDiamondInfoCard;
