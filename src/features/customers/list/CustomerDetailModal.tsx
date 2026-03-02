import React, { useState } from "react";
import {
  isSameAddress,
  mapCustomerToUpdatePayload,
  type CustomerResponse,
  type UpdateCustomerPayload,
} from "../../../types/customer";
import Radio from "../../../component/ui/Radio";
import EditIcon from "../../../assets/svg/edit.svg?react";
import RemoveIcon from "../../../assets/svg/remove.svg?react";
import FormField, { FormTextarea } from "../../../component/ui/form/FormField";
import Input from "../../../component/ui/form/Input";
import AddressFields from "../../../component/address/AddressFields";
import TaxInvoiceSection from "../create/TaxInvoiceSection";
import CountryPhoneInput, {
  type CountryCode,
} from "../../../component/phoneInput/CountryPhoneInput";
import { detectCountryFromPhone } from "../../../utils/phone";
import PhoneView from "../../../component/phoneInput/PhoneView";
import PlusIcon from "../../../assets/svg/plus.svg?react";
import GenderDropdown from "./GenderDropdown";
import DatePicker from "../../../component/ui/Datepicker";

type Props = {
  open: boolean;
  mode: "view" | "edit";
  data?: CustomerResponse;
  onClose: () => void;
  onEdit: () => void;
  onSave: (data: UpdateCustomerPayload) => void;
};

const createEmptyTaxAddress = () => ({
  company_name: "",
  address_line: "",
  country: "Thailand",
  province: "",
  district: "",
  sub_district: "",
  zipcode: "",
});

