import React from "react";
import type { CorporationCustomerForm } from "../../../types/customer";
import Input from "../../../component/ui/form/Input";
import FormField from "../../../component/ui/form/FormField";

interface Props {
  value: CorporationCustomerForm;
  onChange: (value: CorporationCustomerForm) => void;
}

const CorporationForm: React.FC<Props> = ({ value, onChange }) => {
  const update = <K extends keyof CorporationCustomerForm>(
    field: K,
    newValue: CorporationCustomerForm[K],
  ) => onChange({ ...value, [field]: newValue });

  return (
    <div className="space-y-4">
      <div>
        <FormField label="Company Name" required>
          <Input
            value={value.companyName}
            onChange={(e) => update("companyName", e.target.value)}
          />
        </FormField>
      </div>

      <div>
        <FormField label="Contact Person" required>
          <Input
            value={value.contactPerson}
            onChange={(e) => update("contactPerson", e.target.value)}
          />
        </FormField>
      </div>
    </div>
  );
};

export default CorporationForm;
