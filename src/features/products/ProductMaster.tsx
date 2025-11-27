// src/pages/FinishedGoodsPage.tsx
import React from "react";

const ProductMasterPage: React.FC = () => {
  return (
    <div className="w-full">
      <h2 className="text-2xl font-semibold text-[#0053A4] mb-6">
        Product Master
      </h2>
      <div className="max-w-7xl mx-auto rounded-md bg-[#FAFAFA] shadow-md px-10 py-8">
        <div className="grid grid-cols-[minmax(0,8fr)] gap-6 text-sm text-gray-800">
          <div className="rounded-2xl border-width border border-gray-300 bg-white px-6 py-5">
            {/* ---------- TOP : IMAGE + PRODUCT INFO ---------- */}
            <div className="grid grid-cols-[260px,minmax(0,1.6fr)] gap-8 text-sm text-gray-800">
              <div className="flex">
                <div className="w-64 h-52 rounded-md border-2 border-dashed border-[#0088FF] bg-[#F7FBFF] flex flex-col items-center justify-center text-[11px] text-[#545454]">
                  <div className="mb-3 text-3xl">
                    <svg
                      width="50"
                      height="50"
                      viewBox="0 0 50 50"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M8.89954 43.1831L22.6423 29.4404C23.4673 28.6154 23.88 28.2027 24.3556 28.0483C24.7739 27.9123 25.2248 27.9123 25.6431 28.0483C26.1187 28.2027 26.5314 28.6154 27.3564 29.4404L41.0075 43.0915M29.166 31.25L35.1423 25.2737C35.9673 24.4487 36.38 24.036 36.8556 23.8817C37.2739 23.7456 37.7248 23.7456 38.1431 23.8817C38.6187 24.036 39.0314 24.4487 39.8564 25.2737L45.8327 31.25M20.8327 18.75C20.8327 21.0512 18.9672 22.9167 16.666 22.9167C14.3648 22.9167 12.4993 21.0512 12.4993 18.75C12.4993 16.4488 14.3648 14.5833 16.666 14.5833C18.9672 14.5833 20.8327 16.4488 20.8327 18.75ZM14.166 43.75H35.8327C39.3331 43.75 41.0831 43.75 42.4202 43.0687C43.5962 42.4696 44.5523 41.5135 45.1514 40.3375C45.8327 39.0004 45.8327 37.2504 45.8327 33.75V16.25C45.8327 12.7497 45.8327 10.9995 45.1514 9.66256C44.5523 8.48654 43.5962 7.53042 42.4202 6.93121C41.0831 6.25 39.3331 6.25 35.8327 6.25H14.166C10.6657 6.25 8.91552 6.25 7.57858 6.93121C6.40256 7.53042 5.44643 8.48654 4.84722 9.66256C4.16602 10.9995 4.16602 12.7497 4.16602 16.25V33.75C4.16602 37.2504 4.16602 39.0004 4.84722 40.3375C5.44643 41.5135 6.40256 42.4696 7.57858 43.0687C8.91552 43.75 10.6657 43.75 14.166 43.75Z"
                        stroke="#3F3F3F"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                  </div>
                  <p className="mb-1 text-center text-[10px]">
                    Drop your image here, or select
                    <br />
                    <span className="text-[#0088FF] font-normal cursor-pointer">
                      Click to browse
                    </span>
                    <br />
                    <span>JPG, JPEG, PNG (Max 1200×1200 px)</span>
                  </p>
                </div>
              </div>

              {/* กลาง: Product Name + Description */}
              <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                <div className="space-y-4">
                  <div>
                    <label className="block mb-1 text-xs font-medium">
                      Product Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      className="w-full h-9 rounded-md border border-[#CFCFCF] bg-white px-3 text-xs outline-none"
                      type="text"
                    />
                  </div>

                  <div>
                    <label className="block mb-1 text-xs font-medium">
                      Description
                    </label>
                    <textarea className="w-full h-28 rounded-md border border-[#CFCFCF] bg-white px-3 py-2 text-xs outline-none resize-none" />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block mb-1 text-xs font-medium">
                      Code <span className="text-red-500">*</span>
                    </label>
                    <input
                      className="w-full h-9 rounded-md border border-[#CFCFCF] bg-white px-3 text-xs outline-none"
                      type="text"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block mb-1 text-xs font-medium">
                        Item Type <span className="text-red-500">*</span>
                      </label>
                      <select className="w-full h-9 rounded-md border border-[#CFCFCF] bg-white px-3 text-xs outline-none">
                        <option value=""></option>
                      </select>
                    </div>
                    <div>
                      <label className="block mb-1 text-xs font-medium">
                        Product Size <span className="text-red-500">*</span>
                      </label>
                      <input
                        className="w-full h-9 rounded-md border border-[#CFCFCF] bg-white px-3 text-xs outline-none"
                        type="text"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block mb-1 text-xs font-medium">
                        Metal <span className="text-red-500">*</span>
                      </label>
                      <select className="w-full h-9 rounded-md border border-[#CFCFCF] bg-white px-3 text-xs outline-none">
                        <option value=""></option>
                      </select>
                    </div>
                    <div>
                      <label className="block mb-1 text-xs font-medium">
                        Metal Color
                      </label>
                      <input
                        className="w-full h-9 rounded-md border border-[#CFCFCF] bg-white px-3 text-xs outline-none"
                        type="text"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ---------- BOTTOM : GROUPED CARDS ---------- */}
        <div className="mt-8 grid grid-cols-[minmax(0,2fr),minmax(0,1.2fr)] gap-6 text-sm text-gray-800">
          <div className="rounded-2xl border border-gray-300 bg-white px-6 py-5">
            <div className="grid grid-cols-3 gap-x-6 gap-y-4">
              <div>
                <label className="block mb-1 text-xs font-medium">
                  Stone Name <span className="text-red-500">*</span>
                </label>
                <select className="w-full h-9 rounded-md border border-[#CFCFCF] bg-white px-3 text-xs outline-none">
                  <option value=""></option>
                </select>
              </div>
              <div>
                <label className="block mb-1 text-xs font-medium">
                  Shape <span className="text-red-500">*</span>
                </label>
                <select className="w-full h-9 rounded-md border border-[#CFCFCF] bg-white px-3 text-xs outline-none">
                  <option value=""></option>
                </select>
              </div>
              <div>
                <label className="block mb-1 text-xs font-medium">
                  Size <span className="text-red-500">*</span>
                </label>
                <input
                  className="w-full h-9 rounded-md border border-[#CFCFCF] bg-white px-3 text-xs outline-none"
                  type="text"
                />
              </div>

              <div>
                <label className="block mb-1 text-xs font-medium">Color</label>
                <input
                  className="w-full h-9 rounded-md border border-[#CFCFCF] bg-white px-3 text-xs outline-none"
                  type="text"
                />
              </div>
              <div>
                <label className="block mb-1 text-xs font-medium">
                  Cutting
                </label>
                <select className="w-full h-9 rounded-md border border-[#CFCFCF] bg-white px-3 text-xs outline-none">
                  <option value=""></option>
                </select>
              </div>
              <div>
                <label className="block mb-1 text-xs font-medium">
                  Quality
                </label>
                <select className="w-full h-9 rounded-md border border-[#CFCFCF] bg-white px-3 text-xs outline-none">
                  <option value=""></option>
                </select>
              </div>

              <div>
                <label className="block mb-1 text-xs font-medium">
                  Clarity
                </label>
                <select className="w-full h-9 rounded-md border border-[#CFCFCF] bg-white px-3 text-xs outline-none">
                  <option value=""></option>
                </select>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-300 bg-white px-6 py-5">
            <div className="grid grid-cols-2 gap-x-6 gap-y-4">
              <div>
                <label className="block mb-1 text-xs font-medium">
                  Gwt <span className="text-red-500">*</span>
                </label>
                <select className="w-full h-9 rounded-md border border-[#CFCFCF] bg-white px-3 text-xs outline-none" />
              </div>
              <div>
                <label className="block mb-1 text-xs font-medium">
                  Nwt <span className="text-red-500">*</span>
                </label>
                <select className="w-full h-9 rounded-md border border-[#CFCFCF] bg-white px-3 text-xs outline-none" />
              </div>
              <div>
                <label className="block mb-1 text-xs font-medium">
                  Cost <span className="text-red-500">*</span>
                </label>
                <input
                  className="w-full h-9 rounded-md border border-[#CFCFCF] bg-white px-3 text-xs outline-none"
                  type="number"
                  defaultValue={0}
                />
              </div>
              <div>
                <label className="block mb-1 text-xs font-medium">
                  Sale Price <span className="text-red-500">*</span>
                </label>
                <input
                  className="w-full h-9 rounded-md border border-[#CFCFCF] bg-white px-3 text-xs outline-none"
                  type="number"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-10 flex justify-center gap-4">
        <button
          type="button"
          className="px-8 py-2 rounded-md bg-[#FF383C] text-xs font-normal hover:bg-red-500 text-white"
        >
          Cancel
        </button>
        <button
          type="button"
          className="px-8 py-2 rounded-md bg-[#34C759] text-xs font-normal hover:bg-[#2eb650] text-white"
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default ProductMasterPage;
