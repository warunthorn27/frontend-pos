import React, { useEffect, useMemo, useState } from "react";
import {
  getDistricts,
  getProvinces,
  getSubDistricts,
  type SubDistrictItem,
} from "../../../services/address";
import CompanyImageCard from "./CompanyImageCard";
import DropdownArrow from "../../../assets/svg/dropdown-arrow2.svg?react";
import ConfirmDialog from "../../../component/dialog/ConfirmDialog";
import type { CompanyFormValues } from "../../../types/company";

// Thai phone only (0XXXXXXXXX)
const TH_PHONE_REGEX = /^0\d{9}$/;

const isValidThaiPhone = (v: string) => TH_PHONE_REGEX.test(v);

const Card = ({ children }: { children: React.ReactNode }) => (
  <div className="bg-[#FAFAFA] rounded-lg shadow px-8 py-8">{children}</div>
);

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <h2 className="text-lg font-normal text-[#084072] mb-6">{children}</h2>
);

const Label = ({ children }: { children: React.ReactNode }) => (
  <label className="block mb-1 text-base">
    {children} <span className="text-red-500">*</span>
  </label>
);

const Input = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input
    {...props}
    className="w-full h-10 rounded-md border border-[#CFCFCF] bg-white px-3 text-sm focus:outline-none
      focus:border-[#2DA9FF]
      focus:ring-1 focus:ring-[#2DA9FF]/30"
  />
);

const PhoneInput = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) => (
  <div className="flex items-center h-10 w-full rounded-md border border-[#CFCFCF] bg-white">
    <div className="flex items-center gap-1 px-3 text-sm text-gray-500">
      +66
      <DropdownArrow className="w-3 h-3 text-gray-400 mx-2" />
    </div>
    <div className="h-10 w-px bg-[#CFCFCF]" />
    <input
      value={value}
      onChange={(e) => onChange(e.target.value.replace(/\D/g, ""))}
      className="flex-1 h-full px-3 text-sm outline-none bg-transparent"
    />
  </div>
);

