import React from "react";
import type { CountryCode } from "../../../component/phoneInput/CountryPhoneInput";
import type { CustomerForm } from "../../../types/customer";
import { useAddCustomerForm } from "./useAddCustomerForm";
import Radio from "../../../component/ui/Radio";
import CountryPhoneInput from "../../../component/phoneInput/CountryPhoneInput";
import FormField, { FormTextarea } from "../../../component/ui/form/FormField";
import Input from "../../../component/ui/form/Input";
import {
  isValidEmail,
  isValidPhone,
  normalizePhoneForApi,
} from "../../../utils/phone";
import CorporationForm from "../../customers/create/CorporationForm";
import IndividualForm from "../../customers/create/IndividualForm";
import AddressForm from "../../customers/create/AddressForm";
import TaxInvoiceSection from "../../customers/create/TaxInvoiceSection";
import CloseIcon from "../../../assets/svg/close.svg?react";

interface AddCustomerProps {
  country: CountryCode;
  onCountryChange: (c: CountryCode) => void;
  onCancel: () => void;
  onConfirm: (values: CustomerForm) => void;
}

const AddCustomerFrontOffice: React.FC<AddCustomerProps> = ({
  country,
  onCountryChange,
  onCancel,
  onConfirm,
}) => {
  const {
    businessType,
    form,
    setForm,
    switchType,

    showTaxInvoice,
    useSameAddress,
    taxInvoiceForm,

    setTaxInvoiceForm,
    handleAddTaxInvoice,
    handleRemoveTaxInvoice,
    handleToggleSameAddress,
  } = useAddCustomerForm();

  const validateTaxInvoice = () => {
    if (!showTaxInvoice) return true;

    const { companyName, taxId, address } = taxInvoiceForm;

    if (!companyName.trim()) {
      alert("Tax Invoice: Company Name is required");
      return false;
    }

    if (!taxId.trim()) {
      alert("Tax Invoice: Tax ID is required");
      return false;
    }

    if (
      !address.address.trim() ||
      !address.province.trim() ||
      !address.district.trim() ||
      !address.subDistrict.trim()
    ) {
      alert("Tax Invoice: Address is incomplete");
      return false;
    }

    return true;
  };

  return (
    <div
      className="w-full max-w-[min(1200px,95vw)] max-h-[90vh] bg-white rounded-lg shadow-lg 
           overflow-hidden grid grid-rows-[auto_1fr_auto]"
    >
      {/* HEADER */}

      <div className="flex items-center justify-center border-b py-4 relative">
        <h2 className="text-[#084072] font-normal text-xl tracking-wide">
          ADD CUSTOMER
        </h2>

        <button onClick={onCancel} className="absolute right-6 text-gray-900">
          <CloseIcon className="w-8 h-8" />
        </button>
      </div>

      {/* BODY */}

      <div className="px-10 py-8 flex-1 bg-[#FBFBFB] overflow-y-auto hide-scrollbar">
        {/* Business Type */}

        <div className="flex items-center gap-6 mb-8">
          <span className="text-[#0B3A66] text-lg">Business Type</span>

          <div className="flex gap-8">
            <Radio
              name="businessType"
              label="Corporation"
              value="Corporation"
              checked={businessType === "Corporation"}
              onChange={switchType}
            />

            <Radio
              name="businessType"
              label="Individual"
              value="Individual"
              checked={businessType === "Individual"}
              onChange={switchType}
            />
          </div>
        </div>

        {/* GRID */}

        <div className="grid grid-cols-[1fr,1.2fr] gap-x-[100px]">
          {/* LEFT COLUMN */}

          <div>
            <h3 className="text-[#0B3A66] mb-4 text-lg">Information</h3>

            <div className="space-y-4">
              <FormField label="Customer ID">
                <Input
                  disabled
                  className="text-sm"
                  placeholder="Auto-generated ID"
                />
              </FormField>

              {form.businessType === "Corporation" && (
                <CorporationForm value={form} onChange={setForm} />
              )}

              {form.businessType === "Individual" && (
                <IndividualForm value={form} onChange={setForm} />
              )}

              <FormField label="Phone" required>
                <CountryPhoneInput
                  value={form.phone}
                  country={country}
                  onCountryChange={onCountryChange}
                  onChange={(phone) => setForm({ ...form, phone })}
                />
              </FormField>

              <FormField label="Email">
                <Input
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </FormField>

              <FormField label="Note">
                <FormTextarea
                  value={form.note}
                  onChange={(e) => setForm({ ...form, note: e.target.value })}
                />
              </FormField>
            </div>
          </div>

          {/* RIGHT COLUMN */}

          <div>
            <h3 className="text-[#0B3A66] mb-4 text-lg">Address</h3>

            <AddressForm
              key={form.businessType}
              value={form.address}
              onChange={(address) => setForm({ ...form, address })}
            />

            <div className="my-6 border-t" />

            <TaxInvoiceSection
              show={showTaxInvoice}
              useSameAddress={useSameAddress}
              data={taxInvoiceForm}
              onAdd={handleAddTaxInvoice}
              onRemove={handleRemoveTaxInvoice}
              onToggleSameAddress={handleToggleSameAddress}
              onChangeData={(field, value) =>
                setTaxInvoiceForm((prev) => ({ ...prev, [field]: value }))
              }
              onChangeAddress={(address) => {
                if (useSameAddress) handleToggleSameAddress(false);

                setTaxInvoiceForm((prev) => ({
                  ...prev,
                  address,
                }));
              }}
            />
          </div>
        </div>
      </div>

      {/* FOOTER */}

      <div className="border-t py-4 flex justify-center gap-4">
        <button
          onClick={onCancel}
          className="w-24 px-4 py-[6px] bg-white border border-[#CFCFCF] text-base hover:bg-[#F1F1F1] text-black rounded-md"
        >
          Cancel
        </button>

        <button
          onClick={() => {
            if (!isValidPhone(form.phone)) {
              alert("Invalid phone number");
              return;
            }

            if (form.email && !isValidEmail(form.email)) {
              alert("Invalid email format");
              return;
            }

            if (!validateTaxInvoice()) return;

            onConfirm({
              ...form,

              phone: normalizePhoneForApi(form.phone, country),

              taxInvoice: showTaxInvoice
                ? {
                    companyName: taxInvoiceForm.companyName,
                    taxId: taxInvoiceForm.taxId,
                    address: useSameAddress
                      ? form.address
                      : taxInvoiceForm.address,
                    useSameAddress,
                  }
                : null,
            });
          }}
          className="w-24 h-[38px] px-4 py-[6px] rounded-md text-base font-normal bg-[#005AA7] hover:bg-[#084072] text-white cursor-pointerห"
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default AddCustomerFrontOffice;
