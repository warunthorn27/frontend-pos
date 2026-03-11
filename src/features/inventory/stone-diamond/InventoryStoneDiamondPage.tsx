import { useEffect, useState } from "react";
import ListToolbar from "../../../component/ui/ListToolbar";
import InventoryTable from "../components/InventoryTable";
import { getWarehouses } from "../../../services/warehouse";
import { useCallback } from "react";
import { exportInventoryToExcel } from "../../../services/inventory";

export default function InventoryStoneDiamondPage() {
  const [search, setSearch] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [status, setStatus] = useState<string | undefined>();
  const [warehouseId, setWarehouseId] = useState<string>();

  useEffect(() => {
    const load = async () => {
      const warehouses = await getWarehouses();

      const stoneDiamond = warehouses.find(
        (w: { warehouse_type: string }) => w.warehouse_type === "stone",
      );

      setWarehouseId(stoneDiamond?._id);
    };

    load();
  }, []);

  const handleExportExcel = useCallback(async () => {
    try {
      const fileBlob = await exportInventoryToExcel("stone");

      const downloadUrl = window.URL.createObjectURL(fileBlob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = `Inventory_StoneDiamond_Export_${Date.now()}.xlsx`;
      link.click();

      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error("Inventory export failed", error);
    }
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-normal mb-6 text-[#06284B]">
        Inventory Stone / Diamond List
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
        onAddClick={() => { }}
        onExportExcel={handleExportExcel}
      />
      <InventoryTable warehouseId={warehouseId} />
    </div>
  );
}
