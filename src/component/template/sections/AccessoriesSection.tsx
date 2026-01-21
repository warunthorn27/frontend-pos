import React from "react";
import WeightInput from "../../../component/input/WeightInput";
import type { AccessoriesForm } from "../../../types/product/form";
import type { SelectOption } from "../../../types/shared/select";
import { WEIGHT_UNIT_OPTIONS } from "../../../types/shared/unit";
import MasterInputSelect from "../../../component/masterData/MasterInputSelect";

type Props = {
  value: AccessoriesForm;
  options: SelectOption[];
  onChange: (patch: Partial<AccessoriesForm>) => void;
};

function Label({ children }: { children: React.ReactNode }) {
  return (
    <label className="block text-base font-normal text-black mb-2">{children}</label>
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

const AccessoriesSection: React.FC<Props> = ({ value, options, onChange }) => {
  return (
    <div className="rounded-2xl border border-[#E6E6E6] bg-white px-6 py-5">
      <div className="mb-4 text-lg font-normal text-[#024C8A]">Accessories</div>

      <div className="grid grid-cols-3 gap-x-10 gap-y-4">
        <div>
          <Label>Code</Label>
          <MasterInputSelect
            value={value.code}
            onChange={(v) => onChange({ code: v })}
            options={options}
          />
        </div>

        <div>
          <Label>Weight</Label>
          <WeightInput
            value={value.weight}
            unit={value.weightUnit}
            unitOptions={WEIGHT_UNIT_OPTIONS}
            onChangeValue={(v) => onChange({ weight: v })}
            onChangeUnit={(u) => onChange({ weightUnit: u })}
          />
        </div>

        <div>
          <Label>Description</Label>
          <Input
            value={value.description}
            onChange={(v) => onChange({ description: v })}
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
      </div>
    </div>
  );
};

export default AccessoriesSection;
