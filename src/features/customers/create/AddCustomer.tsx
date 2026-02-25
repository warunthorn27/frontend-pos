import React, { useState } from "react";
import type {
  BusinessType,
  CorporationCustomerForm,
  CustomerForm,
  IndividualCustomerForm,
} from "../../../types/customer";
import AddressForm from "./AddressForm";
import TaxInvoiceSection from "./TaxInvoiceSection";
import Radio from "../../../component/ui/Radio";
import CorporationForm from "./CorporationForm";
import IndividualForm from "./IndividualForm";
import {
  isValidEmail,
  isValidPhone,
  normalizePhoneForApi,
} from "../../../utils/phone";
import FormField, { FormTextarea } from "../../../component/ui/form/FormField";
import Input from "../../../component/ui/form/Input";
import CountryPhoneInput, {
  type CountryCode,
} from "../../../component/phoneInput/CountryPhoneInput";

interface AddCustomerProps {
  country: CountryCode;
  onCountryChange: (c: CountryCode) => void;
  onCancel: () => void;
  onConfirm: (values: CustomerForm) => void;
}

const emptyAddress = {
  address: "",
  country: "Thailand",
  province: "",
  district: "",
  subDistrict: "",
  zipcode: "",
};

const createCorporation = (): CorporationCustomerForm => ({
  businessType: "Corporation",
  phone: "",
  email: "",
  note: "",
  companyName: "",
  contactPerson: "",
  address: { ...emptyAddress },
});

const createIndividual = (): IndividualCustomerForm => ({
  businessType: "Individual",
  phone: "",
  email: "",
  note: "",
  firstName: "",
  lastName: "",
  gender: "",
  birthday: "",
  address: { ...emptyAddress },
});

const AddCustomer: React.FC<AddCustomerProps> = ({
  country,
  onCountryChange,
  onCancel,
  onConfirm,
}) => {
  const [businessType, setBusinessType] = useState<BusinessType>("Corporation");
  const [form, setForm] = useState<CustomerForm>(createCorporation());
  const [showTaxInvoice, setShowTaxInvoice] = useState(false);
  const [useSameAddress, setUseSameAddress] = useState(false);
  const [taxInvoiceForm, setTaxInvoiceForm] = useState({
    companyName: "",
    taxId: "",
    address: { ...emptyAddress },
  });

  const switchType = (type: BusinessType) => {
    setBusinessType(type);

    setForm(type === "Corporation" ? createCorporation() : createIndividual());

    // reset tax invoice state
    setShowTaxInvoice(false);
    setUseSameAddress(false);

    setTaxInvoiceForm({
      companyName: "",
      taxId: "",
      address: { ...emptyAddress },
    });
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

        // copy address
        address: { ...form.address },

        // copy company name เฉพาะ corporation
        companyName:
          form.businessType === "Corporation"
            ? form.companyName
            : prev.companyName,
      }));
    } else {
      setTaxInvoiceForm((prev) => ({
        ...prev,
        address: { ...emptyAddress },
      }));
    }
  };

  const validateTaxInvoice = (): boolean => {
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

              {/* ===== 2 Columns ===== */}
              <div className="max-w-5xl  grid grid-cols-[1fr,1.2fr] gap-x-[100px]">
                {/* ================= LEFT : INFORMATION ================= */}
                <div>
                  <h2 className="text-lg font-normal text-[#06284B] mb-4">
                    Information
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <FormField label="Customer ID">
                        <Input
                          disabled
                          className="bg-[#F5F5F5] text-sm"
                          placeholder="Auto-generated ID "
                        />
                      </FormField>
                    </div>
                    {/* Corporation / Individual Form */}
                    {form.businessType === "Corporation" && (
                      <CorporationForm value={form} onChange={setForm} />
                    )}

                    {form.businessType === "Individual" && (
                      <IndividualForm value={form} onChange={setForm} />
                    )}

                    {/* Phone */}
                    <div>
                      <FormField label="Phone" required>
                        <CountryPhoneInput
                          value={form.phone}
                          country={country}
                          onCountryChange={onCountryChange}
                          onChange={(phoneE164) =>
                            setForm({
                              ...form,
                              phone: phoneE164,
                            })
                          }
                        />
                      </FormField>
                    </div>
                    {/* Email */}
                    <div>
                      <FormField label="Email">
                        <Input
                          value={form.email}
                          onChange={(e) =>
                            setForm({ ...form, email: e.target.value })
                          }
                        />
                      </FormField>
                    </div>
                    {/* Note */}
                    <div>
                      <FormField label="Note">
                        <FormTextarea
                          value={form.note}
                          onChange={(e) =>
                            setForm({ ...form, note: e.target.value })
                          }
                        />
                      </FormField>
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
                    key={form.businessType}
                    value={form.address}
                    onChange={(newAddress) =>
                      setForm({ ...form, address: newAddress })
                    }
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
                      setTaxInvoiceForm((prev) => ({ ...prev, [field]: value }))
                    }
                    onChangeAddress={(newAddress) => {
                      if (useSameAddress) setUseSameAddress(false);

                      setTaxInvoiceForm((prev) => ({
                        ...prev,
                        address: newAddress,
                      }));
                    }}
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
