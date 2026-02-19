import React, { useEffect, useState } from "react";
import AddCustomer from "../create/AddCustomer";
import CustomerListToolbar from "./CustomerListToolbar";
import CustomerTable from "./CustomerTable";
import {
  mapCustomerResponseToListItem,
  type CustomerListItem,
} from "../../../types/customer";
import { customerService } from "../../../services/customer";

const CustomerListPage: React.FC = () => {
  const [mode, setMode] = useState<"list" | "create">("list");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [customers, setCustomers] = useState<CustomerListItem[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [businessType, setBusinessType] = useState<string>();

  // Hooks ต้องอยู่ก่อน return เสมอ
  useEffect(() => {
    if (mode !== "list") return;

    const load = async () => {
      try {
        setLoading(true);

        const res = await customerService.listCustomers(
          page,
          pageSize,
          "",
          businessType,
        );
        const mapped = res.data.map(mapCustomerResponseToListItem);

        setCustomers(mapped);
        setTotal(res.total);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [page, pageSize, mode, businessType]);

  // conditional return AFTER hooks
  if (mode === "create") {
    if (mode === "create") {
      return (
        <AddCustomer
          onCancel={() => setMode("list")}
          onConfirm={async (values) => {
            try {
              setLoading(true);
              await customerService.createCustomer(values); // ยิง API จริง
              setMode("list"); // กลับหน้า list
            } catch (err) {
              console.error(err);
            } finally {
              setLoading(false);
            }
          }}
        />
      );
    }
  }

  return (
    <div className="w-full">
      <h2 className="text-2xl font-regular text-[#06284B] mb-4">
        Customer List
      </h2>

      <CustomerListToolbar
        onAddCustomerClick={() => setMode("create")}
        businessType={businessType}
        onBusinessTypeChange={setBusinessType}
      />

      <div className="border shadow-sm rounded-md overflow-hidden text-sm bg-white">
        <CustomerTable
          data={customers}
          page={page}
          pageSize={pageSize}
          total={total}
          loading={loading}
          onPageChange={setPage}
          onPageSizeChange={setPageSize}
        />
      </div>
    </div>
  );
};

export default CustomerListPage;
