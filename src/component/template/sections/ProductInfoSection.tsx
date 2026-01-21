import React from "react";
import ToggleSwitch from "../../../component/toggle/ToggleSwitch";
import type { BaseProductForm } from "../../../types/product/form";
import type { SelectOption } from "../../../types/shared/select";
import MasterInputSelect from "../../../component/masterData/MasterInputSelect";

type Props = {
  value: BaseProductForm;
  onChange: (patch: Partial<BaseProductForm>) => void;
  itemTypeOptions: SelectOption[];
  metalOptions: SelectOption[];
  readonly: boolean;
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

function UnitInput({
  value,
  onChange,
  unit,
}: {
  value: string;
  onChange: (v: string) => void;
  unit: string;
}) {
  return (
    <div className="relative">
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        inputMode="decimal"
        className="w-full h-[38px] rounded-md border border-[#CFCFCF] bg-white pl-3 pr-10 text-sm outline-none"
      />
      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-[#7A7A7A]">
        {unit}
      </span>
    </div>
  );
}

const ProductInfoSection: React.FC<Props> = ({
  value,
  onChange,
  itemTypeOptions,
  metalOptions,
}) => {
  return (
    <div className="h-full min-h-0 w-full rounded-2xl border border-[#E6E6E6] bg-white px-6 py-5">
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

      {/* FORM GRID */}
      <div className="grid grid-cols-[minmax(0,2fr)_minmax(0,1fr)_minmax(0,1fr)] gap-x-10">
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
            <Input value={value.code} onChange={(v) => onChange({ code: v })} />
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

        {/* MID */}
        <div className="flex flex-col gap-y-4">
          <div>
            <Label required>Item Type</Label>
            <MasterInputSelect
              value={value.itemType}
              onChange={(v) => onChange({ itemType: v })}
              options={itemTypeOptions}
              placeholder="Select"
            />
          </div>

          <div>
            <Label required>Metal</Label>
            <MasterInputSelect
              value={value.metal}
              onChange={(v) => onChange({ metal: v })}
              options={metalOptions}
              placeholder="Select"
            />
          </div>

          <div>
            <Label required>Nwt</Label>
            <UnitInput
              value={value.nwt}
              onChange={(v) => onChange({ nwt: v })}
              unit="g"
            />
          </div>
        </div>

        {/* RIGHT */}
        <div className="flex flex-col gap-y-4">
          <div>
            <Label required>Product Size</Label>
            <Input
              value={value.productSize}
              onChange={(v) => onChange({ productSize: v })}
            />
          </div>

          <div>
            <Label>Metal Color</Label>
            <Input
              value={value.metalColor}
              onChange={(v) => onChange({ metalColor: v })}
            />
          </div>

          <div>
            <Label required>Gwt</Label>
            <UnitInput
              value={value.gwt}
              onChange={(v) => onChange({ gwt: v })}
              unit="g"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductInfoSection;
