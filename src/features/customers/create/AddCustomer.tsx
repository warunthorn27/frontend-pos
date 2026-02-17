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

  const handleToggleSameAddress = (isChecked: boolean) => {
    setUseSameAddress(isChecked);
    if (isChecked) {
      setTaxInvoiceForm((prev) => ({
        ...prev,
        address: { ...form.address },
      }));
    } else {
      setTaxInvoiceForm((prev) => ({
        ...prev,
        address: { ...emptyAddress },
      }));
    }
  };

  const mockOptions: SelectOption[] = [
    { label: "Option A", value: "A" },
    { label: "Option B", value: "B" },
  ];

  return (
    <div className="w-full h-full flex flex-col">
      {/* Title */}
      <h1 className="text-2xl font-normal text-[#06284B] mb-6">Add Customer</h1>

      {/* Container Scroll */}
      <div className="flex-1 min-h-0 rounded-md bg-[#FAFAFA] shadow-md flex flex-col overflow-hidden">
        {/* Card Wrapper */}
        <div className="w-full flex flex-col flex-1 min-h-0 overflow-hidden ">
          <div className="bg-[#FAFAFA] rounded-t-md rounded-b-none shadow-md flex-1 min-h-0 flex flex-col overflow-hidden">
            {/* Scrollable Content Area */}
            <div className="flex-1 min-h-0 overflow-y-auto hide-scrollbar px-10 py-8 border-b ">
              {/* Business Type */}
              <div className="flex items-center gap-6 mb-8">
                <span className="text-lg font-normal text-[#06284B]">
                  Business Type
                </span>

                <div className="flex gap-8">
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

              {/* ===== 2 Columns ===== */}
              <div className="max-w-5xl  grid grid-cols-[1fr,1.2fr] gap-x-[100px]">
                {/* ================= LEFT : INFORMATION ================= */}
                <div>
                  <h2 className="text-lg font-normal text-[#06284B] mb-4">
                    Information
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-base mb-2">
                        Customer ID
                      </label>
                      <input
                        disabled
                        className="w-full h-[38px] rounded-md border border-[#E0E0E0] bg-[#F5F5F5] px-3 text-sm"
                        value={form.customerId}
                      />
                    </div>
                    {/* Corporation / Individual Form */}
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
                    {/* Phone */}
                    <div>
                      <label className="block text- mb-2">
                        Phone <span className="text-red-500">*</span>
                      </label>
                      <input
                        className="w-full h-9 rounded-md border border-[#E0E0E0] px-3 text-base input"
                        value={form.phone}
                        onChange={(e) =>
                          setForm({ ...form, phone: e.target.value })
                        }
                      />
                    </div>
                    {/* Email */}
                    <div>
                      <label className="block text-base mb-2">Email</label>
                      <input
                        className="w-full h-9 rounded-md border border-[#E0E0E0] px-3 text-base input"
                        value={form.email}
                        onChange={(e) =>
                          setForm({ ...form, email: e.target.value })
                        }
                      />
                    </div>
                    {/* Note */}
                    <div>
                      <label className="block text-base mb-2">Note</label>
                      <textarea
                        className="w-full h-24 rounded-md border border-[#E0E0E0] px-3 py-2 text-base focus:outline-none focus:border-[#2DA9FF] focus:ring-1 focus:ring-[#2DA9FF]/30"
                        value={form.note}
                        onChange={(e) =>
                          setForm({ ...form, note: e.target.value })
                        }
                      />
                    </div>
                  </div>
                </div>

                {/* ================= RIGHT : ADDRESS & TAX INVOICE ================= */}
                <div>
                  <h2 className="text-lg font-normal text-[#06284B] mb-4">
                    Address
                  </h2>

                  {/* AddressForm Logic Sync */}
                  <AddressForm
                    value={form.address}
                    onChange={(field, value) => {
                      const newAddress = { ...form.address, [field]: value };
                      setForm({ ...form, address: newAddress });

                      if (showTaxInvoice && useSameAddress) {
                        setTaxInvoiceForm((prev) => ({
                          ...prev,
                          address: { ...prev.address, [field]: value },
                        }));
                      }
                    }}
                    countryOptions={mockOptions}
                    provinceOptions={mockOptions}
                    districtOptions={mockOptions}
                    subDistrictOptions={mockOptions}
                  />
                  <div className="my-6 border-t border-gray-200"></div>

                  {/* Tax Invoice Section Component */}
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
                    onChangeAddress={(field, value) => {
                      if (useSameAddress) setUseSameAddress(false);
                      setTaxInvoiceForm((prev) => ({
                        ...prev,
                        address: { ...prev.address, [field]: value },
                      }));
                    }}
                    countryOptions={mockOptions}
                    provinceOptions={mockOptions}
                    districtOptions={mockOptions}
                    subDistrictOptions={mockOptions}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer (Sticky)*/}
        <div className="py-4 border-[#E6E6E6] flex justify-center gap-4 bg-[#FAFAFA]  rounded-b-lg">
          <button
            onClick={onCancel}
            className="w-24 px-4 py-[6px] rounded-md bg-white border border-[#CFCFCF] text-base hover:bg-[#F1F1F1] text-black"
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm(form)}
            className="w-24 px-4 py-[6px] rounded-md text-base font-normal bg-[#005AA7] hover:bg-[#084072] text-white"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddCustomer;
