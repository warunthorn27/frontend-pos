import React from "react";
import WeightInput from "../../../component/input/WeightInput";
import type { AccessoriesForm } from "../../../types/product/form";
import type {
  AccessoriesOption,
  SelectOption,
} from "../../../types/shared/select";
import { WEIGHT_UNIT_OPTIONS } from "../../../types/shared/unit";
import MasterInputSelect from "../../../component/masterData/MasterInputSelect";
import ReadonlyField from "../../ui/ReadonlyField";

type Props = {
  value: AccessoriesForm;
  options: AccessoriesOption[];
  onChange: (patch: Partial<AccessoriesForm>) => void;
  mode: "create" | "edit" | "view";
  metalOptions: SelectOption[];
};

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
  disabled = false,
  readonly,
}: {
  value: string;
  onChange: (v: string) => void;
  disabled?: boolean;
  readonly?: boolean;
}) {
  return (
    <input
      value={value}
      disabled={disabled}
      readOnly={readonly}
      onChange={(e) => onChange(e.target.value)}
      className="
        w-full h-[38px]
        rounded-md border border-[#CFCFCF]
        bg-white px-3 text-sm outline-none
        disabled:bg-[#F5F5F5] disabled:text-[#9AA3B2]
      "
    />
  );
}

const AccessoriesSection: React.FC<Props> = ({
  value,
  options,
  onChange,
  mode,
}) => {
  // console.log("accessories options", options);
  // console.log("FORM productId:", value.productId);
  // console.log(
  //   "OPTIONS values:",
  //   options.map((o) => o.value),
  // );

  const isView = mode === "view";

  const selectOptions: SelectOption[] = options.map((o) => ({
    label: o.label, // สิ่งที่ user เห็น
    value: o.value, // ถ้า value = _id ทุกอย่างจะทำงาน
  }));

  return (
    <div className="h-full w-full rounded-md border border-[#E6E6E6] bg-white px-6 py-5">
      <div className="mb-4 text-lg font-normal text-[#024C8A]">Accessories</div>

      <div className="grid grid-cols-3 gap-x-10 gap-y-4">
        {/* --- Row 1 : editable --- */}

        <div>
          <Label>Product Name</Label>
          {isView ? (
            <ReadonlyField value={value.productName} />
          ) : (
            <MasterInputSelect
              value={value.productId}
              options={selectOptions}
              onChange={(v) => {
                // clear
                if (!v) {
                  onChange({
                    productId: "",
                    code: "",
                    productName: "",
                    productSize: "",
                    metal: "",
                    weight: "",
                    description: "",
                  });

                  return;
                }

                const acc = options.find((o) => o.value === v);
                if (!acc) return;

                onChange({
                  productId: acc.value, // id
                  code: acc.productCode ?? "",
                  productName: acc.productName,
                  productSize: acc.productSize,
                  metal: acc.metal,
                  weight: acc.defaultWeight ?? "",
                });
              }}
            />
          )}
        </div>

        <div>
          <Label>Weight</Label>

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
          <Label>Description</Label>
          {isView ? (
            <ReadonlyField value={value.description} />
          ) : (
            <Input
              value={value.description}
              onChange={(v) => onChange({ description: v })}
            />
          )}
        </div>

        {/* --- Row 2 : readonly --- */}
        <div>
          <Label>Code</Label>
          {isView ? (
            <ReadonlyField value={value.code} />
          ) : (
            <Input value={value.code} onChange={() => {}} readonly />
          )}
        </div>

        <div>
          <Label>Product Size</Label>
          <Input value={value.productSize} onChange={() => {}} />
        </div>

        <div>
          <Label>Metal</Label>
          <Input value={value.metal} onChange={() => {}} disabled={true} />
        </div>
      </div>
    </div>
  );
};

export default AccessoriesSection;
