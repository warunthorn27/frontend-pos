import React, { useState } from "react";
import PlusIcon from "../../assets/svg/plus.svg?react";
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
    // TODO: Implement customer creation logic
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

      {/* filter + search + table header */}
      <div className="flex gap-4 mb-4">
        <div className="flex items-center border border-[#CFCFCF] bg-white rounded-md px-3 h-[44px]">
          <input
            className="flex-1 bg-transparent text-xs outline-none"
            placeholder="Search"
          />
        </div>
        <button
          onClick={handleAddCustomerClick}
          className="flex items-center w-[170px] h-[44px] justify-between gap-2 px-3 py-2 rounded-md text-base font-regular text-white bg-[#0088FF] hover:bg-[#0574D6]"
        >
          <PlusIcon className="w-6 h-6 text-white" />
          Add Customer
        </button>
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
