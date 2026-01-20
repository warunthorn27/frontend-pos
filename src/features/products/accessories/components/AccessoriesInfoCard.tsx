import React from "react";
import ToggleSwitch from "../../../../component/toggle/ToggleSwitch";
import WeightInput from "../../common/WeightInput";
import type { AccessoriesForm } from "../../../../types/product/form";
import type { SelectOption } from "../../../../types/shared/select";
import { WEIGHT_UNIT_OPTIONS } from "../../../../types/shared/unit";
import MasterInputSelect from "../../../../component/masterData/MasterInputSelect";

type Props = {
  value: AccessoriesForm;
  onChange: (patch: Partial<AccessoriesForm>) => void;
  metalOptions: SelectOption[];
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

const StoneDiamondInfoCard: React.FC<Props> = ({
  value,
  onChange,
  metalOptions,
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

              <div>
                <Label required>Metal</Label>
                <MasterInputSelect
                  value={value.metal}
                  onChange={(v) => onChange({ metal: v })}
                  options={metalOptions}
                />
              </div>
            </div>

            <div className="flex flex-col gap-y-4 mt-4">
              <div>
                <Label required>Weight</Label>
                <WeightInput
                  value={value.weight}
                  unit={value.weightUnit}
                  unitOptions={WEIGHT_UNIT_OPTIONS}
                  onChangeValue={(v) => onChange({ weight: v })}
                  onChangeUnit={(u) => onChange({ weightUnit: u })}
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
              className="w-full h-[120px] rounded-md border border-[#CFCFCF] bg-white px-3 py-2 text-[13px] outline-none"
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

export default StoneDiamondInfoCard;