const Select = (props: React.SelectHTMLAttributes<HTMLSelectElement>) => (
  <select
    {...props}
    className="w-full h-10 rounded-md border border-[#CFCFCF] px-3 text-sm bg-white appearance-none focus:outline-none
      focus:border-[#2DA9FF]
      focus:ring-1 focus:ring-[#2DA9FF]/30"
  />
);

const Grid2 = ({ children }: { children: React.ReactNode }) => (
  <div className="grid grid-cols-2 gap-x-[50px] gap-y-[18px]">{children}</div>
);

const SubGrid2 = ({ children }: { children: React.ReactNode }) => (
  <div className="grid grid-cols-2 gap-6">{children}</div>
);

const SelectWrapper = ({
  children,
  disabled,
}: {
  children: React.ReactNode;
  disabled?: boolean;
}) => (
  <div className="relative">
    {children}

    <DropdownArrow
      className={`
        pointer-events-none
        absolute right-4 top-1/2 -translate-y-1/2
        w-3 h-3
        ${disabled ? "text-gray-300" : "text-black"}
      `}
    />
  </div>
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

  // dialog state
  const [showCancelDialog, setShowCancelDialog] = useState(false);

  // keep initial values for dirty check
  const initialRef = React.useRef<CompanyFormValues>(
    initialValues ?? emptyValues
  );

  // dirty check
  const isDirty = JSON.stringify(values) !== JSON.stringify(initialRef.current);

  useEffect(() => {
    if (initialValues) {
      initialRef.current = initialValues;
    }
  }, [initialValues]);

  const [provinces, setProvinces] = useState<string[]>([]);
  const [districts, setDistrictsState] = useState<string[]>([]);
  const [subDistricts, setSubDistrictsState] = useState<SubDistrictItem[]>([]);
  const [addrLoading, setAddrLoading] = useState(false);
  const [addrError, setAddrError] = useState<string | null>(null);
  const [image, setImage] = useState<File | null>(null);
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [contactPhoneError, setContactPhoneError] = useState<string | null>(
    null
  );
  const [removeOldImage, setRemoveOldImage] = useState(false);

  // ADDRESS

  useEffect(() => {
    let alive = true;

    const load = async () => {
      try {
        setAddrLoading(true);
        const data = await getProvinces();
        if (alive) setProvinces(data);
      } catch (e) {
        if (alive)
          setAddrError(
            e instanceof Error ? e.message : "Load provinces failed"
          );
      } finally {
        if (alive) setAddrLoading(false);
      }
    };

    load();
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    if (!values.province) {
      setDistrictsState([]);
      setSubDistrictsState([]);
      return;
    }

    let alive = true;

    const load = async () => {
      try {
        setAddrLoading(true);
        const data = await getDistricts(values.province);
        if (alive) setDistrictsState(data);
      } finally {
        if (alive) setAddrLoading(false);
      }
    };

    load();
    return () => {
      alive = false;
    };
  }, [values.province]);

  useEffect(() => {
    if (!values.province || !values.district) {
      setSubDistrictsState([]);
      return;
    }

    let alive = true;

    const load = async () => {
      try {
        setAddrLoading(true);
        const data = await getSubDistricts(values.province, values.district);
        if (alive) setSubDistrictsState(data);
      } finally {
        if (alive) setAddrLoading(false);
      }
    };

    load();
    return () => {
      alive = false;
    };
  }, [values.province, values.district]);

  const subDistrictOptions = useMemo(
    () => subDistricts.map((s) => s.sub_district),
    [subDistricts]
  );

  // HANDLERS

  const handleChange =
    (field: keyof CompanyFormValues) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setValues((p) => ({ ...p, [field]: e.target.value }));

  const handleProvinceChange = (province: string) =>
    setValues((p) => ({
      ...p,
      province,
      district: "",
      subDistrict: "",
      zipcode: "",
    }));

  const handleDistrictChange = (district: string) =>
    setValues((p) => ({
      ...p,
      district,
      subDistrict: "",
      zipcode: "",
    }));

  const handleSubDistrictChange = (subDistrict: string) => {
    const found = subDistricts.find((s) => s.sub_district === subDistrict);
    setValues((p) => ({
      ...p,
      subDistrict,
      zipcode: found?.zipcode ?? "",
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // validate ก่อนส่ง
    if (!isValidThaiPhone(values.phone)) {
      setPhoneError("เบอร์โทรต้องเป็น 10 หลัก และขึ้นต้นด้วย 0");
      return;
    }

    if (!isValidThaiPhone(values.contactPhone)) {
      setContactPhoneError("เบอร์โทรต้องเป็น 10 หลัก และขึ้นต้นด้วย 0");
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

  // const disableSave = Boolean(isSaving) || (isCreate && !isValidRequired);
  const disableSave =
    Boolean(isSaving) ||
    !isValidRequired ||
    Boolean(phoneError) ||
    Boolean(contactPhoneError);

  // RENDER

  return (
    <div className="w-full">
      <div className="w-full max-w-[1600px] mx-auto h-full flex flex-col">
        <h2 className="text-2xl font-regular text-[#084072] mb-5">
          {isCreate ? "Create Company" : "Edit Company"}
        </h2>

        <form onSubmit={handleSubmit}>
          <Card>
            {error && <div className="mb-4 text-sm text-red-600">{error}</div>}
            {addrError && (
              <div className="mb-4 text-sm text-red-600">{addrError}</div>
            )}

            <div className="grid grid-cols-[240px,1fr,1fr] gap-x-[50px] gap-y-[50px]">
              <div className="row-span-2">
                <CompanyImageCard
                  value={image}
                  compFile={
                    removeOldImage ? null : initialValues?.companyFile ?? null
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
                  <div>
                    <Label>Tax ID</Label>
                    <Input
                      value={values.taxId}
                      onChange={handleChange("taxId")}
                    />
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
                    <PhoneInput
                      value={values.phone}
                      onChange={(v) => {
                        setValues((p) => ({ ...p, phone: v }));
                        setPhoneError(
                          v && !isValidThaiPhone(v)
                            ? "เบอร์โทรต้องเป็น 10 หลัก และขึ้นต้นด้วย 0"
                            : null
                        );
                      }}
                    />
                    {phoneError && (
                      <p className="text-sm text-red-600 mt-1">{phoneError}</p>
                    )}
                  </div>
                </Grid2>
              </section>

              <section>
                <SectionTitle>Address</SectionTitle>
                <div className="space-y-4">
                  <div>
                    <Label>Address</Label>
                    <Input
                      value={values.companyAddress}
                      onChange={handleChange("companyAddress")}
                    />
                  </div>

                  <SubGrid2>
                    <div>
                      <Label>Country</Label>
                      <SelectWrapper>
                        <Select
                          value={values.country}
                          onChange={handleChange("country")}
                        >
                          <option value="Thailand">Thailand</option>
                        </Select>
                      </SelectWrapper>
                    </div>
                    <div>
                      <Label>Province</Label>
                      <SelectWrapper>
                        <Select
                          value={values.province}
                          onChange={(e) => handleProvinceChange(e.target.value)}
                        >
                          <option value="">Select</option>
                          {provinces.map((p) => (
                            <option key={p}>{p}</option>
                          ))}
                        </Select>
                      </SelectWrapper>
                    </div>
                  </SubGrid2>

                  <SubGrid2>
                    <div>
                      <Label>District</Label>
                      <SelectWrapper>
                        <Select
                          value={values.district}
                          onChange={(e) => handleDistrictChange(e.target.value)}
                          disabled={addrLoading}
                        >
                          <option value="">Select</option>
                          {districts.map((d) => (
                            <option key={d}>{d}</option>
                          ))}
                        </Select>
                      </SelectWrapper>
                    </div>
                    <div>
                      <Label>Sub-District</Label>
                      <SelectWrapper>
                        <Select
                          value={values.subDistrict}
                          onChange={(e) =>
                            handleSubDistrictChange(e.target.value)
                          }
                          disabled={addrLoading}
                        >
                          <option value="">Select</option>
                          {subDistrictOptions.map((s) => (
                            <option key={s}>{s}</option>
                          ))}
                        </Select>
                      </SelectWrapper>
                    </div>
                  </SubGrid2>

                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <Label>Zipcode</Label>
                      <Input value={values.zipcode} readOnly />
                    </div>
                  </div>
                </div>
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
                    <PhoneInput
                      value={values.contactPhone}
                      onChange={(v) => {
                        setValues((p) => ({ ...p, contactPhone: v }));
                        setContactPhoneError(
                          v && !isValidThaiPhone(v)
                            ? "เบอร์โทรต้องเป็น 10 หลัก และขึ้นต้นด้วย 0"
                            : null
                        );
                      }}
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
          </Card>

          <div className="mt-10 flex justify-center gap-4">
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
                className="w-[100px] h-[37px] rounded-md bg-[#FF383C] hover:bg-[#E71010] text-white"
              >
                Cancel
              </button>
            )}

            <button
              type="submit"
              disabled={disableSave}
              className={`w-[100px] h-[37px] rounded-md ${
                disableSave
                  ? "bg-[#BABABA]"
                  : "bg-[#34C759] hover:bg-[#24913F] text-white"
              }`}
            >
              {isSaving ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
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
