import React from "react";
import uploadImage from "../../assets/svg/upload-image.svg";

const StoneDiamondPage: React.FC = () => {
  return (
    <div className="w-full">
      <h2 className="text-2xl font-regular text-[#06284B] mb-[15px]">
        Stone / Diamond
      </h2>
      <div className="max-w-7xl mx-auto rounded-md bg-[#FAFAFA] shadow-md px-10 py-8">
        <div className="rounded-2xl border-width border border-gray-300 bg-white px-6 py-5">
          <div className="grid grid-cols-[260px,minmax(0,1.6fr)] gap-8 text-sm text-gray-800">
            <div className="flex justify-start">
              <div className="w-64 h-52 rounded-md border-2 border-dashed border-[#0088FF] bg-[#F7FBFF] flex flex-col items-center justify-center text-[11px] text-[#545454]">
                <div className="mb-3 text-3xl">
                  <img
                    src={uploadImage}
                    alt=""
                    className="width-[50px] height-[50px]"
                  />
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

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block mb-1 text-sm font-regularedium">
                    Product Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    className="w-full h-9 rounded-md border border-[#CFCFCF] bg-white px-3 text-sm outline-none"
                    type="text"
                  />
                </div>

                <div>
                  <label className="block mb-1 text-sm font-regularedium">
                    Code <span className="text-red-500">*</span>
                  </label>
                  <input
                    className="w-full h-9 rounded-md border border-[#CFCFCF] bg-white px-3 text-sm outline-none"
                    type="text"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block mb-1 text-sm font-regularedium">
                    Description
                  </label>
                  <textarea className="w-full h-28 rounded-md border border-[#CFCFCF] bg-white px-3 py-2 text-sm outline-none resize-none" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-[2fr,1.2fr] gap-6 text-sm text-gray-800">
          <div className="rounded-2xl border border-gray-300 bg-white px-6 py-5">
            <div className="grid grid-cols-3 gap-x-6 gap-y-4">
              <div>
                <label className="block mb-1 text-sm font-regularedium">
                  Stone Name <span className="text-red-500">*</span>
                </label>
                <select className="w-full h-9 rounded-md border border-[#CFCFCF] bg-white px-3 text-sm"></select>
              </div>

              <div>
                <label className="block mb-1 text-sm font-regularedium">
                  Shape <span className="text-red-500">*</span>
                </label>
                <select className="w-full h-9 rounded-md border border-[#CFCFCF] bg-white px-3 text-sm"></select>
              </div>

              <div>
                <label className="block mb-1 text-sm font-regularedium">
                  Size <span className="text-red-500">*</span>
                </label>
                <input
                  className="w-full h-9 rounded-md border border-[#CFCFCF] bg-white px-3 text-sm outline-none"
                  type="text"
                />
              </div>

              <div>
                <label className="block mb-1 text-sm font-regularedium">Color</label>
                <input
                  className="w-full h-9 rounded-md border border-[#CFCFCF] bg-white px-3 text-sm outline-none"
                  type="text"
                />
              </div>

              <div>
                <label className="block mb-1 text-sm font-regularedium">
                  Cutting
                </label>
                <select className="w-full h-9 rounded-md border border-[#CFCFCF] bg-white px-3 text-sm"></select>
              </div>

              <div>
                <label className="block mb-1 text-sm font-regularedium">
                  Quality
                </label>
                <select className="w-full h-9 rounded-md border border-[#CFCFCF] bg-white px-3 text-sm"></select>
              </div>

              <div>
                <label className="block mb-1 text-sm font-regularedium">
                  Clarity
                </label>
                <select className="w-full h-9 rounded-md border border-[#CFCFCF] bg-white px-3 text-sm"></select>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-300 bg-white px-6 py-5">
            <div className="grid grid-cols-1">
              <div>
                <label className="block mb-1 text-sm font-regularedium">
                  Nwt <span className="text-red-500">*</span>
                </label>
                <select className="w-full h-9 rounded-md border border-[#CFCFCF] bg-white px-3 text-sm" />
              </div>
            </div>

            <div className="py-4">
              <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                <div>
                  <label className="block mb-1 text-sm font-regularedium">
                    Cost <span className="text-red-500">*</span>
                  </label>
                  <input
                    className="w-full h-9 rounded-md border border-[#CFCFCF] bg-white px-3 text-sm outline-none"
                    type="text"
                  />
                </div>

                <div>
                  <label className="block mb-1 text-sm font-regularedium">
                    Sale Price <span className="text-red-500">*</span>
                  </label>
                  <input
                    className="w-full h-9 rounded-md border border-[#CFCFCF] bg-white px-3 text-sm outline-none"
                    type="text"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-10 flex justify-center gap-4">
        <button className="px-7 py-2 rounded-md bg-[#FF383C] text-sm font-normal hover:bg-[#E71010] text-white">
          Cancel
        </button>
        <button className="px-8 py-2 rounded-md bg-[#34C759] text-sm font-normal hover:bg-[#24913F] text-white">
          Save
        </button>
      </div>
    </div>
  );
};

export default StoneDiamondPage;
