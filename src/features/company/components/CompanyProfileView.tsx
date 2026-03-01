import React from "react";
import type { CompanyProfileViewData } from "../../../types/company";
import EditIcon from "../../../assets/svg/edit.svg?react";
import {
  COUNTRIES,
  detectCountryFromPhone,
  formatPhoneForDisplay,
} from "../../../utils/phone";

interface CompanyProfileViewProps {
  data: CompanyProfileViewData;
  onEdit: () => void;
  isSaving?: boolean;
}

const Field = ({ value }: { value?: string }) => (
  <div className="h-[38px] w-full rounded-md border border-[#E6E6E6] bg-[#F1F1F1] px-3 text-sm flex items-center">
    {value || "-"}
  </div>
);

const Label = ({ text }: { text: string }) => (
  <label className="text-base font-normal text-black mb-2 block">
    {text} <span className="text-red-500">*</span>
  </label>
);

const PhoneView = ({ value }: { value?: string }) => {
  if (!value) return <Field value="-" />;

  const country = detectCountryFromPhone(value);
  const dial = COUNTRIES.find((c) => c.code === country)?.dial;

  const local = formatPhoneForDisplay(value);

  return (
    <div className="flex items-center h-[38px] w-full rounded-md border border-[#E6E6E6] bg-[#F1F1F1]">
      <div className="px-3 text-sm text-black">{dial}</div>
      <div className="h-[38px] w-px bg-[#E6E6E6]" />
      <div className="flex-1 px-3 text-sm text-black">{local}</div>
    </div>
  );
};

const CompanyProfileView: React.FC<CompanyProfileViewProps> = ({
  data,
  onEdit,
  isSaving,
}) => {
  return (
    <div className="w-full h-full flex flex-col overflow-hidden">
      <div className="w-full max-w-[1690px] mx-auto flex flex-col flex-1 min-h-0">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <h1 className="text-2xl font-normal text-[#06284B]">
            Company Profile
          </h1>

          <button
            onClick={onEdit}
            disabled={Boolean(isSaving)}
            className="px-3 py-1.5 text-base text-black bg-white border border-[#CFCFCF] 
                  hover:bg-[#F1F1F1] rounded-md flex items-center gap-2"
          >
            <EditIcon className="w-5 h-5" />
            Edit
          </button>
        </div>

        {/* Wrapper */}
        <div className="flex-1 min-h-0 flex flex-col">
          {/* Card */}
          <div className="bg-[#FAFAFA] rounded-lg shadow flex-1 min-h-0 flex flex-col overflow-hidden">
            {/* CONTENT (scroll) */}
            <div className="flex-1 min-h-0 overflow-y-auto hide-scrollbar px-8 py-8">
              <div className="grid grid-cols-[240px,1fr,1fr] grid-rows-[auto,auto] gap-x-[50px] gap-y-[50px]">
                {/* Logo (ซ้าย span 2 แถว) */}
                <div className="row-span-2">
                  <div
                    className=" w-[240px] aspect-[4/3] rounded-lg overflow-hidden bg-[#F3F3F3] border border-[#E6E6E6] 
                    flex items-center justify-center"
                  >
                    {data.companyFile ? (
                      <img
                        src={data.companyFile}
                        alt="Company Logo"
                        className="w-full h-full object-contain"
                        draggable={false}
                      />
                    ) : (
                      <div className="text-sm text-gray-400">No Logo</div>
                    )}
                  </div>
                </div>

                {/* Row 1 : General (col-span-2) */}
                <section className="col-span-2">
                  <h2 className="text-lg font-normal text-[#06284B] mb-6">
                    General
                  </h2>

                  <div className="grid grid-cols-2 gap-x-[50px] gap-y-[18px]">
                    <div>
                      <Label text="Company Name" />
                      <Field value={data.companyName} />
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <Label text="Tax ID" />
                        <Field value={data.taxId} />
                      </div>

                      <div>
                        <Label text="Currency" />
                        <Field value={data.currency} />
                      </div>
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
                  <h2 className="text-lg font-normal text-[#06284B] mb-6">
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
                  <h2 className="text-lg font-normal text-[#06284B] mb-6">
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
    </div>
  );
};

export default CompanyProfileView;
