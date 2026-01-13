import React from "react";
import type { SelectOption, AccessoriesForm } from "../../../../types/product";
import DropdownArrowIcon from "../../../../assets/svg/dropdown-arrow2.svg?react";

type Props = {
  value: AccessoriesForm;
  options: SelectOption[];
  onChange: (patch: Partial<AccessoriesForm>) => void;
};

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

function SelectField({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  options: SelectOption[];
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-[38px] rounded-md border border-[#CFCFCF] bg-white px-3 pr-10 text-sm outline-none appearance-none"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
        <DropdownArrowIcon className="w-3 h-3" />
      </span>
    </div>
  );
}

const AccessoriesCard: React.FC<Props> = ({ value, options, onChange }) => {
  return (
    <div className="rounded-2xl border border-[#E6E6E6] bg-white px-6 py-5">
      <div className="mb-4 text-lg font-normal text-[#024C8A]">Accessories</div>

      <div className="grid grid-cols-3 gap-x-10 gap-y-4">
        <div>
          <Label>Code</Label>
          <SelectField
            value={value.code}
            onChange={(v) => onChange({ code: v })}
            options={options}
          />
        </div>

        <div>
          <Label>Product Name</Label>
          <Input
            value={value.productName}
            onChange={(v) => onChange({ productName: v })}
          />
        </div>

        <div>
          <Label>Weight</Label>
          <Input
            value={value.weight}
            onChange={(v) => onChange({ weight: v })}
          />
        </div>

        <div>
          <Label>Product Size</Label>
          <Input
            value={value.productSize}
            onChange={(v) => onChange({ productSize: v })}
          />
        </div>

        <div>
          <Label>Metal</Label>
          <Input value={value.metal} onChange={(v) => onChange({ metal: v })} />
        </div>

        <div>
          <Label>Description</Label>
          <Input
            value={value.description}
            onChange={(v) => onChange({ description: v })}
          />
        </div>
      </div>
    </div>
  );
};

export default AccessoriesCard;
