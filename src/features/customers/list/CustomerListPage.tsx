import React, { useState } from "react";
import type { CustomerFormInput } from "../../../types/customer";

import AddCustomer from "../create/AddCustomer";
import CustomerTable from "./CustomerTable";
import CustomerTablePagination from "./CustomerTablePagination";
import CustomerListToolbar from "./CustomerListToolbar";

type Customer = {
  id: string;
  businessType: string;
  companyName?: string;
  name: string;
  email?: string;
  phone?: string;
};

const MOCK_DATA: Customer[] = [
  {
    id: "CUS-0001",
    businessType: "Corporation",
    companyName: "Growth Company",
    name: "John Doe",
    email: "growth@example.co.th",
    phone: "0998765432",
  },
  {
    id: "CUS-0002",
    businessType: "Corporation",
    companyName: "Smith & Co",
    name: "Alice Smith",
    email: "smithandco@example.co.th",
    phone: "0912345678",
  },
];

const CustomerListPage: React.FC = () => {
  /* page mode */
  const [mode, setMode] = useState<"list" | "create">("list");

  /* table state */
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  /* handlers */
  const handleAddCustomerClick = () => setMode("create");
  const handleCancel = () => setMode("list");

  const handleConfirm = (values: CustomerFormInput) => {
    console.log("Creating customer:", values);
    setMode("list");
  };

  /* pagination logic */
  const total = MOCK_DATA.length;
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentData = MOCK_DATA.slice(startIndex, endIndex);

  /* render */
  if (mode === "create") {
    return <AddCustomer onCancel={handleCancel} onConfirm={handleConfirm} />;
  }

  return (
    <div className="w-full">
      <h2 className="text-2xl font-normal text-[#06284B] mb-6">Customer</h2>

      <CustomerListToolbar
        onAdd={handleAddCustomerClick}
        onPrint={() => console.log("print")}
        onExportExcel={() => console.log("export")}
      />

      <div className="border rounded-md overflow-hidden bg-white">
        <CustomerTable data={currentData} />

        <div className="border-t px-4 py-3">
          <CustomerTablePagination
            page={page}
            pageSize={pageSize}
            total={total}
            onPageChange={setPage}
            onPageSizeChange={setPageSize}
          />
        </div>
      </div>
    </div>
  );
};

export default CustomerListPage;
