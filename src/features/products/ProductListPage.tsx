import React from "react";

const ProductListPage: React.FC = () => {
  return (
    <div className="w-full">
      <h2 className="text-2xl font-semibold text-[#0053A4] mb-4">Product List</h2>

      {/* filter + search + table header */}
      <div className="flex gap-4 mb-4">
        <select className="w-40 h-9 rounded-md border border-[#CFCFCF] bg-white px-3 text-xs outline-none">
          <option value="">Filter</option>
        </select>
        <div className="flex-1 flex items-center border border-[#CFCFCF] bg-white rounded-md px-3 h-9">
          <input
            className="flex-1 bg-transparent text-xs outline-none"
            placeholder="Search"
          />
          <span className="text-gray-500 text-sm"></span>
        </div>
      </div>

      <div className="border shadow-sm rounded-md overflow-hidden text-xs">
        <span className="text-[#9D9D9D] text-sm"></span>
        <div className="grid grid-cols-[1fr,1fr,1fr,1fr,1fr,1fr,1fr] border-b-2 bg-[#F1F1F1] text-black font-medium">
          <div className="px-4 py-4">Product</div>
          <div className="px-4 py-4">Code</div>
          <div className="px-4 py-4">Product Name</div>
          <div className="px-4 py-4">Items / Stone Name</div>
          <div className="px-4 py-4">Category</div>
          <div className="px-4 py-4">Sale Price</div>
          <div className="px-4 py-4">Action</div>
        </div>
        <div className="h-96 bg-[#FAFAFA] flex items-center justify-center text-gray-500">
          No products found
        </div>
      </div>
    </div>
  );
};

export default ProductListPage;
