import React from "react";
import { useThaiAddress } from "./hooks/useThaiAddress";
import Dropdown from "./Dropdown";

export interface BaseAddress {
  address: string;
  country: string;
  province: string;
  district: string;
  subDistrict: string;
  zipcode: string;
}

interface Props {
  value: BaseAddress;
  onChange: (newAddress: BaseAddress) => void;
  className?: string;
  disabled?: boolean;
}

/* ========================= */
/* Component หลัก */
/* ========================= */

const AddressFields: React.FC<Props> = ({
  value,
  onChange,
  className,
  disabled = false,
}) => {
  const addr = useThaiAddress();

  const inputStyle =
    "w-full h-[38px] rounded-md border border-[#CFCFCF] px-3 text-sm focus:outline-none focus:border-[#005AA7]";
  const labelStyle = "block text-base mb-2";
  const disabledStyle = "bg-[#F1F1F1] border-[#E6E6E6] text-black";

  const handleChange = (field: keyof BaseAddress, val: string) => {
    const updated = { ...value, [field]: val };

    if (field === "province") {
      addr.setProvince(val);
      updated.district = "";
      updated.subDistrict = "";
      updated.zipcode = "";
    }

    if (field === "district") {
      addr.setDistrict(val);
      updated.subDistrict = "";
      updated.zipcode = "";
    }

    if (field === "subDistrict") {
      const selected = addr.subDistricts.find((s) => s.sub_district === val);

      if (selected) {
        updated.subDistrict = val;
        updated.zipcode = selected.zipcode;
      }
    }

    onChange(updated);
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Address */}
      <div>
        <label className={labelStyle}>
          Address <span className="text-red-500">*</span>
        </label>
        <input
          readOnly={disabled}
          value={value.address}
          onChange={(e) => handleChange("address", e.target.value)}
          className={`${inputStyle} ${disabled ? disabledStyle : ""} ${
            disabled ? "cursor-default" : ""
          }`}
        />
      </div>

      {/* Country / Province */}
      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className={labelStyle}>
            Country <span className="text-red-500">*</span>
          </label>
          <Dropdown
            value={value.country}
            disabled={disabled}
            options={["Thailand"]}
            placeholder="Select Country"
            onChange={(val) => handleChange("country", val)}
          />
        </div>

        <div>
          <label className={labelStyle}>
            Province <span className="text-red-500">*</span>
          </label>
          <Dropdown
            value={value.province}
            disabled={disabled}
            options={addr.provinces}
            placeholder="Select Province"
            onChange={(val) => handleChange("province", val)}
          />
        </div>
      </div>

      {/* District / Sub-district */}
      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className={labelStyle}>
            District <span className="text-red-500">*</span>
          </label>
          <Dropdown
            value={value.district}
            disabled={disabled}
            options={addr.districts}
            placeholder="Select District"
            onChange={(val) => handleChange("district", val)}
          />
        </div>

        <div>
          <label className={labelStyle}>
            Sub-district <span className="text-red-500">*</span>
          </label>
          <Dropdown
            value={value.subDistrict}
            disabled={disabled}
            options={addr.subDistricts.map((s) => s.sub_district)}
            placeholder="Select Sub-district"
            onChange={(val) => handleChange("subDistrict", val)}
          />
        </div>
      </div>

      {/* Zipcode */}
      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className={labelStyle}>
            Zipcode <span className="text-red-500">*</span>
          </label>
          <input
            disabled
            className={`${inputStyle} ${disabledStyle}`}
            value={value.zipcode}
          />
        </div>
      </div>
    </div>
  );
};

export default AddressFields;
