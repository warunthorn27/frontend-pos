import React from "react";
import type {
  BaseProductForm,
  SelectOption,
} from "../../../../types/product";
import DropdownArrowIcon from "../../../../assets/svg/dropdown-arrow2.svg?react";

type Props = {
  value: BaseProductForm;
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
      {icon && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
          {icon}
        </div>
      )}
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

const ProductInfoCard: React.FC<Props> = ({
  value,
  onChange,
  itemTypeOptions,
  metalOptions,
}) => {
  return (
    <div className="rounded-2xl border border-[#E6E6E6] bg-white px-6 py-5">
      <div className="grid grid-cols-[450px_240px_240px] gap-x-10">
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
              className="w-full h-[120px] rounded-md border border-[#CFCFCF] bg-white px-3 py-2 text-[13px] outline-none resize-none"
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
            <SelectField
              value={value.itemType}
              onChange={(v) => onChange({ itemType: v })}
              options={itemTypeOptions}
              icon={<DropdownArrowIcon className="w-3 h-3 text-black" />}
            />
          </div>

          <div>
            <Label required>Metal</Label>
            <SelectField
              value={value.metal}
              onChange={(v) => onChange({ metal: v })}
              options={metalOptions}
              icon={<DropdownArrowIcon className="w-3 h-3 text-black" />}
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
            <Label required>Nwt</Label>
            <UnitInput
              value={value.nwt}
              onChange={(v) => onChange({ nwt: v })}
              unit="g"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductInfoCard;
