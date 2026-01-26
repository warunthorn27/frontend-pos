import React from "react";
import type { IndividualCustomer } from "../../../types/customer";
import DropdownArrowIcon from "../../../assets/svg/dropdown-arrow2.svg?react";

interface Props {
  value: IndividualCustomer;
  onChange: (value: IndividualCustomer) => void;
}

const IndividualForm: React.FC<Props> = ({ value, onChange }) => {
  const update = <K extends keyof IndividualCustomer>(
    field: K,
    newValue: IndividualCustomer[K]
  ) => {
    onChange({
      ...value,
      [field]: newValue,
    });
  };

  return (
    <div className="space-y-4">
      {/* First Name / Last Name */}
      <div className="grid grid-cols-2 gap-4 ">
        <div>
          <label className="block text-base mb-1">
            First Name <span className="text-red-500">*</span>
          </label>
          <input
            className="input"
            value={value.firstName}
            onChange={(e) => update("firstName", e.target.value)}
          />
        </div>

        <div>
          <label className="block text-base mb-1">
            Last Name <span className="text-red-500">*</span>
          </label>
          <input
            className="input"
            value={value.lastName}
            onChange={(e) => update("lastName", e.target.value)}
          />
        </div>
      </div>

      {/* Gender / Birthday */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-base mb-1">
            Gender <span className="text-red-500">*</span>
          </label>
          <div className="relative">
          <select
            className="input appearance-none pr-10"
            value={value.gender}
            onChange={(e) => update("gender", e.target.value)}
          >
                      
            <option value="">Select</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
           <DropdownArrowIcon
        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 text-[#6B7280]"
      />
      </div>
        </div>

        <div>
          <label className="block text-base mb-1">Birthday</label>
          <input
            type="date"
            className="input"
            value={value.birthday}
            onChange={(e) => update("birthday", e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};

export default IndividualForm;
