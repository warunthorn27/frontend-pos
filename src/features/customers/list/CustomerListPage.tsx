import React, { useEffect, useState } from "react";
import AddCustomer from "../create/AddCustomer";
import CustomerListToolbar from "./CustomerListToolbar";
import CustomerTable from "./CustomerTable";
import {
  mapCustomerResponseToListItem,
  type CustomerListItem,
  type CustomerResponse,
  type UpdateCustomerPayload,
} from "../../../types/customer";
import { customerService } from "../../../services/customer";
import CustomerDetailModal from "./CustomerDetailModal";
import type { CountryCode } from "../../../component/phoneInput/CountryPhoneInput";

const CustomerListPage: React.FC = () => {
  const [mode, setMode] = useState<"list" | "create">("list");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [customers, setCustomers] = useState<CustomerListItem[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [businessType, setBusinessType] = useState<string>();
  const [customerDetail, setCustomerDetail] = useState<CustomerResponse>();
  const [detailOpen, setDetailOpen] = useState(false);
  const [country, setCountry] = useState<CountryCode>("TH");
  const [modalMode, setModalMode] = useState<"view" | "edit">("view");
  const [search, setSearch] = useState("");

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
    return (
      <AddCustomer
        country={country}
        onCountryChange={setCountry}
        onCancel={() => setMode("list")}
        onConfirm={async (values) => {
          try {
            setLoading(true);

            console.log("===== CREATE CUSTOMER =====");
            console.log("FORM VALUES →", values);
            console.log("COUNTRY →", country);

            const res = await customerService.createCustomer(values, country);

            console.log("API RESPONSE →", res);
            console.log("===========================");
            setMode("list");
          } catch (err) {
            console.error(err);
          } finally {
            setLoading(false);
          }
        }}
      />
    );
  }

  const handleRowClick = async (id: string) => {
    try {
      setLoading(true);

      console.log("===== GET ONE CUSTOMER =====");
      console.log("CLICKED ID →", id);

      const res = await customerService.getCustomer(id);

      console.log("FULL RESPONSE →", res);
      console.log("CUSTOMER DATA →", res.data);
      console.log("============================");

      setCustomerDetail(res.data);
      setModalMode("view");
      setDetailOpen(true);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (payload: UpdateCustomerPayload) => {
    if (!customerDetail) return;

    try {
      setLoading(true);

      console.log("UPDATE PAYLOAD →", payload);

      const res = await customerService.updateCustomer(
        customerDetail._id,
        payload,
      );

      console.log("API RESPONSE →", res);

      setCustomerDetail(res.data); // อัปเดต UI ทันที
      setModalMode("view");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <h2 className="text-2xl font-regular text-[#06284B] mb-4">
        Customer List
      </h2>

      <CustomerListToolbar
        search={search}
        onSearchChange={setSearch}
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
          onRowClick={handleRowClick}
        />
      </div>

      <CustomerDetailModal
        open={detailOpen}
        mode={modalMode}
        data={customerDetail}
        onClose={() => setDetailOpen(false)}
        onEdit={() => setModalMode("edit")}
        onSave={handleSave}
      />
    </div>
  );
};

export default CustomerListPage;
