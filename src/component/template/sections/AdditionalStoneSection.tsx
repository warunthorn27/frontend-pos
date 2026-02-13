import React from "react";
import WeightInput from "../../../component/input/WeightInput";
import type { AdditionalStoneForm } from "../../../types/product/form";
import type { SelectOption } from "../../../types/shared/select";
import { WEIGHT_UNIT_OPTIONS } from "../../../types/shared/unit";
import MasterInputSelect from "../../../component/masterData/MasterInputSelect";
import ReadonlyField from "../../ui/ReadonlyField";

type Props = {
  value: AdditionalStoneForm;
  onChange: (patch: Partial<AdditionalStoneForm>) => void;
  mode: "create" | "edit" | "view";
  stoneNameOptions: SelectOption[];
  shapeOptions: SelectOption[];
  cuttingOptions: SelectOption[];
  qualityOptions: SelectOption[];
  clarityOptions: SelectOption[];
};

/* ---------------- UI helpers ---------------- */

function Label({ children }: { children: React.ReactNode }) {
  return (
    <label className="block text-base font-normal text-black mb-2">
      {children}
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

/* ---------------- Component ---------------- */

const AdditionalStoneSection: React.FC<Props> = ({
  value,
  onChange,
  mode,
  stoneNameOptions,
  shapeOptions,
  cuttingOptions,
  qualityOptions,
  clarityOptions,
}) => {
  const isView = mode === "view";

  return (
    <div className="grid grid-cols-3 gap-x-10 gap-y-4">
      <div>
        <Label>Stone Name</Label>
        {isView ? (
          <ReadonlyField
            value={
              stoneNameOptions.find((o) => o.value === value.stoneName)?.label
            }
          />
        ) : (
          <MasterInputSelect
            value={value.stoneName}
            onChange={(v) => onChange({ stoneName: v })}
            options={stoneNameOptions}
            allowCreate
          />
        )}
      </div>

      <div>
        <Label>Shape</Label>
        {isView ? (
          <ReadonlyField
            value={shapeOptions.find((o) => o.value === value.shape)?.label}
          />
        ) : (
          <MasterInputSelect
            value={value.shape}
            onChange={(v) => onChange({ shape: v })}
            options={shapeOptions}
            allowCreate
          />
        )}
      </div>

      <div>
        <Label>Size</Label>
        {isView ? (
          <ReadonlyField value={value.size} />
        ) : (
          <Input value={value.size} onChange={(v) => onChange({ size: v })} />
        )}
      </div>

      <div>
        <Label>S. Weight</Label>
        {isView ? (
          <ReadonlyField value={`${value.weight} ${value.unit}`} />
        ) : (
          <WeightInput
            value={value.weight}
            unit={value.unit}
            unitOptions={WEIGHT_UNIT_OPTIONS}
            onChangeValue={(v) => onChange({ weight: v })}
            onChangeUnit={(u) => onChange({ unit: u })}
          />
        )}
      </div>

      <div>
        <Label>Color</Label>
        {isView ? (
          <ReadonlyField value={value.color} />
        ) : (
          <Input value={value.color} onChange={(v) => onChange({ color: v })} />
        )}
      </div>

      <div>
        <Label>Cutting</Label>
        {isView ? (
          <ReadonlyField
            value={cuttingOptions.find((o) => o.value === value.cutting)?.label}
          />
        ) : (
          <MasterInputSelect
            value={value.cutting}
            onChange={(v) => onChange({ cutting: v })}
            options={cuttingOptions}
            allowCreate
          />
        )}
      </div>

      <div>
        <Label>Quality</Label>
        {isView ? (
          <ReadonlyField
            value={qualityOptions.find((o) => o.value === value.quality)?.label}
          />
        ) : (
          <MasterInputSelect
            value={value.quality}
            onChange={(v) => onChange({ quality: v })}
            options={qualityOptions}
            allowCreate
          />
        )}
      </div>

      <div>
        <Label>Clarity</Label>
        {isView ? (
          <ReadonlyField
            value={clarityOptions.find((o) => o.value === value.clarity)?.label}
          />
        ) : (
          <MasterInputSelect
            value={value.clarity}
            onChange={(v) => onChange({ clarity: v })}
            options={clarityOptions}
            allowCreate
          />
        )}
      </div>
    </div>
  );
};

export default AdditionalStoneSection;
