import React, { useState } from "react";
import type {
  BusinessType,
  CustomerFormInput,
  CorporationCustomer,
  IndividualCustomer,
} from "../../../types/customer";
import CorporationForm from "./CorporationForm";
import IndividualForm from "./IndividualForm";
import AddressForm, { type SelectOption } from "./AddressForm";
import TaxInvoiceSection from "./TaxInvoiceSection";
import Radio from "../../../component/ui/Radio";
import {
  FormLabel,
  FormTextInput,
  FormTextarea,
  DISABLED_INPUT_CLASS,
} from "../../../component/ui/form/FormControls";

interface AddCustomerProps {
  onCancel: () => void;
  onConfirm: (values: CustomerFormInput) => void;
}

const emptyAddress = {
  address: "",
  country: "",
  province: "",
  district: "",
  subDistrict: "",
  zipcode: "",
};

const createCorporation = (): CorporationCustomer => ({
  businessType: "corporation",
  customerId: "CUS-0001",
  phone: "",
  email: "",
  note: "",
  companyName: "",
  contactPerson: "",
  address: { ...emptyAddress },
});

const createIndividual = (): IndividualCustomer => ({
  businessType: "individual",
  customerId: "CUS-0001",
  phone: "",
  email: "",
  note: "",
  firstName: "",
  lastName: "",
  gender: "",
  birthday: "",
  address: { ...emptyAddress },
});

const AddCustomer: React.FC<AddCustomerProps> = ({ onCancel, onConfirm }) => {
  const [businessType, setBusinessType] = useState<BusinessType>("corporation");
  const [form, setForm] = useState<CustomerFormInput>(createIndividual());

  const [showTaxInvoice, setShowTaxInvoice] = useState(false);
  const [useSameAddress, setUseSameAddress] = useState(false);
  const [taxInvoiceForm, setTaxInvoiceForm] = useState({
    companyName: "",
    taxId: "",
    address: { ...emptyAddress },
  });

  const switchType = (type: BusinessType) => {
    setBusinessType(type);
    setForm(type === "corporation" ? createCorporation() : createIndividual());
  };

  const handleAddTaxInvoice = () => {
    setShowTaxInvoice(true);
    setUseSameAddress(false);
    setTaxInvoiceForm({
      companyName: "",
      taxId: "",
      address: { ...emptyAddress },
    });
  };

  const handleRemoveTaxInvoice = () => {
    setShowTaxInvoice(false);
    setUseSameAddress(false);
  };

  const handleToggleSameAddress = (checked: boolean) => {
    setUseSameAddress(checked);

    if (checked) {
      setTaxInvoiceForm((prev) => ({
        ...prev,
        address: { ...form.address },
      }));
    }
  };

  const mockOptions: SelectOption[] = [
    { label: "Option A", value: "A" },
    { label: "Option B", value: "B" },
  ];

  return (
    <div className="w-full h-full flex flex-col">
      <h1 className="text-2xl font-normal text-[#084072] mb-6">Add Customer</h1>

      <div className="flex-1 rounded-md bg-[#FAFAFA] shadow-md flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto px-10 py-8">
          <div className="flex items-center gap-6 mb-8">
            <span className="text-lg text-[#084072]">Business Type</span>

            <div className="flex gap-10">
              <Radio
                name="businessType"
                label="Corporation"
                value="corporation"
                checked={businessType === "corporation"}
                onChange={switchType}
              />
              <Radio
                name="businessType"
                label="Individual"
                value="individual"
                checked={businessType === "individual"}
                onChange={switchType}
              />
            </div>
          </div>

          <div className="max-w-5xl grid grid-cols-[1fr,1.2fr] gap-x-[100px]">
            {/* LEFT */}
            <div>
              <h2 className="text-lg text-[#084072] mb-4">Information</h2>

              <FormLabel>Customer ID</FormLabel>
              <FormTextInput
                disabled
                className={DISABLED_INPUT_CLASS}
                value={form.customerId}
              />

              {businessType === "corporation" && (
                <CorporationForm
                  value={form as CorporationCustomer}
                  onChange={setForm}
                />
              )}

              {businessType === "individual" && (
                <IndividualForm
                  value={form as IndividualCustomer}
                  onChange={setForm}
                />
              )}

              <FormLabel required>Phone</FormLabel>
              <FormTextInput
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />

              <FormLabel>Email</FormLabel>
              <FormTextInput
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />

              <FormLabel>Note</FormLabel>
              <FormTextarea
                value={form.note}
                onChange={(e) => setForm({ ...form, note: e.target.value })}
              />
            </div>

            {/* RIGHT */}
            <div>
              <h2 className="text-lg text-[#084072] mb-4">Address</h2>

              <AddressForm
                value={form.address}
                onChange={(field, value) => {
                  const newAddress = { ...form.address, [field]: value };
                  setForm({ ...form, address: newAddress });
                }}
                countryOptions={mockOptions}
                provinceOptions={mockOptions}
                districtOptions={mockOptions}
                subDistrictOptions={mockOptions}
              />

              <TaxInvoiceSection
                show={showTaxInvoice}
                useSameAddress={useSameAddress}
                data={taxInvoiceForm}
                onAdd={handleAddTaxInvoice}
                onRemove={handleRemoveTaxInvoice}
                onToggleSameAddress={handleToggleSameAddress}
                onChangeData={(field, value) =>
                  setTaxInvoiceForm({ ...taxInvoiceForm, [field]: value })
                }
                onChangeAddress={(field, value) =>
                  setTaxInvoiceForm((prev) => ({
                    ...prev,
                    address: { ...prev.address, [field]: value },
                  }))
                }
              />
            </div>
          </div>
        </div>

        <div className="py-4 flex justify-center gap-4 bg-[#FAFAFA]">
          <button onClick={onCancel}>Cancel</button>
          <button onClick={() => onConfirm(form)}>Save</button>
        </div>
      </div>
    </div>
  );
};

export default AddCustomer;
