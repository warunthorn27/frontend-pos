import React from "react";
import PlusIcon from "../../../assets/svg/plus.svg?react";
import AdditionalStoneSection from "./AdditionalStoneSection";
import RemoveIcon from "../../../assets/svg/remove-hover.svg?react";
import WeightInput from "../../../component/input/WeightInput";
import type {
  AdditionalStoneForm,
  PrimaryStoneForm,
} from "../../../types/product/form";
import type { SelectOption } from "../../../types/shared/select";
import { WEIGHT_UNIT_OPTIONS } from "../../../types/shared/unit";
import MasterInputSelect from "../../../component/masterData/MasterInputSelect";
import ReadonlyField from "../../ui/ReadonlyField";

type Props = {
  value: PrimaryStoneForm;
  additionalStones: AdditionalStoneForm[];
  mode: "create" | "edit" | "view";
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

/* Component */

const PrimaryStoneSection: React.FC<Props> = ({
  value,
  mode,
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
  const isView = mode === "view";

  return (
    <div className="h-full w-full mb-5 rounded-md border border-[#E6E6E6] bg-white px-6 py-5">
      <div className="mb-4 text-lg font-normal text-[#024C8A]">
        Primary Stone
      </div>

      {/* ---------------- Primary Stone ---------------- */}
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
              onChange={(v) => onChangePrimary({ stoneName: v })}
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
              onChange={(v) => onChangePrimary({ shape: v })}
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
            <Input
              value={value.size}
              onChange={(v) => onChangePrimary({ size: v })}
            />
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
              onChangeValue={(v) => onChangePrimary({ weight: v })}
              onChangeUnit={(u) => onChangePrimary({ unit: u })}
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
              onChange={(v) => onChangePrimary({ color: v })}
            />
          )}
        </div>

        <div>
          <Label>Cutting</Label>
          {isView ? (
            <ReadonlyField
              value={
                cuttingOptions.find((o) => o.value === value.cutting)?.label
              }
            />
          ) : (
            <MasterInputSelect
              value={value.cutting}
              onChange={(v) => onChangePrimary({ cutting: v })}
              options={cuttingOptions}
              allowCreate
            />
          )}
        </div>

        <div>
          <Label>Quality</Label>
          {isView ? (
            <ReadonlyField
              value={
                qualityOptions.find((o) => o.value === value.quality)?.label
              }
            />
          ) : (
            <MasterInputSelect
              value={value.quality}
              onChange={(v) => onChangePrimary({ quality: v })}
              options={qualityOptions}
              allowCreate
            />
          )}
        </div>

        <div>
          <Label>Clarity</Label>
          {isView ? (
            <ReadonlyField
              value={
                clarityOptions.find((o) => o.value === value.clarity)?.label
              }
            />
          ) : (
            <MasterInputSelect
              value={value.clarity}
              onChange={(v) => onChangePrimary({ clarity: v })}
              options={clarityOptions}
              allowCreate
            />
          )}
        </div>
      </div>

      {/* ---------------- Additional Stones ---------------- */}
      {additionalStones.map((stone, index) => (
        <div key={`${stone.stoneName}-${index}`} className="mt-5 pt-5">
          <div className="flex items-center justify-start gap-x-5 mb-4">
            <div className="text-lg text-[#024C8A]">Additional Stone</div>
            {mode !== "view" && (
              <button
                type="button"
                onClick={() => onRemoveStone(index)}
                className="text-[#F1F1F1] hover:text-[#BABABA]"
              >
                <RemoveIcon className="w-[20px] h-[20px]" />
              </button>
            )}
          </div>

          <AdditionalStoneSection
            value={stone}
            onChange={(patch) => onChangeStone(index, patch)}
            mode={mode}
            stoneNameOptions={stoneNameOptions}
            shapeOptions={shapeOptions}
            cuttingOptions={cuttingOptions}
            qualityOptions={qualityOptions}
            clarityOptions={clarityOptions}
          />
        </div>
      ))}

      {!isView && (
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
      )}
    </div>
  );
};

export default PrimaryStoneSection;
