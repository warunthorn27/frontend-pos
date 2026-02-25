import React from "react";
import type { Address } from "../../../types/customer";
import AddressFields from "../../../component/address/AddressFields";

interface Props {
  value: Address;
  disabled?: boolean;
  onChange: (newAddress: Address) => void;
}

const AddressForm: React.FC<Props> = ({ value, disabled, onChange }) => {
  return (
    <AddressFields
      value={value}
      onChange={onChange}
      disabled={disabled}
    />
  );
};
export default AddressForm;
