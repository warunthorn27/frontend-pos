import React from "react";
import type { Address } from "../../../types/customer";

interface Props {
  value: Address;
  onChange: (field: keyof Address, value: string) => void;
}

const AddressForm: React.FC<Props> = ({ value, onChange }) => {
  return (
    <div className="space-y-4">
      {/* Address */}
      <div>
        <label className="block text-base mb-1">
          Address <span className="text-red-500">*</span>
        </label>
        <input
          className="input"
          value={value.address}
          onChange={(e) => onChange("address", e.target.value)}
        />
      </div>

      {/* Country / Province */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-base mb-1">
            Country <span className="text-red-500">*</span>
          </label>
          <input
            className="input"
            value={value.country}
            onChange={(e) => onChange("country", e.target.value)}
          />
        </div>

        <div>
          <label className="block text-base mb-1">
            Province <span className="text-red-500">*</span>
          </label>
          <input
            className="input"
            value={value.province}
            onChange={(e) => onChange("province", e.target.value)}
          />
        </div>
      </div>

      {/* District / Sub-district */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-base mb-1">
            District <span className="text-red-500">*</span>
          </label>
          <input
            className="input"
            value={value.district}
            onChange={(e) => onChange("district", e.target.value)}
          />
        </div>

        <div>
          <label className="block text-base mb-1">
            Sub-district <span className="text-red-500">*</span>
          </label>
          <input
            className="input"
            value={value.subDistrict}
            onChange={(e) => onChange("subDistrict", e.target.value)}
          />
        </div>
      </div>

      {/* Zipcode */}
      <div>
        <label className="block text-base mb-1">
          Zipcode <span className="text-red-500">*</span>
        </label>
        <input
          className="input"
          value={value.zipcode}
          onChange={(e) => onChange("zipcode", e.target.value)}
        />
      </div>
    </div>
  );
};

export default AddressForm;
