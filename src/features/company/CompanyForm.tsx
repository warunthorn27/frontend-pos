import React, { useEffect, useMemo, useState } from "react";
import {
  getDistricts,
  getProvinces,
  getSubDistricts,
  type SubDistrictItem,
} from "../../services/address";

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

  isFirstTime: boolean;
  isSaving?: boolean;
  error?: string | null;

  onCancel: () => void;
  onSubmit: (values: CompanyFormValues) => void | Promise<void>;
}

const emptyValues: CompanyFormValues = {
  companyName: "",
  taxId: "",
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
};

const CompanyForm: React.FC<CompanyFormProps> = ({
  mode,
  initialValues,
  isFirstTime,
  isSaving,
  error,
  onCancel,
  onSubmit,
}) => {
  const [values, setValues] = useState<CompanyFormValues>(
    initialValues ?? emptyValues
  );

  // sync initial values (ตอน fetch company แล้วค่อย set)
  useEffect(() => {
    if (!initialValues) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setValues(initialValues);
  }, [initialValues]);

  // dropdown data
  const [provinces, setProvinces] = useState<string[]>([]);
  const [districts, setDistrictsState] = useState<string[]>([]);
  const [subDistricts, setSubDistrictsState] = useState<SubDistrictItem[]>([]);

  const [addrLoading, setAddrLoading] = useState(false);
  const [addrError, setAddrError] = useState<string | null>(null);

  // load provinces on mount
  useEffect(() => {
    let alive = true;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setAddrLoading(true);
    setAddrError(null);

    getProvinces()
      .then((data) => alive && setProvinces(data))
      .catch(
        (e) =>
          alive &&
          setAddrError(e instanceof Error ? e.message : "Load provinces failed")
      )
      .finally(() => alive && setAddrLoading(false));

    return () => {
      alive = false;
    };
  }, []);

  // load districts when province changes
  useEffect(() => {
    if (!values.province) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setDistrictsState([]);
      setSubDistrictsState([]);
      return;
    }

    let alive = true;
    setAddrLoading(true);
    setAddrError(null);

    getDistricts(values.province)
      .then((data) => {
        if (!alive) return;
        setDistrictsState(data);
      })
      .catch(
        (e) =>
          alive &&
          setAddrError(e instanceof Error ? e.message : "Load districts failed")
      )
      .finally(() => alive && setAddrLoading(false));

    return () => {
      alive = false;
    };
  }, [values.province]);

  // load sub-districts when district changes
  useEffect(() => {
    if (!values.province || !values.district) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSubDistrictsState([]);
      return;
    }

    let alive = true;
    setAddrLoading(true);
    setAddrError(null);

    getSubDistricts(values.province, values.district)
      .then((data) => {
        if (!alive) return;
        setSubDistrictsState(data);
      })
      .catch(
        (e) =>
          alive &&
          setAddrError(
            e instanceof Error ? e.message : "Load sub-districts failed"
          )
      )
      .finally(() => alive && setAddrLoading(false));

    return () => {
      alive = false;
    };
  }, [values.province, values.district]);

  const subDistrictOptions = useMemo(
    () => subDistricts.map((s) => s.sub_district),
    [subDistricts]
  );

  const handleChange =
    (field: keyof CompanyFormValues) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setValues((prev) => ({ ...prev, [field]: e.target.value }));
    };

  const handleProvinceChange = (province: string) => {
    setValues((prev) => ({
      ...prev,
      province,
      district: "",
      subDistrict: "",
      zipcode: "",
    }));
  };

  const handleDistrictChange = (district: string) => {
    setValues((prev) => ({
      ...prev,
      district,
      subDistrict: "",
      zipcode: "",
    }));
  };

  const handleSubDistrictChange = (subDistrict: string) => {
    const found = subDistricts.find((s) => s.sub_district === subDistrict);
    setValues((prev) => ({
      ...prev,
      subDistrict,
      zipcode: found?.zipcode ?? "",
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(values);
  };

  const isCreate = mode === "create";

  // required validation
  const isValidRequired =
    values.companyName.trim() &&
    values.taxId.trim() &&
    values.email.trim() &&
    values.phone.trim() &&
    values.companyAddress.trim() &&
    values.country.trim() &&
    values.province.trim() &&
    values.district.trim() &&
    values.subDistrict.trim() &&
    values.zipcode.trim() &&
    values.contactName.trim() &&
    values.contactPhone.trim() &&
    values.contactEmail.trim();

  const disableCancel = isFirstTime && isCreate;
  const disableSave = Boolean(isSaving) || (isCreate && !isValidRequired);

  return (
    <div className="w-full">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl font-regular text-[#0053A4] mb-[9px]">
          {isCreate ? "Create Company" : "Edit Company"}
        </h2>
        <form id="company-form" onSubmit={handleSubmit} className="w-full">
          <div className="rounded-lg bg-[#FAFAFA] shadow-md px-36 py-12">
            {error ? (
              <div className="mb-4 text-sm text-red-600">{error}</div>
            ) : null}
            {addrError ? (
              <div className="mb-4 text-sm text-red-600">{addrError}</div>
            ) : null}

            <div className="grid grid-cols-[160px,minmax(0,1fr)] gap-y-10 gap-x-10 text-base text-gray-800">
              {/* General */}
              <div className="font-regular flex items-start">General :</div>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block mb-1 text-xs font-regular">
                    Company Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    className="w-full h-9 rounded-md border border-[#CFCFCF] bg-white px-3 text-xs outline-none"
                    value={values.companyName}
                    onChange={handleChange("companyName")}
                  />
                </div>
                <div>
                  <label className="block mb-1 text-xs font-regular">
                    Tax ID <span className="text-red-500">*</span>
                  </label>
                  <input
                    className="w-full h-9 rounded-md border border-[#CFCFCF] bg-white px-3 text-xs outline-none"
                    value={values.taxId}
                    onChange={handleChange("taxId")}
                  />
                </div>
                <div>
                  <label className="block mb-1 text-xs font-regular">
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
                  <label className="block mb-1 text-xs font-regular">
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
              <div className="font-regular flex items-start">Address :</div>
              <div className="space-y-5">
                <div>
                  <label className="block mb-1 text-xs font-regular">
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
                    <label className="block mb-1 text-xs font-regular">
                      Country <span className="text-red-500">*</span>
                    </label>
                    <select
                      className="w-full h-9 rounded-md border border-[#CFCFCF] bg-[#F1F1F1] px-3 text-xs outline-none"
                      value={values.country}
                      disabled
                      onChange={handleChange("country")}
                    >
                      <option value="Thailand">Thailand</option>
                    </select>
                  </div>

                  <div>
                    <label className="block mb-1 text-xs font-regular">
                      Province <span className="text-red-500">*</span>
                    </label>
                    <select
                      className="w-full h-9 rounded-md border border-[#CFCFCF] bg-white px-3 text-xs outline-none disabled:bg-[#F1F1F1]"
                      value={values.province}
                      onChange={(e) => handleProvinceChange(e.target.value)}
                      disabled={addrLoading}
                    >
                      <option value="">Select</option>
                      {provinces.map((p) => (
                        <option key={p} value={p}>
                          {p}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block mb-1 text-xs font-regular">
                      District <span className="text-red-500">*</span>
                    </label>
                    <select
                      className="w-full h-9 rounded-md border border-[#CFCFCF] bg-white px-3 text-xs outline-none disabled:bg-[#F1F1F1]"
                      value={values.district}
                      onChange={(e) => handleDistrictChange(e.target.value)}
                      disabled={addrLoading || !values.province}
                    >
                      <option value="">Select</option>
                      {districts.map((d) => (
                        <option key={d} value={d}>
                          {d}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block mb-1 text-xs font-regular">
                      Sub-district <span className="text-red-500">*</span>
                    </label>
                    <select
                      className="w-full h-9 rounded-md border border-[#CFCFCF] bg-white px-3 text-xs outline-none disabled:bg-[#F1F1F1]"
                      value={values.subDistrict}
                      onChange={(e) => handleSubDistrictChange(e.target.value)}
                      disabled={addrLoading || !values.district}
                    >
                      <option value="">Select</option>
                      {subDistrictOptions.map((sd) => (
                        <option key={sd} value={sd}>
                          {sd}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block mb-1 text-xs font-regular">
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
              <div className="font-regular flex items-start">
                Contact Person :
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block mb-1 text-xs font-regular">
                    Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    className="w-full h-9 rounded-md border border-[#CFCFCF] bg-white px-3 text-xs outline-none"
                    value={values.contactName}
                    onChange={handleChange("contactName")}
                  />
                </div>
                <div>
                  <label className="block mb-1 text-xs font-regular">
                    Phone <span className="text-red-500">*</span>
                  </label>
                  <input
                    className="w-full h-9 rounded-md border border-[#CFCFCF] bg-white px-3 text-xs outline-none"
                    value={values.contactPhone}
                    onChange={handleChange("contactPhone")}
                  />
                </div>
                <div className="col-span-2">
                  <label className="block mb-1 text-xs font-regular">
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
          </div>
          {/* ปุ่มอยู่นอกกรอบ */}
          <div className="mt-10 flex justify-center gap-4">
            {!isCreate && (
              <button
                type="button"
                onClick={onCancel}
                disabled={disableCancel || Boolean(isSaving)}
                className="px-7 py-2 rounded-md bg-[#FF383C] hover:bg-red-600 text-xs font-regular text-white disabled:opacity-60"
              >
                Cancel
              </button>
            )}

            <button
              type="submit"
              disabled={disableSave || isSaving}
              className={`px-5 py-1 rounded-md text-lg font-normal
                ${
                  disableSave || isSaving
                    ? "bg-[#BABABA] cursor-not-allowed text-[#545454]"
                    : "bg-[#34C759] hover:bg-[#24913F] text-white"
                }
                `}
              title={disableSave ? "Please fill all required fields" : ""}
            >
              {isSaving ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CompanyForm;
