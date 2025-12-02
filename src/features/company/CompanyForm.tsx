import React, { useState } from "react";

export interface CompanyFormValues {
  companyName: string;
  taxId: string;
  email: string;
  phone: string;
  companyAddress: string;
  country: string;
  province: string;
  district: string;
  subDistrict: string;
  zipcode: string;
  contactName: string;
  contactPhone: string;
  contactEmail: string;
}

interface CompanyFormProps {
  mode: "create" | "edit";
  initialValues: CompanyFormValues | null;
  onCancel: () => void;
  onSubmit: (values: CompanyFormValues) => void;
}

const emptyValues: CompanyFormValues = {
  companyName: "",
  taxId: "",
  email: "",
  phone: "",
  companyAddress: "",
  country: "",
  province: "",
  district: "",
  subDistrict: "",
  zipcode: "",
  contactName: "",
  contactPhone: "",
  contactEmail: "",
};

const CompanyForm: React.FC<CompanyFormProps> = ({
  mode,
  initialValues,
  onCancel,
  onSubmit,
}) => {
  const [values, setValues] = useState<CompanyFormValues>(
    initialValues ?? emptyValues
  );

  const handleChange =
    (field: keyof CompanyFormValues) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setValues((prev) => ({ ...prev, [field]: e.target.value }));
    };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(values);
  };

  const isCreate = mode === "create";

  return (
    <div className="w-full">
      {/* ให้หัวข้อกับ card อยู่ใน container เดียวกัน เหมือนดีไซน์ */}
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl font-semibold text-[#0053A4] mb-6">
          {isCreate ? "Create Company" : "Edit Company"}
        </h2>

        <div className="rounded-lg bg-[#FAFAFA] shadow-md px-16 py-12">
          <form onSubmit={handleSubmit} className="w-full">
            <div className="grid grid-cols-[160px,minmax(0,1fr)] gap-y-10 gap-x-10 text-sm text-gray-800">
              {/* General */}
              <div className="font-semibold flex items-start pt-1">
                General :
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block mb-1 text-xs font-medium">
                    Company Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    className="w-full h-9 rounded-md border border-[#CFCFCF] bg-white px-3 text-xs outline-none"
                    value={values.companyName}
                    onChange={handleChange("companyName")}
                  />
                </div>
                <div>
                  <label className="block mb-1 text-xs font-medium">
                    Tax ID <span className="text-red-500">*</span>
                  </label>
                  <input
                    className="w-full h-9 rounded-md border border-[#CFCFCF] bg-white px-3 text-xs outline-none"
                    value={values.taxId}
                    onChange={handleChange("taxId")}
                  />
                </div>
                <div>
                  <label className="block mb-1 text-xs font-medium">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    className="w-full h-9 rounded-md border border-[#CFCFCF] bg-white px-3 text-xs outline-none"
                    value={values.email}
                    onChange={handleChange("email")}
                  />
                </div>
                <div>
                  <label className="block mb-1 text-xs font-medium">
                    Company Phone <span className="text-red-500">*</span>
                  </label>
                  <input
                    className="w-full h-9 rounded-md border border-[#CFCFCF] bg-white px-3 text-xs outline-none"
                    value={values.phone}
                    onChange={handleChange("phone")}
                  />
                </div>
              </div>

              {/* Address */}
              <div className="font-semibold flex items-start pt-1">
                Address :
              </div>
              <div className="space-y-5">
                <div>
                  <label className="block mb-1 text-xs font-medium">
                    Company Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    className="w-full h-9 rounded-md border border-[#CFCFCF] bg-white px-3 text-xs outline-none"
                    value={values.companyAddress}
                    onChange={handleChange("companyAddress")}
                  />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block mb-1 text-xs font-medium">
                      Country <span className="text-red-500">*</span>
                    </label>
                    <select
                      className="w-full h-9 rounded-md border border-[#CFCFCF] bg-white px-3 text-xs outline-none"
                      value={values.country}
                      onChange={handleChange("country")}
                    >
                      <option value="">Select</option>
                      <option value="Thailand">Thailand</option>
                    </select>
                  </div>
                  <div>
                    <label className="block mb-1 text-xs font-medium">
                      Province <span className="text-red-500">*</span>
                    </label>
                    <select
                      className="w-full h-9 rounded-md border border-[#CFCFCF] bg-white px-3 text-xs outline-none"
                      value={values.province}
                      onChange={handleChange("province")}
                    >
                      <option value="">Select</option>
                      <option value="Bangkok">Bangkok</option>
                    </select>
                  </div>
                  <div>
                    <label className="block mb-1 text-xs font-medium">
                      District <span className="text-red-500">*</span>
                    </label>
                    <select
                      className="w-full h-9 rounded-md border border-[#CFCFCF] bg-white px-3 text-xs outline-none"
                      value={values.district}
                      onChange={handleChange("district")}
                    >
                      <option value="">Select</option>
                      <option value="BangRak">BangRak</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block mb-1 text-xs font-medium">
                      Sub-district <span className="text-red-500">*</span>
                    </label>
                    <select
                      className="w-full h-9 rounded-md border border-[#CFCFCF] bg-white px-3 text-xs outline-none"
                      value={values.subDistrict}
                      onChange={handleChange("subDistrict")}
                    >
                      <option value="">Select</option>
                      <option value="BangRak">BangRak</option>
                    </select>
                  </div>
                  <div>
                    <label className="block mb-1 text-xs font-medium">
                      Zipcode <span className="text-red-500">*</span>
                    </label>
                    <input
                      className="w-full h-9 rounded-md border border-[#CFCFCF] bg-white px-3 text-xs outline-none"
                      value={values.zipcode}
                      onChange={handleChange("zipcode")}
                    />
                  </div>
                </div>
              </div>

              {/* Contact Person */}
              <div className="font-semibold flex items-start pt-1">
                Contact Person :
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block mb-1 text-xs font-medium">
                    Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    className="w-full h-9 rounded-md border border-[#CFCFCF] bg-white px-3 text-xs outline-none"
                    value={values.contactName}
                    onChange={handleChange("contactName")}
                  />
                </div>
                <div>
                  <label className="block mb-1 text-xs font-medium">
                    Phone <span className="text-red-500">*</span>
                  </label>
                  <input
                    className="w-full h-9 rounded-md border border-[#CFCFCF] bg-white px-3 text-xs outline-none"
                    value={values.contactPhone}
                    onChange={handleChange("contactPhone")}
                  />
                </div>
                <div className="col-span-2">
                  <label className="block mb-1 text-xs font-medium">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    className="w-full h-9 rounded-md border border-[#CFCFCF] bg-white px-3 text-xs outline-none"
                    value={values.contactEmail}
                    onChange={handleChange("contactEmail")}
                  />
                </div>
              </div>
            </div>

            {/* ปุ่มด้านล่าง */}
            <div className="mt-12 flex justify-center gap-4">
              {!isCreate && (
                <button
                  type="button"
                  onClick={onCancel}
                  className="px-7 py-2 rounded-md bg-[#FF383C] hover:bg-red-600 text-xs font-medium text-white"
                >
                  Cancel
                </button>
              )}
              <button
                type="submit"
                className={`px-7 py-2 rounded-md text-xs font-normal text-white ${
                  isCreate
                    ? "bg-[#BFBFBF] hover:bg-[#34C759]" // แบบในดีไซน์: ปุ่ม Save สีเทา
                    : "bg-[#34C759] hover:bg-[#2eb650]"
                }`}
              >
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CompanyForm;
