import React from "react";
import type { CorporationCustomer } from "../../../types/customer";

interface Props {
  value: CorporationCustomer;
  onChange: (value: CorporationCustomer) => void;
}

const CorporationForm: React.FC<Props> = ({ value, onChange }) => {
  const update = <K extends keyof CorporationCustomer>(
    field: K,
    newValue: CorporationCustomer[K]
  ) => {
    onChange({
      ...value,
      [field]: newValue,
    });
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-base mb-1">
          Company Name <span className="text-red-500">*</span>
        </label>
        <input
          className="input"
          value={value.companyName}
          onChange={(e) => update("companyName", e.target.value)}
        />
      </div>

      <div>
        <label className="block text-base mb-1">
          Contact Person <span className="text-red-500">*</span>
        </label>
        <input
          className="input"
          value={value.contactPerson}
          onChange={(e) => update("contactPerson", e.target.value)}
        />
      </div>
    </div>
  );
};

export default CorporationForm;
