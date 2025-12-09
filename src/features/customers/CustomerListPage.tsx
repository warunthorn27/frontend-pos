import React from "react";
import PlusIcon from "../../assets/svg/plus.svg?react";

const CustomerListPage: React.FC = () => {
  return (
    <div className="w-full">
      <h2 className="text-2xl font-regular text-[#06284B] mb-4">
        Customer List
      </h2>

      {/* filter + search + table header */}
      <div className="flex gap-4 mb-4">
        <div className="flex items-center border border-[#CFCFCF] bg-white rounded-md px-3 h-9">
          <input
            className="flex-1 bg-transparent text-xs outline-none"
            placeholder="Search"
          />
        </div>
        <button className="flex items-center justify-between gap-2 px-3 py-2 rounded-md text-sm font-regular text-white bg-[#0088FF] hover:bg-[#0574D6]">
          <PlusIcon className="w-[18px] text-white" />
          Add Customer
        </button>
      </div>

      <div className="border shadow-sm rounded-md overflow-hidden text-sm">
        <span className="text-[#9D9D9D]"></span>
        <div className="grid grid-cols-[1fr,1fr,1fr,1fr,1fr,1fr,1fr,1fr] border-b-2 bg-[#F7F7F7] text-gray-800 font-regular">
          <div className="px-4 py-4">No</div>
          <div className="px-4 py-4">Customer ID</div>
          <div className="px-4 py-4">Business Type</div>
          <div className="px-4 py-4">Company Name</div>
          <div className="px-4 py-4">Name</div>
          <div className="px-4 py-4">Email</div>
          <div className="px-4 py-4">Phone</div>
          <div className="px-4 py-4">Action</div>
        </div>
        <div className="h-96 bg-[#FAFAFA] flex items-center justify-center text-gray-500">
          No products found
        </div>
      </div>
    </div>
  );
};

export default CustomerListPage;
