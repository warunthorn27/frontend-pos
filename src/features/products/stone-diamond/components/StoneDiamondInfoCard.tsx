import React from "react";
import ToggleSwitch from "../../../../component/ui/ToggleSwitch";
import WeightInput from "../../../../component/input/WeightInput";
import type { StoneDiamondForm } from "../../../../types/product/form";
import type { SelectOption } from "../../../../types/shared/select";
import { WEIGHT_UNIT_OPTIONS } from "../../../../types/shared/unit";
import MasterInputSelect from "../../../../component/masterData/MasterInputSelect";
import ReadonlyField from "../../../../component/ui/ReadonlyField";

type Props = {
  value: StoneDiamondForm;
  onChange: (patch: Partial<StoneDiamondForm>) => void;
  readonly?: boolean;
  mode: "create" | "edit" | "view";
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
  mode,
  stoneNameOptions,
  shapeOptions,
  cuttingOptions,
  qualityOptions,
  clarityOptions,
}) => {
  const isView = mode === "view";

  return (
    <div className="w-full rounded-md border bg-white">
      <div className="px-6 py-5">
        {/* HEADER : Toggle */}
        <div className="flex items-center gap-3 mb-4">
          <ToggleSwitch
            checked={value.active}
            onChange={(checked) => onChange({ active: checked })}
            disabled={isView}
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
              {isView ? (
                <ReadonlyField value={value.productName} />
              ) : (
                <Input
                  value={value.productName}
                  onChange={(v) => onChange({ productName: v })}
                />
              )}
            </div>

            <div>
              <Label required>Code</Label>
              {isView ? (
                <ReadonlyField value={value.code} />
              ) : (
                <Input
                  value={value.code}
                  onChange={(v) => onChange({ code: v })}
                />
              )}
            </div>

            <div>
              <Label>Description</Label>
              {isView ? (
                <ReadonlyField
                  value={value.description}
                  multiline
                  height={120}
                />
              ) : (
                <>
                  <textarea
                    value={value.description}
                    onChange={(e) => onChange({ description: e.target.value })}
                    maxLength={300}
                    className="w-full h-[120px] rounded-md border border-[#CFCFCF] bg-white px-3 py-2 text-[13px] outline-none"
                  />
                  <p className="text-xs text-[#7A7A7A]">
                    *Description should not exceed 300 letters
                  </p>
                </>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-x-10">
            {/* MID */}
            <div className="flex flex-col gap-y-4 mt-4">
              <div>
                <Label required>Stone Name</Label>
                {isView ? (
                  <ReadonlyField
                    value={
                      stoneNameOptions.find((o) => o.value === value.stoneName)
                        ?.label
                    }
                  />
                ) : (
                  <MasterInputSelect
                    value={value.stoneName}
                    options={stoneNameOptions}
                    onChange={(v) => onChange({ stoneName: v })}
                    allowCreate
                  />
                )}
              </div>

              <div>
                <Label required>Size</Label>
                {isView ? (
                  <ReadonlyField value={value.size} />
                ) : (
                  <Input
                    value={value.size}
                    onChange={(v) => onChange({ size: v })}
                  />
                )}
              </div>

              <div>
                <Label>Color</Label>
                {isView ? (
                  <ReadonlyField value={value.color} />
                ) : (
                  <Input
                    value={value.color}
                    onChange={(v) => onChange({ color: v })}
                  />
                )}
              </div>

              <div>
                <Label>Quality</Label>
                {isView ? (
                  <ReadonlyField
                    value={
                      qualityOptions.find((o) => o.value === value.quality)
                        ?.label
                    }
                  />
                ) : (
                  <MasterInputSelect
                    value={value.quality}
                    options={qualityOptions}
                    onChange={(v) => onChange({ quality: v })}
                    allowCreate
                  />
                )}
              </div>
            </div>

            {/* RIGHT */}
            <div className="flex flex-col gap-y-4 mt-4">
              <div>
                <Label required>Shape</Label>
                {isView ? (
                  <ReadonlyField
                    value={
                      shapeOptions.find((o) => o.value === value.shape)?.label
                    }
                  />
                ) : (
                  <MasterInputSelect
                    value={value.shape}
                    options={shapeOptions}
                    onChange={(v) => onChange({ shape: v })}
                    allowCreate
                  />
                )}
              </div>

              <div>
                <Label required>S. Weight</Label>
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
                <Label>Cutting</Label>
                {isView ? (
                  <ReadonlyField
                    value={
                      cuttingOptions.find((o) => o.value === value.cutting)
                        ?.label
                    }
                  />
                ) : (
                  <MasterInputSelect
                    value={value.cutting}
                    options={cuttingOptions}
                    onChange={(v) => onChange({ cutting: v })}
                    allowCreate
                  />
                )}
              </div>

              <div>
                <Label>Clarity</Label>
                {isView ? (
                  <ReadonlyField
                    value={
                      clarityOptions.find((o) => o.value === value.clarity)
                        ?.label
                    }
                  />
                ) : (
                  <MasterInputSelect
                    value={value.clarity}
                    options={clarityOptions}
                    onChange={(v) => onChange({ clarity: v })}
                    allowCreate
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoneDiamondInfoCard;
