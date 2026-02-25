import React from "react";
import DeleteIcon from "../../../assets/svg/trash.svg?react";
import PlusIcon from "../../../assets/svg/plus.svg?react";
import AddressForm from "./AddressForm";
import type { Address } from "../../../types/customer";
import Checkbox from "../../../component/ui/Checkbox";
import FormField from "../../../component/ui/form/FormField";
import Input from "../../../component/ui/form/Input";

interface TaxInvoiceProps {
  show: boolean;
  useSameAddress: boolean;
  data: {
    companyName: string;
    taxId: string;
    address: Address;
  };
  isView?: boolean;
  onAdd: () => void;
  onRemove: () => void;
  onToggleSameAddress: (checked: boolean) => void;
  onChangeData: (field: string, value: string) => void;
  onChangeAddress: (newAddress: Address) => void;
}

const TaxInvoiceSection: React.FC<TaxInvoiceProps> = ({
  show,
  useSameAddress,
  data,
  isView = false,
  onAdd,
  onRemove,
  onToggleSameAddress,
  onChangeData,
  onChangeAddress,
}) => {
  if (!show) {
    return (
      <button
        type="button"
        onClick={onAdd}
        className="mt-3 text-sm text-[#0690F1] flex items-center gap-2 hover:underline"
      >
        <span className="text-lg">
          <PlusIcon className="w-5 h-5 text-[#0690F1]" />
        </span>{" "}
        Tax Invoice Address
      </button>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-6">
          <h2 className="text-lg font-normal text-[#084072]">
            Tax Invoice Address
          </h2>
          {!isView && (
            <div className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer select-none">
              <Checkbox
                checked={useSameAddress}
                onChange={onToggleSameAddress}
              />
              Use the same address
            </div>
          )}
        </div>
        {!isView && (
          <button
            type="button"
            onClick={onRemove}
            className="text-red-500 hover:text-red-600"
          >
            <DeleteIcon />
          </button>
        )}
      </div>

      <div className="space-y-4">
        <div>
          <FormField label="Company Name" required>
            <Input
              value={data.companyName}
              disabled={isView}
              onChange={(e) => onChangeData("companyName", e.target.value)}
            />
          </FormField>
        </div>

        <div>
          <FormField label="Tax ID" required>
            <Input
              value={data.taxId}
              disabled={isView}
              onChange={(e) => onChangeData("taxId", e.target.value)}
            />
          </FormField>
        </div>

        <div>
          <AddressForm
            value={data.address}
            disabled={isView}
            onChange={(newAddress) => onChangeAddress(newAddress)}
          />
        </div>
      </div>
    </div>
  );
};

export default TaxInvoiceSection;
