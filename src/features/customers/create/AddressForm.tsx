import React from "react";
import type { Address } from "../../../types/customer";
import DropdownArrowIcon from "../../../assets/svg/dropdown-arrow2.svg?react";
import {
  FormLabel,
  FormTextInput,
  INPUT_CLASS,
} from "../../../component/ui/form/FormControls";

export interface SelectOption {
  label: string;
  value: string;
}

interface Props {
  value: Address;
  onChange: (field: keyof Address, value: string) => void;
  countryOptions?: SelectOption[];
  provinceOptions?: SelectOption[];
  districtOptions?: SelectOption[];
  subDistrictOptions?: SelectOption[];
}

/* ================= SELECT ================= */

const FormSelect = ({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
}) => {
  const isPlaceholder = value === "";

  return (
    <div className="relative">
      <select
        className={`${INPUT_CLASS} appearance-none ${
          isPlaceholder ? "text-gray-400" : "text-black"
        }`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="" disabled>
          Select
        </option>

        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3">
        <DropdownArrowIcon className="w-3 h-3 text-gray-500" />
      </div>
    </div>
  );
};

/* ================= MAIN ================= */

const AddressForm: React.FC<Props> = ({
  value,
  onChange,
  countryOptions = [],
  provinceOptions = [],
  districtOptions = [],
  subDistrictOptions = [],
}) => {
  const renderSelect = (
    label: string,
    field: keyof Address,
    options: SelectOption[],
  ) => (
    <div>
      <FormLabel required>{label}</FormLabel>
      <FormSelect
        value={value[field]}
        options={options}
        onChange={(val) => onChange(field, val)}
      />
    </div>
  );

  return (
    <div className="space-y-4">
      <div>
        <FormLabel required>Address</FormLabel>
        <FormTextInput
          value={value.address}
          onChange={(e) => onChange("address", e.target.value)}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        {renderSelect("Country", "country", countryOptions)}
        {renderSelect("Province", "province", provinceOptions)}
      </div>

      <div className="grid grid-cols-2 gap-4">
        {renderSelect("District", "district", districtOptions)}
        {renderSelect("Sub-district", "subDistrict", subDistrictOptions)}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <FormLabel required>Zipcode</FormLabel>
          <FormTextInput
            value={value.zipcode}
            onChange={(e) => onChange("zipcode", e.target.value)}
          />
        </div>
        <div />
      </div>
    </div>
  );
};

export default AddressForm;
