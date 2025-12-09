import React from "react";
import type { CompanyFormValues } from "./CompanyForm";
import EditIcon from "../../assets/svg/edit.svg?react";

interface CompanyProfileViewProps {
  data: CompanyFormValues;
  onEdit: () => void;
}

const CompanyProfileView: React.FC<CompanyProfileViewProps> = ({
  data,
  onEdit,
}) => {
  return (
    <div className="w-full">
      {/* ห่อหัวข้อ + card ด้วย container เดียวกัน เพื่อให้ขอบซ้ายตรงกัน */}
      <div className="max-w-7xl mx-auto">
        {/* หัวข้อ + ปุ่ม Edit อยู่นอกกรอบขาว */}
        <div className="flex items-center justify-between mb-[9px]">
          <h1 className="text-2xl font-regular text-[#06284B]">
            Company Profile
          </h1>
          <button
            onClick={onEdit}
            className="px-3 py-2 rounded-md bg-[#FFCC00] text-sm font-regular text-white hover:bg-[#E6B903] flex items-center gap-[5px]"
          >
            <EditIcon className="w-[20px] text-white" />
            Edit
          </button>
        </div>

        {/* กรอบขาวหลัก แบบรูปที่ 3 */}
        <div className="rounded-lg bg-[#FAFAFA] shadow-md px-36 py-12">
          <div className="grid grid-cols-[160px,minmax(0,1fr)] gap-y-7 gap-x-10 text-base text-black">
            {/* General */}
            <div className="font-regular flex items-start">General :</div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-xs mb-1">
                  Company Name<span className="text-red-500"> *</span>
                </div>
                <div className="h-9 rounded-md border border-gray-200 bg-[#F1F1F1] px-3 text-xs flex items-center">
                  {data.companyName}
                </div>
              </div>
              <div>
                <div className="text-xs mb-1">
                  Tax ID<span className="text-red-500"> *</span>
                </div>
                <div className="h-9 rounded-md border border-gray-200 bg-[#F1F1F1] px-3 text-xs flex items-center">
                  {data.taxId}
                </div>
              </div>
              <div>
                <div className="text-xs mb-1">
                  Email<span className="text-red-500"> *</span>
                </div>
                <div className="h-9 rounded-md border border-gray-200 bg-[#F1F1F1] px-3 text-xs flex items-center">
                  {data.email}
                </div>
              </div>
              <div>
                <div className="text-xs mb-1">
                  Phone<span className="text-red-500"> *</span>
                </div>
                <div className="h-9 rounded-md border border-gray-200 bg-[#F1F1F1] px-3 text-xs flex items-center">
                  {data.phone}
                </div>
              </div>
            </div>

            {/* Address */}
            <div className="font-regular flex items-start">Address :</div>
            <div className="space-y-4">
              <div>
                <div className="text-xs mb-1">
                  Company Address<span className="text-red-500"> *</span>
                </div>
                <div className="h-9 rounded-md border border-gray-200 bg-[#F1F1F1] px-3 text-xs flex items-center">
                  {data.companyAddress}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <div className="text-xs mb-1">
                    Country<span className="text-red-500"> *</span>
                  </div>
                  <div className="h-9 rounded-md border border-gray-200 bg-[#F1F1F1] px-3 text-xs flex items-center">
                    {data.country}
                  </div>
                </div>
                <div>
                  <div className="text-xs mb-1">
                    Province<span className="text-red-500"> *</span>
                  </div>
                  <div className="h-9 rounded-md border border-gray-200 bg-[#F1F1F1] px-3 text-xs flex items-center">
                    {data.province}
                  </div>
                </div>
                <div>
                  <div className="text-xs mb-1">
                    District<span className="text-red-500"> *</span>
                  </div>
                  <div className="h-9 rounded-md border border-gray-200 bg-[#F1F1F1] px-3 text-xs flex items-center">
                    {data.district}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <div className="text-xs mb-1">
                    Sub-district<span className="text-red-500"> *</span>
                  </div>
                  <div className="h-9 rounded-md border border-gray-200 bg-[#F1F1F1] px-3 text-xs flex items-center">
                    {data.subDistrict}
                  </div>
                </div>
                <div>
                  <div className="text-xs mb-1">
                    Zipcode<span className="text-red-500"> *</span>
                  </div>
                  <div className="h-9 rounded-md border border-gray-200 bg-[#F1F1F1] px-3 text-xs flex items-center">
                    {data.zipcode}
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Person */}
            <div className="font-regular flex items-start">
              Contact Person :
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-xs mb-1">
                    Name<span className="text-red-500"> *</span>
                  </div>
                  <div className="h-9 rounded-md border border-gray-200 bg-[#F1F1F1] px-3 text-xs flex items-center">
                    {data.contactName}
                  </div>
                </div>
                <div>
                  <div className="text-xs mb-1">
                    Phone<span className="text-red-500"> *</span>
                  </div>
                  <div className="h-9 rounded-md border border-gray-200 bg-[#F1F1F1] px-3 text-xs flex items-center">
                    {data.contactPhone}
                  </div>
                </div>
              </div>
              <div>
                <div className="text-xs mb-1">
                  Email<span className="text-red-500"> *</span>
                </div>
                <div className="h-9 rounded-md border border-gray-200 bg-[#F1F1F1] px-3 text-xs flex items-center">
                  {data.contactEmail}
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* end card */}
      </div>
    </div>
  );
};

export default CompanyProfileView;
