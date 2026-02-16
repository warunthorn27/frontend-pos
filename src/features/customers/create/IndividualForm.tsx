import React from "react";
import type { IndividualCustomer } from "../../../types/customer";
import CustomDatePicker from "../../../component/ui/datepicker";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import FormInput from "../../../component/input/FormInput";
import FormSelect from "../../../component/input/FormSelect";

interface Props {
  value: IndividualCustomer;
  onChange: (value: IndividualCustomer) => void;
}

const IndividualForm: React.FC<Props> = ({ value, onChange }) => {
  const update = <K extends keyof IndividualCustomer>(
    field: K,
    newValue: IndividualCustomer[K],
  ) => onChange({ ...value, [field]: newValue });

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <FormInput
            label="First Name"
            required
            value={value.firstName}
            onChange={(v) => update("firstName", v)}
          />

          <FormInput
            label="Last Name"
            required
            value={value.lastName}
            onChange={(v) => update("lastName", v)}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormSelect
            label="Gender"
            required
            value={value.gender}
            options={[
              { label: "Male", value: "male" },
              { label: "Female", value: "female" },
            ]}
            onChange={(v) => update("gender", v)}
          />

          <CustomDatePicker
            label="Birthday"
            value={value.birthday}
            onChange={(v) => update("birthday", v)}
          />
        </div>
      </div>
    </LocalizationProvider>
  );
};

export default IndividualForm;
