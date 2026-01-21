import React, { useState } from "react";
import type {
  BusinessType,
  CustomerFormInput,
  CorporationCustomer,
  IndividualCustomer,
} from "../../../types/customer";
import CorporationForm from "./CorporationForm";
import IndividualForm from "./IndividualForm";
import AddressForm from "./AddressForm";
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
  address: emptyAddress,
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
  address: emptyAddress,
});
const AddCustomer: React.FC<AddCustomerProps> = ({ onCancel, onConfirm }) => {
  const [businessType, setBusinessType] = useState<BusinessType>("individual");
  const [form, setForm] = useState<CustomerFormInput>(createIndividual());
  const switchType = (type: BusinessType) => {
    setBusinessType(type);
    setForm(type === "corporation" ? createCorporation() : createIndividual());
  };
  return (
    <div className="w-full">
      {/* Title */}
      <h1 className="text-2xl font-normal text-[#084072] mb-6">
        Add Customer
      </h1>
      {/* Card */}
      <div className="bg-[#FAFAFA] rounded-lg shadow-sm p-8">
        {/* Business Type */}
        <div className="flex items-center gap-6 mb-8">
          <span className="text-lg font-normal text-[#084072]">
            Business Type
          </span>
          <label className="flex items-center gap-2 text-lg">
            <input
              type="radio"
              checked={businessType === "corporation"}
              onChange={() => switchType("corporation")}
            />
            Corporation
          </label>
          <label className="flex items-center gap-2 text-lg">
            <input
              type="radio"
              checked={businessType === "individual"}
              onChange={() => switchType("individual")}
            />
            Individual
          </label>
        </div>
        {/* ===== 2 Columns ===== */}
        <div className="grid grid-cols-2 gap-16">
          {/* ================= LEFT : INFORMATION ================= */}
          <div>
            <h2 className="text-lg font-normal text-[#084072] mb-4">
              Information
            </h2>
            <div className="space-y-4">
              {/* Customer ID */}
              <div>
                <label className="block text-base mb-1">Customer ID</label>
                <input
                  disabled
                  className="w-full h-9 rounded-md border border-[#E0E0E0] bg-[#F5F5F5] px-3 text-sm"
                  value={form.customerId}
                />
              </div>
              {/* Corporation / Individual */}
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
                <label className="block text- mb-1">
                  Phone <span className="text-red-500">*</span>
                </label>
                <input
                  className="w-full h-9 rounded-md border border-[#E0E0E0] px-3 text-base"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                />
              </div>
              {/* Email */}
              <div>
                <label className="block text-base mb-1">Email</label>
                <input
                  className="w-full h-9 rounded-md border border-[#E0E0E0] px-3 text-base"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>
              {/* Note */}
              <div>
                <label className="block text-base mb-1">Note</label>{" "}
                <textarea
                  className="w-full h-24 rounded-md border border-[#E0E0E0] px-3 py-2 text-base resize-none"
                  value={form.note}
                  onChange={(e) => setForm({ ...form, note: e.target.value })}
                />
              </div>
            </div>
          </div>
          {/* ================= RIGHT : ADDRESS ================= */}
          <div>
            <h2 className="text-lg font-normal text-[#084072] mb-4">Address</h2>
            <AddressForm
              value={form.address}
              onChange={(field, value) =>
                setForm({
                  ...form,
                  address: { ...form.address, [field]: value },
                })
              }
            />
            {/* Tax Invoice */}
            <button
              type="button"
              className="mt-3 text-xs text-[#2F80ED] flex items-center gap-1"
            >
              <span className="text-lg">+</span> Tax Invoice Address{" "}
            </button>
          </div>
        </div>
      </div>
      {/* Footer */}
      <div className="flex justify-center gap-4 mt-10">
        <button
          onClick={onCancel}
          className="px-6 py-2 rounded-md bg-[#FF4D4F] text-white text-lg"
        >
          Cancel
        </button>
        <button
          onClick={() => onConfirm(form)}
          className="px-6 py-2 rounded-md bg-[#C9C9C9] text-white text-lg"
        >
          Save
        </button>
      </div>
    </div>
  );
};
export default AddCustomer;
