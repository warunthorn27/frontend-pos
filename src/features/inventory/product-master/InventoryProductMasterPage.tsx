import { useEffect, useState } from "react";
import ListToolbar from "../../../component/ui/ListToolbar";
import InventoryTable from "../components/InventoryTable";
import { getWarehouses } from "../../../services/warehouse";
import { useCallback } from "react";
import { exportInventoryToExcel } from "../../../services/inventory";

export default function InventoryProductMasterPage() {
  const [search, setSearch] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [status, setStatus] = useState<string | undefined>();
  const [warehouseId, setWarehouseId] = useState<string>();

  useEffect(() => {
    const load = async () => {
      const warehouses = await getWarehouses();

      const productMaster = warehouses.find(
        (w: { warehouse_type: string }) => w.warehouse_type === "productmaster",
      );

      setWarehouseId(productMaster?._id);
    };

    load();
  }, []);

  const handleExportExcel = useCallback(async () => {
    try {
      const fileBlob = await exportInventoryToExcel("productmaster");

      const downloadUrl = window.URL.createObjectURL(fileBlob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = `Inventory_ProductMaster_Export_${Date.now()}.xlsx`;
      link.click();

      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error("Inventory export failed", error);
    }
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-normal mb-6 text-[#06284B]">
        Inventory Product Master List
      </h1>

      <ListToolbar
        search={search}
        onSearchChange={setSearch}
        startDate={startDate}
        endDate={endDate}
        onDateRangeChange={(start, end) => {
          setStartDate(start);
          setEndDate(end);
        }}
        status={status}
        onStatusChange={setStatus}
        onAddClick={() => {}}
        onExportExcel={handleExportExcel}
      />

      <InventoryTable
        warehouseId={warehouseId}
        search={search}
        status={status}
        startDate={startDate}
        endDate={endDate}
      />
    </div>
  );
}
