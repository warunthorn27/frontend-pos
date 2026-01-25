import React, { useState } from "react";
import PlusIcon from "../../assets/svg/plus.svg?react";
import SearchIcon from "../../assets/svg/search.svg?react"
import PrintIcon from "../../assets/svg/print.svg?react"
import ExportIcon from "../../assets/svg/file-x.svg?react"
import DropdownArrowIcon from "../../assets/svg/dropdown-arrow2.svg?react";
import type { CustomerFormInput } from "../../types/customer";
import AddCustomer from "./components/AddCustomer";

const CustomerListPage: React.FC = () => {
  const [mode, setMode] = useState<"list" | "create">("list");

  const handleAddCustomerClick = () => {
    setMode("create");
  };

  const handleCancel = () => {
    setMode("list");
  };

  const handleConfirm = (values: CustomerFormInput) => {
    console.log("Creating customer:", values);
    setMode("list");
  };

  if (mode === "create") {
    return <AddCustomer onCancel={handleCancel} onConfirm={handleConfirm} />;
  }

  return (
    <div className="w-full">
      <h2 className="text-2xl font-regular text-[#06284B] mb-4">
        Customer List
      </h2>
      <div className="flex items-center justify-between mb-4">
  {/* Left */}
  <div className="flex gap-3">
    {/* Search */}
    <div className="flex items-center border border-[#CFCFCF] bg-white rounded-md px-3 h-[40px] w-[400px]">
      <input
        className="flex-1 bg-transparent text-sm outline-none"
        placeholder="Search"
      />
      <SearchIcon className="w-4 h-4 text-gray-400" />
    </div>

    {/* Business Type */}
    <div className="relative w-[180px]">
  <select
    className="
      h-[40px] w-full
      appearance-none
      rounded-md border border-[#CFCFCF]
      bg-white
      px-3 pr-9
      text-sm
      outline-none
      focus:border-[#2F80ED]
      
    "
  >
    <option>Business Type</option>
    <option>Individual</option>
    <option>Corporation</option>
  </select>

  {/* Custom Arrow */}
  <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
    <DropdownArrowIcon className="w-3 h-3 text-gray-500" />
  </div>
</div>
  </div>

  {/* Right */}
  <div className="flex items-center gap-3">
    <PrintIcon className="w-7 h-6 text-gray-600 cursor-pointer" />
    <ExportIcon className="w-7 h-6 text-gray-600 cursor-pointer" />

    <button
      onClick={handleAddCustomerClick}
      className="flex items-center gap-2 px-4 h-[40px] rounded-md text-sm font-medium text-white bg-[#0088FF] hover:bg-[#0574D6]"
    >
      <PlusIcon className="w-5 h-5" />
      Add Customer
    </button>
  </div>
</div>


      <div className="border shadow-sm rounded-md overflow-hidden text-sm">
        <span className="text-[#9D9D9D]"></span>
        <div className="grid grid-cols-[1fr,1fr,1fr,1fr,1fr,1fr,1fr,1fr] border-b-2 bg-[#F7F7F7] text-gray-800 font-normal">
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
          No customers found
        </div>
      </div>
    </div>
  );
};

export default CustomerListPage;
