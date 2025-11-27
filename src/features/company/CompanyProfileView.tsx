import React from "react";
import type { CompanyFormValues } from "./CompanyForm";

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
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold text-[#0053A4]">
            Company Profile
          </h1>
          <button
            onClick={onEdit}
            className="px-6 py-2 rounded-md bg-[#FFCC00] text-xs font-normal text-white hover:bg-[#f8c704] flex items-center gap-2"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 23 23"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M20.6747 0.915291C19.4543 -0.305095 17.4756 -0.305099 16.2552 0.915291L1.50775 15.6628C1.0715 16.0991 0.774136 16.6547 0.653146 17.2596L0.0416151 20.3173C-0.249935 21.775 1.03531 23.0603 2.49306 22.7687L5.55071 22.1572C6.15568 22.0362 6.7113 21.7389 7.14755 21.3026L21.895 6.55509C23.1154 5.33471 23.1154 3.35607 21.895 2.13568L20.6747 0.915291ZM17.7283 2.38843C18.1352 1.98164 18.7947 1.98164 19.2016 2.38843L20.4219 3.60882C20.8287 4.01561 20.8287 4.67516 20.4219 5.08196L17.639 7.86486L14.9455 5.17133L17.7283 2.38843ZM13.4723 6.64448L2.98089 17.1359C2.83547 17.2814 2.73635 17.4666 2.69602 17.6682L2.08449 20.7258L5.14214 20.1143C5.34379 20.074 5.529 19.9749 5.67442 19.8295L16.1658 9.338L13.4723 6.64448Z"
                fill="white"
              />
            </svg>
            Edit
          </button>
        </div>

        {/* กรอบขาวหลัก แบบรูปที่ 3 */}
        <div className="rounded-lg bg-[#F7F7F7] shadow-md px-16 py-12">
          <div className="grid grid-cols-[160px,minmax(0,1fr)] gap-y-8 gap-x-10 text-sm text-gray-800">
            {/* General */}
            <div className="font-semibold flex items-start pt-1">General :</div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-xs mb-1">Company Name<span className="text-red-500"> *</span></div>
                <div className="h-9 rounded-md bg-white px-3 text-xs flex items-center">
                  {data.companyName}
                </div>
              </div>
              <div>
                <div className="text-xs mb-1">Tax ID<span className="text-red-500"> *</span></div>
                <div className="h-9 rounded-md bg-white px-3 text-xs flex items-center">
                  {data.taxId}
                </div>
              </div>
              <div>
                <div className="text-xs mb-1">Email<span className="text-red-500"> *</span></div>
                <div className="h-9 rounded-md bg-white px-3 text-xs flex items-center">
                  {data.email}
                </div>
              </div>
              <div>
                <div className="text-xs mb-1">Phone<span className="text-red-500"> *</span></div>
                <div className="h-9 rounded-md bg-white px-3 text-xs flex items-center">
                  {data.phone}
                </div>
              </div>
            </div>

            {/* Address */}
            <div className="font-semibold flex items-start pt-1">Address :</div>
            <div className="space-y-4">
              <div>
                <div className="text-xs mb-1">Company Address<span className="text-red-500"> *</span></div>
                <div className="h-9 rounded-md bg-white px-3 text-xs flex items-center">
                  {data.companyAddress}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <div className="text-xs mb-1">Country<span className="text-red-500"> *</span></div>
                <div className="h-9 rounded-md bg-white px-3 text-xs flex items-center">
                    {data.country}
                  </div>
                </div>
                <div>
                  <div className="text-xs mb-1">Province<span className="text-red-500"> *</span></div>
                <div className="h-9 rounded-md bg-white px-3 text-xs flex items-center">
                    {data.province}
                  </div>
                </div>
                <div>
                  <div className="text-xs mb-1">District<span className="text-red-500"> *</span></div>
                <div className="h-9 rounded-md bg-white px-3 text-xs flex items-center">
                    {data.district}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <div className="text-xs mb-1">Sub-district<span className="text-red-500"> *</span></div>
                <div className="h-9 rounded-md bg-white px-3 text-xs flex items-center">
                    {data.subDistrict}
                  </div>
                </div>
                <div>
                  <div className="text-xs mb-1">Zipcode<span className="text-red-500"> *</span></div>
                <div className="h-9 rounded-md bg-white px-3 text-xs flex items-center">
                    {data.zipcode}
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Person */}
            <div className="font-semibold flex items-start pt-1">
              Contact Person :
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-xs mb-1">Name<span className="text-red-500"> *</span></div>
                <div className="h-9 rounded-md bg-white px-3 text-xs flex items-center">
                    {data.contactName}
                  </div>
                </div>
                <div>
                  <div className="text-xs mb-1">Phone<span className="text-red-500"> *</span></div>
                <div className="h-9 rounded-md bg-white px-3 text-xs flex items-center">
                    {data.contactPhone}
                  </div>
                </div>
              </div>
              <div>
                <div className="text-xs mb-1">Email<span className="text-red-500"> *</span></div>
                <div className="h-9 rounded-md bg-white px-3 text-xs flex items-center">
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
