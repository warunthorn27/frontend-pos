import React from "react";
import DeleteIcon from "../../../assets/svg/trash.svg?react";
import PlusIcon from "../../../assets/svg/plus.svg?react";
import AddressForm from "./AddressForm";
import type { Address } from "../../../types/customer";
import type { SelectOption } from "./AddressForm";

interface TaxInvoiceProps {
  show: boolean;
  useSameAddress: boolean;
  data: {
    companyName: string;
    taxId: string;
    address: Address;
  };
  onAdd: () => void;
  onRemove: () => void;
  onToggleSameAddress: (checked: boolean) => void;
  onChangeData: (field: string, value: string) => void;
  onChangeAddress: (field: string, value: string) => void;

  countryOptions?: SelectOption[];
  provinceOptions?: SelectOption[];
  districtOptions?: SelectOption[];
  subDistrictOptions?: SelectOption[];
}

const TaxInvoiceSection: React.FC<TaxInvoiceProps> = ({
  show,
  useSameAddress,
  data,
  onAdd,
  onRemove,
  onToggleSameAddress,
  onChangeData,
  onChangeAddress,
  countryOptions,
  provinceOptions,
  districtOptions,
  subDistrictOptions,
}) => {
  if (!show) {
    return (
      <button
        type="button"
        onClick={onAdd}
        className="mt-3 text-xs text-[#2F80ED] flex items-center gap-1 hover:underline"
      >
        <span className="text-lg"><PlusIcon className="w-3 h-3 fill-current" /></span> Tax Invoice Address
      </button>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <h2 className="text-lg font-normal text-[#084072]">
            Tax Invoice Address
          </h2>
          <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer select-none ">
            <input
              type="checkbox"
              className="w-4 h-4 rounded border-gray-300 text-[#084072] focus:ring-[#084072]"
              checked={useSameAddress}
              onChange={(e) => onToggleSameAddress(e.target.checked)}
            />
            Use the same address
          </label>
        </div>
        <button
  type="button"
  onClick={onRemove}
  className="text-red-500 hover:text-red-600"
>
  <DeleteIcon/>
</button>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-base mb-1">
            Company Name <span className="text-red-500">*</span>
          </label>
          <input
            className="w-full h-[38px] rounded-md border border-[#E0E0E0] px-3 text-base input"
            value={data.companyName}
            onChange={(e) => onChangeData("companyName", e.target.value)}
          />
        </div>

        <div>
          <label className="block text-base mb-1">
            Tax ID <span className="text-red-500">*</span>
          </label>
          <input
            className="w-full h-[38px] rounded-md border border-[#E0E0E0] px-3 text-base input"
            value={data.taxId}
            onChange={(e) => onChangeData("taxId", e.target.value)}
          />
        </div>

        <div>
          <AddressForm
            value={data.address}
            onChange={onChangeAddress}
            countryOptions={countryOptions}
            provinceOptions={provinceOptions}
            districtOptions={districtOptions}
            subDistrictOptions={subDistrictOptions}
          />
        </div>
      </div>
    </div>
  );
};

export default TaxInvoiceSection;