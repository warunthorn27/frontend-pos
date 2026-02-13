import React from "react";
import ToggleSwitch from "../../ui/ToggleSwitch";
import type { BaseProductForm } from "../../../types/product/form";
import type { SelectOption } from "../../../types/shared/select";
import MasterInputSelect from "../../../component/masterData/MasterInputSelect";
import ReadonlyField from "../../ui/ReadonlyField";

type Props = {
  value: BaseProductForm;
  mode: "create" | "edit" | "view";
  onChange: (patch: Partial<BaseProductForm>) => void;
  itemTypeOptions: SelectOption[];
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
  readonly,
}: {
  value: string;
  onChange: (v: string) => void;
  unit: string;
  readonly?: boolean;
}) {
  return (
    <div className="relative">
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        inputMode="decimal"
        disabled={readonly}
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
  mode,
  onChange,
  itemTypeOptions,
  metalOptions,
}) => {
  const isView = mode === "view";

  return (
    <div className="h-full w-full mb-5 rounded-md border border-[#E6E6E6] bg-white px-6 py-5">
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

      {/* FORM GRID */}
      <div className="grid grid-cols-[minmax(0,2fr)_minmax(0,1fr)_minmax(0,1fr)] gap-x-10">
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
              <ReadonlyField value={value.description} multiline height={120} />
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

        {/* MID */}
        <div className="flex flex-col gap-y-4">
          <div>
            <Label required>Item Type</Label>
            {isView ? (
              <ReadonlyField
                value={
                  itemTypeOptions.find((o) => o.value === value.itemType)?.label
                }
              />
            ) : (
              <MasterInputSelect
                value={value.itemType}
                onChange={(v) => onChange({ itemType: v })}
                options={itemTypeOptions}
                allowCreate
              />
            )}
          </div>

          <div>
            <Label required>Metal</Label>
            {isView ? (
              <ReadonlyField
                value={metalOptions.find((o) => o.value === value.metal)?.label}
              />
            ) : (
              <MasterInputSelect
                value={value.metal}
                onChange={(v) => onChange({ metal: v })}
                options={metalOptions}
                allowCreate
              />
            )}
          </div>

          <div>
            <Label required>Nwt</Label>
            {isView ? (
              <ReadonlyField value={`${value.nwt} g`} />
            ) : (
              <UnitInput
                value={value.nwt}
                onChange={(v) => onChange({ nwt: v })}
                unit="g"
              />
            )}
          </div>
        </div>

        {/* RIGHT */}
        <div className="flex flex-col gap-y-4">
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
            <Label>Metal Color</Label>
            {isView ? (
              <ReadonlyField value={value.metalColor} />
            ) : (
              <Input
                value={value.metalColor}
                onChange={(v) => onChange({ metalColor: v })}
              />
            )}
          </div>

          <div>
            <Label required>Gwt</Label>
            {isView ? (
              <ReadonlyField value={`${value.gwt} g`} />
            ) : (
              <UnitInput
                value={value.gwt}
                onChange={(v) => onChange({ gwt: v })}
                unit="g"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductInfoSection;
