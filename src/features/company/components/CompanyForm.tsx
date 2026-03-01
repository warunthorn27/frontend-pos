import React, { useState } from "react";
import ConfirmDialog from "../../../component/dialog/ConfirmDialog";
import type { CompanyFormValues } from "../../../types/company";
import CountryPhoneInput, {
  type CountryCode,
} from "../../../component/phoneInput/CountryPhoneInput";
import CurrencySelect from "../../../component/ui/form/CurrencySelect";
import type { BaseAddress } from "../../../component/address/AddressFields";
import CompanyImageCard from "./CompanyImageCard";
import { detectCountryFromPhone, isValidPhone } from "../../../utils/phone";
import AddressFields from "../../../component/address/AddressFields";

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <h2 className="text-lg font-normal text-[#06284B] mb-6">{children}</h2>
);

const Label = ({ children }: { children: React.ReactNode }) => (
  <label className="block mb-2 text-base">
    {children} <span className="text-red-500">*</span>
  </label>
);

const Input = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input
    {...props}
    className="w-full h-[38px] rounded-md border border-[#CFCFCF] bg-white px-3 text-sm focus:outline-none
      focus:border-[#005AA7]"
  />
);

const Grid2 = ({ children }: { children: React.ReactNode }) => (
  <div className="grid grid-cols-2 gap-x-[50px] gap-y-[18px]">{children}</div>
);

interface CompanyFormProps {
  mode: "create" | "edit";
  initialValues: CompanyFormValues | null;
  isFirstTime: boolean;
  isSaving?: boolean;
  error?: string | null;
  onCancel: () => void;
  onSubmit: (values: CompanyFormValues, image: File | null) => void;
  onImageRemove?: () => void;
}

const emptyValues: CompanyFormValues = {
  companyName: "",
  taxId: "",
  currency: "",
  email: "",
  phone: "",
  companyAddress: "",
  country: "Thailand",
  province: "",
  district: "",
  subDistrict: "",
  zipcode: "",
  contactName: "",
  contactPhone: "",
  contactEmail: "",
  companyFile: null,
};

// COMPONENT

