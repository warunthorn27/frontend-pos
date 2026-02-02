import React from "react";
import ToggleSwitch from "../../../../component/ui/ToggleSwitch";
import WeightInput from "../../../../component/input/WeightInput";
import type { AccessoriesForm } from "../../../../types/product/form";
import type { SelectOption } from "../../../../types/shared/select";
import MasterInputSelect from "../../../../component/masterData/MasterInputSelect";
import ReadonlyField from "../../../../component/ui/ReadonlyField";
import { WEIGHT_UNIT_OPTIONS } from "../../../../types/shared/unit";

type Props = {
  value: AccessoriesForm;
  onChange: (patch: Partial<AccessoriesForm>) => void;
  metalOptions: SelectOption[];
  mode: "view" | "edit";
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

const AccessoriesInfoCard: React.FC<Props> = ({
  value,
  onChange,
  metalOptions,
  mode,
}) => {
  const isView = mode === "view";

  return (
    <div className="w-full h-full rounded-md border bg-white flex flex-col min-h-0">
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
          </div>

          <div className="grid grid-cols-2 gap-x-10 mb-4">
            <div className="flex flex-col gap-y-4 mt-4">
              <div>
                <Label required>Product Size</Label>
                {isView ? (
                  <ReadonlyField value={value.productSize} />
                ) : (
                  <Input
                    value={value.productSize}
                    onChange={(v) => onChange({ productSize: v })}
                  />
                )}
              </div>

              <div>
                <div>
                  <Label required>Metal</Label>
                  {isView ? (
                    <ReadonlyField
                      value={
                        metalOptions.find((o) => o.value === value.metal)?.label
                      }
                    />
                  ) : (
                    <MasterInputSelect
                      value={value.metal}
                      options={metalOptions}
                      onChange={(v) => onChange({ metal: v })}
                      allowCreate
                    />
                  )}
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-y-4 mt-4">
              <div>
                <Label required>Weight</Label>
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
            </div>
          </div>

          <div>
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
        </div>
      </div>
    </div>
  );
};

export default AccessoriesInfoCard;
