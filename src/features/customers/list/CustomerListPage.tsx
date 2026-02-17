import React, { useState } from "react";
import type { CustomerFormInput } from "../../../types/customer";
import AddCustomer from "../create/AddCustomer";
import CustomerListToolbar from "./CustomerListToolbar";
import CustomerTable from "./CustomerTable";
import CustomerTablePagination from "./CustomerTablePagination";

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

      <CustomerListToolbar onAddCustomerClick={handleAddCustomerClick} />

      <div className="border shadow-sm rounded-md overflow-hidden text-sm">
        <CustomerTable data={[]} page={1} pageSize={10} />
        <CustomerTablePagination
          page={1}
          pageSize={10}
          total={0}
          onPageChange={() => {}}
          onPageSizeChange={() => {}}
        />
      </div>
    </div>
  );
};

export default CustomerListPage;
