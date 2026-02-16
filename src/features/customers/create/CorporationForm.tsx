import React from "react";
import type { CorporationCustomer } from "../../../types/customer";
import {
  FormLabel,
  FormTextInput,
} from "../../../component/ui/form/FormControls";

interface Props {
  value: CorporationCustomer;
  onChange: (value: CorporationCustomer) => void;
}

const CorporationForm: React.FC<Props> = ({ value, onChange }) => {
  const update = (field: keyof CorporationCustomer, val: string) =>
    onChange({ ...value, [field]: val });

  return (
    <div className="space-y-4">
      <FormLabel required>Company Name</FormLabel>
      <FormTextInput
        value={value.companyName}
        onChange={(e) => update("companyName", e.target.value)}
      />

      <FormLabel required>Contact Person</FormLabel>
      <FormTextInput
        value={value.contactPerson}
        onChange={(e) => update("contactPerson", e.target.value)}
      />
    </div>
  );
};

export default CorporationForm;
