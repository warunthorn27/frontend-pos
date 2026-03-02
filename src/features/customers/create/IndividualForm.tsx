import React from "react";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import CustomDatePicker from "../../../component/ui/Datepicker";
import type { IndividualCustomerForm } from "../../../types/customer";
import GenderDropdown from "../list/GenderDropdown";
import Input from "../../../component/ui/form/Input";
import FormField from "../../../component/ui/form/FormField";

interface Props {
  value: IndividualCustomerForm;
  onChange: (value: IndividualCustomerForm) => void;
}

const IndividualForm: React.FC<Props> = ({ value, onChange }) => {
  const update = <K extends keyof IndividualCustomerForm>(
    field: K,
    newValue: IndividualCustomerForm[K],
  ) => {
    onChange({
      ...value,
      [field]: newValue,
    });
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-6">
          <FormField label="First Name" required>
            <Input
              value={value.firstName}
              onChange={(e) => update("firstName", e.target.value)}
            />
          </FormField>

          <FormField label="Last Name" required>
            <Input
              value={value.lastName}
              onChange={(e) => update("lastName", e.target.value)}
            />
          </FormField>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <FormField label="Gender" required>
            <GenderDropdown
              value={value.gender}
              options={["Male", "Female", "Others"]}
              placeholder="Select Gender"
              onChange={(val) => update("gender", val || "")}
            />
          </FormField>

          <FormField label="Birthday">
            <CustomDatePicker
              value={value.birthday}
              onChange={(val) => update("birthday", val)}
            />
          </FormField>
        </div>
      </div>
    </LocalizationProvider>
  );
};

export default IndividualForm;
