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
  const update = <K extends keyof CorporationCustomer>(
    field: K,
    newValue: CorporationCustomer[K],
  ) => onChange({ ...value, [field]: newValue });

  return (
    <div className="space-y-4">
      <div>
        <FormLabel required>Company Name</FormLabel>
        <FormTextInput
          value={value.companyName}
          onChange={(e) => update("companyName", e.target.value)}
        />
      </div>

      <div>
        <FormLabel required>Contact Person</FormLabel>
        <FormTextInput
          value={value.contactPerson}
          onChange={(e) => update("contactPerson", e.target.value)}
        />
      </div>
    </div>
  );
};

export default CorporationForm;