const CustomerDetailModal: React.FC<Props> = ({
  open,
  mode,
  data,
  onClose,
  onEdit,
  onSave,
}) => {
  const [editData, setEditData] = useState<CustomerResponse>();
  const [addingTaxInvoice, setAddingTaxInvoice] = useState(false);
  const [useSameAddress, setUseSameAddress] = useState(false);
  const [phoneCountry, setPhoneCountry] = useState<CountryCode>("TH");

  /* sync data → edit state */
  // React.useEffect(() => {
  //   if (!editData?.tax_addr) return;

  //   const sameAddr = isSameAddress(editData.address, editData.tax_addr);

  //   const sameCompany =
  //     editData.business_type !== "Corporation" ||
  //     editData.tax_addr.company_name === editData.company_name;

  //   const shouldBeChecked = sameAddr && sameCompany;

  //   if (useSameAddress !== shouldBeChecked) {
  //     setUseSameAddress(shouldBeChecked);
  //   }
  // }, [editData, useSameAddress]);

  React.useEffect(() => {
    if (!editData?.tax_addr) return;

    const sameAddr = isSameAddress(editData.address, editData.tax_addr);

    const sameCompany =
      editData.business_type !== "Corporation" ||
      editData.tax_addr.company_name === editData.company_name;

    const shouldBeChecked = sameAddr && sameCompany;

    setUseSameAddress(shouldBeChecked);
  }, [editData]);

  React.useEffect(() => {
    if (!data) return;

    const cloned = JSON.parse(JSON.stringify(data)) as CustomerResponse;

    setEditData(cloned);

    // detect แค่ตอน init
    setPhoneCountry(detectCountryFromPhone(cloned.customer_phone));

    const hasTaxInvoice =
      Boolean(cloned.customer_tax_id?.trim()) ||
      Boolean(cloned.tax_addr?.address_line?.trim());

    if (!hasTaxInvoice) {
      /* ไม่มี tax invoice → checkbox ต้อง false */
      setUseSameAddress(false);
      setAddingTaxInvoice(false);
      return;
    }

    const same =
      cloned.address.address_line === cloned.tax_addr?.address_line &&
      cloned.address.country === cloned.tax_addr?.country &&
      cloned.address.province === cloned.tax_addr?.province &&
      cloned.address.district === cloned.tax_addr?.district &&
      cloned.address.sub_district === cloned.tax_addr?.sub_district &&
      cloned.address.zipcode === cloned.tax_addr?.zipcode;

    setUseSameAddress(Boolean(same));
    setAddingTaxInvoice(false);
  }, [data, mode]);

  if (!open || !editData) return null;

  const isView = mode === "view";

  /* tax invoice detection */
  const isTaxInvoiceEmpty = (data?: CustomerResponse) => {
    if (!data) return true;

    return !(
      data.customer_tax_id?.trim() ||
      data.tax_addr?.address_line?.trim() ||
      data.tax_addr?.province?.trim() ||
      data.tax_addr?.district?.trim()
    );
  };

  const validateTaxInvoice = (): boolean => {
    if (!showTaxSection) return true;

    if (!editData.customer_tax_id?.trim()) {
      alert("Tax ID is required");
      return false;
    }

    if (!editData.tax_addr?.company_name?.trim()) {
      alert("Company Name is required");
      return false;
    }

    if (
      !editData.tax_addr?.address_line?.trim() ||
      !editData.tax_addr?.province?.trim() ||
      !editData.tax_addr?.district?.trim() ||
      !editData.tax_addr?.sub_district?.trim()
    ) {
      alert("Tax Invoice Address incomplete");
      return false;
    }

    return true;
  };

  const hasTaxInvoice = !isTaxInvoiceEmpty(editData);

  const showTaxSection = hasTaxInvoice || (mode === "edit" && addingTaxInvoice);
  const showDivider = isView ? hasTaxInvoice : true;
  const showAddButton = mode === "edit" && !hasTaxInvoice && !addingTaxInvoice;
  const isCorporation = editData.business_type === "Corporation";

  const updateField = <K extends keyof CustomerResponse>(
    key: K,
    value: CustomerResponse[K],
  ) => {
    setEditData((prev) => prev && { ...prev, [key]: value });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div
        className="w-full max-w-[min(1200px,95vw)] max-h-[90vh] bg-white rounded-t-lg shadow-lg 
          grid grid-rows-[auto_1fr_auto]"
      >
        {/* ================= HEADER ================= */}
        <div className="flex items-center justify-between px-6 py-3 border-b">
          <h2 className="text-xl text-[#06284B] font-normal">Customer</h2>

          <div className="flex items-center gap-3">
            {isView && (
              <button
                onClick={onEdit}
                className="px-3 py-1.5 text-base bg-white border border-[#CFCFCF]
                hover:bg-[#F1F1F1] rounded-md flex items-center gap-2"
              >
                <EditIcon className="w-5 h-5" />
                <span>Edit</span>
              </button>
            )}

            <button onClick={onClose}>
              <RemoveIcon className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* ================= BODY ================= */}
        <div className="px-8 py-6 bg-[#FBFBFB] overflow-auto hide-scrollbar">
          {/* Business Type */}
          <div className="flex items-center gap-6 mb-6">
            <span className="text-lg text-[#06284B]">Business Type</span>

            <Radio
              name="businessType"
              label={editData.business_type}
              value={editData.business_type}
              checked
              onChange={() => {}}
            />
          </div>

          {/* 2 Columns */}
          <div className="max-w-5xl grid grid-cols-[1fr,1.2fr] gap-x-[100px]">
            {/* ================= LEFT ================= */}
            <div>
              <h2 className="text-lg text-[#06284B] mb-4">Information</h2>

              <div className="space-y-4">
                <FormField label="Customer ID">
                  <Input value={editData.customer_id} disabled />
                </FormField>

                {isCorporation ? (
                  <>
                    <FormField label="Company Name" required>
                      <Input
                        value={editData.company_name || ""}
                        disabled={isView}
                        onChange={(e) =>
                          updateField("company_name", e.target.value)
                        }
                      />
                    </FormField>

                    <FormField label="Contact Person" required>
                      <Input
                        value={editData.contact_person || ""}
                        disabled={isView}
                        onChange={(e) =>
                          updateField("contact_person", e.target.value)
                        }
                      />
                    </FormField>
                  </>
                ) : (
                  <>
                    {/* ROW 1 */}
                    <div className="grid grid-cols-2 gap-6">
                      <FormField label="First Name" required>
                        <Input
                          value={editData.customer_name?.split(" ")[0] || ""}
                          disabled={isView}
                          onChange={(e) =>
                            updateField(
                              "customer_name",
                              `${e.target.value} ${editData.customer_name?.split(" ")[1] || ""}`,
                            )
                          }
                        />
                      </FormField>

                      <FormField label="Last Name" required>
                        <Input
                          value={editData.customer_name?.split(" ")[1] || ""}
                          disabled={isView}
                          onChange={(e) =>
                            updateField(
                              "customer_name",
                              `${editData.customer_name?.split(" ")[0] || ""} ${e.target.value}`,
                            )
                          }
                        />
                      </FormField>
                    </div>

                    {/* ROW 2 */}
                    <div className="grid grid-cols-2 gap-6">
                      <FormField label="Gender" required>
                        {isView ? (
                          <Input
                            value={editData.customer_gender || ""}
                            disabled
                          />
                        ) : (
                          <GenderDropdown
                            value={editData.customer_gender}
                            options={["Male", "Female", "Others"]}
                            placeholder="Select gender"
                            onChange={(val) =>
                              updateField("customer_gender", val)
                            }
                          />
                        )}
                      </FormField>

                      <FormField label="Birthday">
                        {isView ? (
                          <Input
                            value={
                              editData.customer_date
                                ? editData.customer_date.slice(0, 10)
                                : ""
                            }
                            disabled
                          />
                        ) : (
                          <DatePicker
                            value={editData.customer_date || ""}
                            onChange={(date) =>
                              updateField("customer_date", date)
                            }
                          />
                        )}
                      </FormField>
                    </div>
                  </>
                )}

                <FormField label="Phone" required>
                  {isView ? (
                    <PhoneView phone={editData.customer_phone} />
                  ) : (
                    <CountryPhoneInput
                      value={editData.customer_phone || ""}
                      country={phoneCountry}
                      onCountryChange={setPhoneCountry}
                      onChange={(phone) => updateField("customer_phone", phone)}
                    />
                  )}
                </FormField>

                <FormField label="Email">
                  <Input
                    value={editData.customer_email || ""}
                    disabled={isView}
                    onChange={(e) =>
                      updateField("customer_email", e.target.value)
                    }
                  />
                </FormField>

                <FormField label="Note">
                  <FormTextarea
                    value={editData.note || ""}
                    disabled={isView}
                    onChange={(e) => updateField("note", e.target.value)}
                  />
                </FormField>
              </div>
            </div>

            {/* ================= RIGHT ================= */}
            <div>
              <h2 className="text-lg text-[#06284B] mb-4">Address</h2>

              <AddressFields
                value={{
                  address: editData.address.address_line || "",
                  country: editData.address.country || "Thailand",
                  province: editData.address.province || "",
                  district: editData.address.district || "",
                  subDistrict: editData.address.sub_district || "",
                  zipcode: editData.address.zipcode || "",
                }}
                disabled={isView}
                onChange={(addr) =>
                  setEditData(
                    (prev) =>
                      prev && {
                        ...prev,
                        address: {
                          ...prev.address,
                          address_line: addr.address,
                          country: addr.country,
                          province: addr.province,
                          district: addr.district,
                          sub_district: addr.subDistrict,
                          zipcode: addr.zipcode,
                        },
                      },
                  )
                }
                className={isView ? "pointer-events-none" : ""}
              />

              {showDivider && (
                <div className="my-6 border-t border-gray-200"></div>
              )}

              {/* ================= TAX INVOICE ADDRESS ================= */}

              {showAddButton && (
                <button
                  onClick={() => {
                    setAddingTaxInvoice(true);

                    setEditData((prev) => {
                      if (!prev) return prev;

                      return {
                        ...prev,
                        customer_tax_id: "",
                        tax_addr: createEmptyTaxAddress(),
                      };
                    });
                  }}
                  className="mt-3 text-sm text-[#0690F1] flex items-center gap-2 hover:underline"
                >
                  <span className="text-lg">
                    <PlusIcon className="w-5 h-5 text-[#0690F1]" />
                  </span>{" "}
                  Tax Invoice Address
                </button>
              )}

              {showTaxSection && (
                <TaxInvoiceSection
                  show
                  isView={isView}
                  useSameAddress={useSameAddress}
                  onToggleSameAddress={(checked) => {
                    setUseSameAddress(checked);

                    setEditData((prev) => {
                      if (!prev) return prev;

                      if (checked) {
                        return {
                          ...prev,
                          tax_addr: {
                            ...prev.address,
                            company_name:
                              prev.business_type === "Corporation"
                                ? prev.company_name
                                : prev.tax_addr?.company_name,
                          },
                        };
                      }

                      return {
                        ...prev,
                        tax_addr: createEmptyTaxAddress(),
                      };
                    });
                  }}
                  data={{
                    companyName: editData.tax_addr?.company_name || "",
                    taxId: editData.customer_tax_id || "",
                    address: {
                      address: editData.tax_addr?.address_line || "",
                      country: editData.tax_addr?.country || "Thailand",
                      province: editData.tax_addr?.province || "",
                      district: editData.tax_addr?.district || "",
                      subDistrict: editData.tax_addr?.sub_district || "",
                      zipcode: editData.tax_addr?.zipcode || "",
                    },
                  }}
                  onAdd={() => {}}
                  onRemove={() => {
                    setAddingTaxInvoice(false);

                    setEditData(
                      (prev) =>
                        prev && {
                          ...prev,
                          customer_tax_id: undefined,
                          tax_addr: undefined,
                        },
                    );
                  }}
                  onChangeData={(field, value) =>
                    setEditData(
                      (prev) =>
                        prev && {
                          ...prev,

                          ...(field === "companyName"
                            ? {
                                tax_addr: {
                                  ...prev.tax_addr,
                                  company_name: value,
                                },
                              }
                            : {
                                customer_tax_id: value,
                              }),
                        },
                    )
                  }
                  onChangeAddress={(addr) =>
                    setEditData(
                      (prev) =>
                        prev && {
                          ...prev,
                          tax_addr: {
                            address_line: addr.address,
                            country: addr.country,
                            province: addr.province,
                            district: addr.district,
                            sub_district: addr.subDistrict,
                            zipcode: addr.zipcode,
                          },
                        },
                    )
                  }
                />
              )}
            </div>
          </div>
        </div>

        {!isView && (
          <div className="flex justify-center gap-4 px-6 py-3 border-t">
            <>
              <button
                className="w-24 px-4 py-[6px] bg-white border border-[#CFCFCF] text-base hover:bg-[#F1F1F1] text-black rounded-md"
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                className="w-24 px-4 py-[6px] bg-[#005AA7] hover:bg-[#084072] text-white text-base rounded-md"
                onClick={() => {
                  if (!validateTaxInvoice()) return;

                  onSave(mapCustomerToUpdatePayload(editData));
                }}
              >
                Save
              </button>
            </>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerDetailModal;
