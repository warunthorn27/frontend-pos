import React from "react";
import type { Address } from "../../../types/customer";
import {
  FormLabel,
  FormTextInput,
} from "../../../component/ui/form/FormControls";

interface Props {
  show: boolean;
  useSameAddress: boolean;
  data: { companyName: string; taxId: string; address: Address };
  onAdd: () => void;
  onRemove: () => void;
  onToggleSameAddress: (checked: boolean) => void;
  onChangeData: (field: string, value: string) => void;
  onChangeAddress: (field: string, value: string) => void;
}

const TaxInvoiceSection: React.FC<Props> = ({ show, data, onChangeData }) => {
  if (!show) return null;

  return (
    <div className="space-y-4">
      <FormLabel required>Company Name</FormLabel>
      <FormTextInput
        value={data.companyName}
        onChange={(e) => onChangeData("companyName", e.target.value)}
      />

      <FormLabel required>Tax ID</FormLabel>
      <FormTextInput
        value={data.taxId}
        onChange={(e) => onChangeData("taxId", e.target.value)}
      />
    </div>
  );
};

export default TaxInvoiceSection;
