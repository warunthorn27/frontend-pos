import React from "react";
import type { Address } from "../../../types/customer";
import DropdownArrowIcon from "../../../assets/svg/dropdown-arrow2.svg?react";

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

const AddressForm: React.FC<Props> = ({
  value,
  onChange,
  countryOptions = [],
  provinceOptions = [],
  districtOptions = [],
  subDistrictOptions = [],
}) => {
  const inputStyle =
    "w-full h-[38px] rounded-md border border-[#E0E0E0] px-3 text-base input";

  const labelStyle = "block text-sm mb-1.5 text-[#000000]";

  const renderSelect = (
    label: string,
    field: keyof Address,
    options: SelectOption[]
  ) => {
    const isPlaceholder = value[field] === "";

    return (
      <div>
        <label className={labelStyle}>
          {label} <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <select
            className={`${inputStyle} appearance-none ${
              isPlaceholder ? "text-gray-400" : "text-[#333]"
            }`}
            value={value[field]}
            onChange={(e) => onChange(field, e.target.value)}
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
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
            <DropdownArrowIcon className="w-3 h-3" />
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {/* Address */}
      <div>
        <label className={labelStyle}>
          Address <span className="text-red-500">*</span>
        </label>
        <input
          className={inputStyle}
          value={value.address}
          onChange={(e) => onChange("address", e.target.value)}
        />
      </div>

      {/* Country / Province */}
      <div className="grid grid-cols-2 gap-4">
        {renderSelect("Country", "country", countryOptions)}
        {renderSelect("Province", "province", provinceOptions)}
      </div>

      {/* District / Sub-district */}
      <div className="grid grid-cols-2 gap-4">
        {renderSelect("District", "district", districtOptions)}
        {renderSelect("Sub-district", "subDistrict", subDistrictOptions)}
      </div>

      {/* Zipcode*/}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelStyle}>
            Zipcode <span className="text-red-500">*</span>
          </label>
          <input
            className={inputStyle}
            value={value.zipcode}
            onChange={(e) => onChange("zipcode", e.target.value)}
          />
        </div>
        <div></div>
      </div>
    </div>
  );
};

export default AddressForm;