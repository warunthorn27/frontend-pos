import React from "react";
import WeightInput from "../../../component/input/WeightInput";
import type { AdditionalStoneForm } from "../../../types/product/form";
import type { SelectOption } from "../../../types/shared/select";
import { WEIGHT_UNIT_OPTIONS } from "../../../types/shared/unit";
import MasterInputSelect from "../../../component/masterData/MasterInputSelect";

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
        <MasterInputSelect
          value={value.stoneName}
          onChange={(v) => onChange({ stoneName: v })}
          options={stoneNameOptions}
        />
      </div>

      <div>
        <Label>Shape</Label>
        <MasterInputSelect
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
          value={value.weight}
          unit={value.unit}
          unitOptions={WEIGHT_UNIT_OPTIONS}
          onChangeValue={(v) => onChange({ weight: v })}
          onChangeUnit={(u) => onChange({ unit: u })}
        />
      </div>

      <div>
        <Label>Color</Label>
        <Input value={value.color} onChange={(v) => onChange({ color: v })} />
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
        <Label>Quality</Label>
        <MasterInputSelect
          value={value.quality}
          onChange={(v) => onChange({ quality: v })}
          options={qualityOptions}
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
  );
};

export default AdditionalStoneSection;
