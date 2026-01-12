import React from "react";
import type { CompanyProfileViewData } from "../../../types/company";

interface CompanyProfileViewProps {
  data: CompanyProfileViewData;
  onEdit: () => void;
  isSaving?: boolean;
}

const Field = ({ value }: { value?: string }) => (
  <div className="h-10 w-full rounded-md border border-[#E6E6E6] bg-[#F1F1F1] px-3 text-sm flex items-center">
    {value || "-"}
  </div>
);

const Label = ({ text }: { text: string }) => (
  <label className="text-base font-normal text-black mb-1 block">
    {text} <span className="text-red-500">*</span>
  </label>
);

const PhoneView = ({ value }: { value?: string }) => (
  <div
    className="
      flex items-center h-10 w-full
      rounded-md border border-[#E6E6E6]
      bg-[#F1F1F1]
    "
  >
    {/* country code */}
    <div className="flex items-center gap-1 px-3 text-sm text-gray-500">
      +66
    </div>

    {/* divider */}
    <div className="h-10 w-px bg-[#E6E6E6]" />

    {/* phone number */}
    <div className="flex-1 px-3 text-sm text-black">{value || "-"}</div>
  </div>
);

const CompanyProfileView: React.FC<CompanyProfileViewProps> = ({
  data,
  onEdit,
  isSaving,
}) => {
  return (
    <div className="w-full">
      <div className="w-full max-w-[1600px] mx-auto h-full flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <h1 className="text-2xl font-normal text-[#084072]">
            Company Profile
          </h1>

          <button
            onClick={onEdit}
            disabled={Boolean(isSaving)}
            className="px-5 py-2 rounded-md bg-[#FFCC00] text-base font-normal text-white hover:bg-[#E6B903] flex items-center disabled:opacity-60"
          >
            Edit
          </button>
        </div>

        {/* Wrapper */}
        <div className="flex-1">
          {/* Card */}
          <div
            className="
    bg-[#FAFAFA]
    rounded-lg
    shadow
    px-8 py-8
    flex-1
    overflow-y-auto
  "
          >
            <div className="grid grid-cols-[240px,1fr,1fr] grid-rows-[auto,auto] gap-x-[50px] gap-y-[50px]">
              {/* Logo (ซ้าย span 2 แถว) */}
              <div className="row-span-2">
                <div
                  className="
    w-[240px]
    aspect-[4/3]
    rounded-[16px]
    overflow-hidden
    bg-[#F3F3F3]
    border border-[#E6E6E6]
    flex items-center justify-center
  "
                >
                  {data.companyFile ? (
                    <img
                      src={data.companyFile}
                      alt="Company Logo"
                      className="w-full h-full object-cover"
                      draggable={false}
                    />
                  ) : (
                    <div className="text-sm text-gray-400">No Logo</div>
                  )}
                </div>
              </div>

              {/* Row 1 : General (col-span-2) */}
              <section className="col-span-2">
                <h2 className="text-lg font-normal text-[#084072] mb-6">
                  General
                </h2>

                <div className="grid grid-cols-2 gap-x-[50px] gap-y-[18px]">
                  <div>
                    <Label text="Company Name" />
                    <Field value={data.companyName} />
                  </div>

                  <div>
                    <Label text="Tax ID" />
                    <Field value={data.taxId} />
                  </div>

                  <div>
                    <Label text="Email" />
                    <Field value={data.email} />
                  </div>

                  <div>
                    <Label text="Company Phone" />
                    <PhoneView value={data.phone} />
                  </div>
                </div>
              </section>

              {/* Row 2 Col 2 : Address */}
              <section>
                <h2 className="text-lg font-normal text-[#084072] mb-6">
                  Address
                </h2>

                <div className="space-y-4">
                  <div>
                    <Label text="Address" />
                    <Field value={data.companyAddress} />
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <Label text="Country" />
                      <Field value={data.country} />
                    </div>
                    <div>
                      <Label text="Province" />
                      <Field value={data.province} />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <Label text="District" />
                      <Field value={data.district} />
                    </div>
                    <div>
                      <Label text="Sub-district" />
                      <Field value={data.subDistrict} />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <Label text="Zipcode" />
                      <Field value={data.zipcode} />
                    </div>
                  </div>
                </div>
              </section>

              {/* Row 2 Col 3 : Contact Person */}
              <section>
                <h2 className="text-lg font-normal text-[#084072] mb-6">
                  Contact Person
                </h2>

                <div className="space-y-4">
                  <div>
                    <Label text="Name" />
                    <Field value={data.contactName} />
                  </div>

                  <div>
                    <Label text="Email" />
                    <Field value={data.contactEmail} />
                  </div>

                  <div>
                    <Label text="Phone" />
                    <PhoneView value={data.contactPhone} />
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyProfileView;