const CompanyForm: React.FC<CompanyFormProps> = ({
  mode,
  initialValues,
  isSaving,
  error,
  onCancel,
  onSubmit,
  onImageRemove,
}) => {
  const [values, setValues] = useState<CompanyFormValues>({
    ...emptyValues,
    ...initialValues,
  });

  const [companyPhoneCountry, setCompanyPhoneCountry] = useState<CountryCode>(
    () => detectCountryFromPhone(initialValues?.phone),
  );

  const [contactPhoneCountry, setContactPhoneCountry] = useState<CountryCode>(
    () => detectCountryFromPhone(initialValues?.contactPhone),
  );

  // dialog state
  const [showCancelDialog, setShowCancelDialog] = useState(false);

  // dirty check
  const isDirty = initialValues
    ? JSON.stringify(values) !== JSON.stringify(initialValues)
    : true;

  const [image, setImage] = useState<File | null>(null);
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [contactPhoneError, setContactPhoneError] = useState<string | null>(
    null,
  );
  const [removeOldImage, setRemoveOldImage] = useState(false);

  const handleAddressChange = (addr: BaseAddress) => {
    setValues((p) => ({
      ...p,
      companyAddress: addr.address,
      country: addr.country,
      province: addr.province,
      district: addr.district,
      subDistrict: addr.subDistrict,
      zipcode: addr.zipcode,
    }));
  };

  // HANDLERS

  const handleChange =
    (field: keyof CompanyFormValues) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setValues((p) => ({ ...p, [field]: e.target.value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!isValidPhone(values.phone)) {
      setPhoneError("Invalid phone number");
      return;
    }

    if (!isValidPhone(values.contactPhone)) {
      setContactPhoneError("Invalid phone number");
      return;
    }

    onSubmit(values, image);
  };

  const isCreate = mode === "create";

  const isValidRequired =
    values.companyName &&
    values.taxId &&
    values.email &&
    values.phone &&
    values.companyAddress &&
    values.province &&
    values.district &&
    values.subDistrict &&
    values.zipcode &&
    values.contactName &&
    values.contactPhone &&
    values.contactEmail;

  const disableSave = Boolean(isSaving) || !isValidRequired;

  return (
    <div className="w-full h-full flex flex-col overflow-hidden">
      <div className="w-full max-w-[1690px] mx-auto flex flex-col flex-1 min-h-0">
        <h2 className="text-2xl font-regular text-[#06284B] mb-5">
          {isCreate ? "Create Company" : "Edit Company"}
        </h2>

        {/* MAIN CANVAS */}
        <div className="flex-1 min-h-0 rounded-lg bg-[#FAFAFA] shadow flex flex-col overflow-hidden">
          <form
            id="company-form"
            onSubmit={handleSubmit}
            className="flex-1 min-h-0 flex flex-col"
          >
            {/* CONTENT (scroll) */}
            <div className="flex-1 min-h-0 overflow-y-auto hide-scrollbar px-8 py-8">
              {error && (
                <div className="mb-4 text-sm text-red-600">
                  Unable to save company. Please check your information.
                </div>
              )}

              <div className="grid grid-cols-[240px,1fr,1fr] gap-x-[50px] gap-y-[50px]">
                <div className="row-span-2">
                  <CompanyImageCard
                    value={image}
                    compFile={
                      removeOldImage
                        ? null
                        : (initialValues?.companyFile ?? null)
                    }
                    onChange={(file) => {
                      setImage(file);
                      if (file === null) {
                        setRemoveOldImage(true);
                        onImageRemove?.();
                      }
                    }}
                  />
                </div>

                <section className="col-span-2">
                  <SectionTitle>General</SectionTitle>
                  <Grid2>
                    <div>
                      <Label>Company Name</Label>
                      <Input
                        value={values.companyName}
                        onChange={handleChange("companyName")}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <Label>Tax ID</Label>
                        <Input
                          value={values.taxId}
                          onChange={handleChange("taxId")}
                        />
                      </div>

                      <div>
                        <CurrencySelect
                          label="Currency"
                          value={values.currency}
                          required
                          onChange={(currency) =>
                            setValues((p) => ({ ...p, currency }))
                          }
                        />
                      </div>
                    </div>
                    <div>
                      <Label>Email</Label>
                      <Input
                        value={values.email}
                        onChange={handleChange("email")}
                      />
                    </div>
                    <div>
                      <Label>Company Phone</Label>
                      <CountryPhoneInput
                        country={companyPhoneCountry}
                        value={values.phone}
                        onCountryChange={(c) => {
                          setCompanyPhoneCountry(c);

                          setValues((p) => ({
                            ...p,
                            phone: "", // reset เลย
                          }));

                          setPhoneError(null); // (optional แต่ควรเคลียร์ error)
                        }}
                        onChange={(phoneE164) =>
                          setValues((p) => ({ ...p, phone: phoneE164 }))
                        }
                      />
                      {phoneError && (
                        <p className="text-sm text-red-600 mt-1">
                          {phoneError}
                        </p>
                      )}
                    </div>
                  </Grid2>
                </section>

                <section>
                  <SectionTitle>Address</SectionTitle>

                  <AddressFields
                    value={{
                      address: values.companyAddress,
                      country: values.country,
                      province: values.province,
                      district: values.district,
                      subDistrict: values.subDistrict,
                      zipcode: values.zipcode,
                    }}
                    onChange={handleAddressChange}
                  />
                </section>

                <section>
                  <SectionTitle>Contact Person</SectionTitle>
                  <div className="space-y-4">
                    <div>
                      <Label>Name</Label>
                      <Input
                        value={values.contactName}
                        onChange={handleChange("contactName")}
                      />
                    </div>
                    <div>
                      <Label>Email</Label>
                      <Input
                        value={values.contactEmail}
                        onChange={handleChange("contactEmail")}
                      />
                    </div>
                    <div>
                      <Label>Phone</Label>
                      <CountryPhoneInput
                        country={contactPhoneCountry}
                        value={values.contactPhone}
                        onCountryChange={(c) => {
                          setContactPhoneCountry(c);

                          setValues((p) => ({
                            ...p,
                            contactPhone: "", // reset
                          }));

                          setContactPhoneError(null);
                        }}
                        onChange={(phoneE164) =>
                          setValues((p) => ({ ...p, contactPhone: phoneE164 }))
                        }
                      />
                      {contactPhoneError && (
                        <p className="text-sm text-red-600 mt-1">
                          {contactPhoneError}
                        </p>
                      )}
                    </div>
                  </div>
                </section>
              </div>
            </div>
          </form>

          {/* ===== FOOTER (ไม่ scroll / ไม่ขยับ) ===== */}
          <div className="sticky bottom-0 z-10 bg-[#FAFAFA] py-4 border-t border-[#E6E6E6] flex justify-center gap-4">
            {!isCreate && (
              <button
                type="button"
                onClick={() => {
                  if (isDirty) {
                    setShowCancelDialog(true);
                  } else {
                    onCancel();
                  }
                }}
                className="w-24 px-4 py-[6px] rounded-md bg-white border border-[#CFCFCF] text-base hover:bg-[#F1F1F1] text-black"
              >
                Cancel
              </button>
            )}

            <div
              title={
                disableSave
                  ? "Please complete all required fields before saving."
                  : ""
              }
            >
              <button
                type="submit"
                form="company-form"
                disabled={disableSave}
                className={`w-24 h-[38px] px-4 py-[6px] rounded-md text-base font-normal
                  ${
                    disableSave
                      ? "bg-[#BABABA] text-[#6B6B6B] cursor-not-allowed"
                      : "bg-[#005AA7] hover:bg-[#084072] text-white cursor-pointer"
                  }
                  `}
              >
                {isSaving ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      </div>

      <ConfirmDialog
        open={showCancelDialog}
        title="Cancel"
        message={
          <>
            Are you sure you want to{" "}
            <span className="text-red-500">Cancel</span> ?
          </>
        }
        onCancel={() => setShowCancelDialog(false)}
        onConfirm={() => {
          setShowCancelDialog(false);
          onCancel();
        }}
      />
    </div>
  );
};

export default CompanyForm;
