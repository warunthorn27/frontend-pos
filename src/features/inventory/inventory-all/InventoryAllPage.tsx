import { useState } from "react";
import ListToolbar from "../../../component/ui/ListToolbar";
import InventoryTable from "../components/InventoryTable";
import { CATEGORY_OPTIONS } from "../../../utils/categoryOptions";
import { useCallback } from "react";
import { exportInventoryToExcel } from "../../../services/inventory";

export default function InventoryAllPage() {
  const [search, setSearch] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [status, setStatus] = useState<string | undefined>();
  const [category, setCategory] = useState<string[]>([]);

  const handleExportExcel = useCallback(async () => {
    try {
      const fileBlob = await exportInventoryToExcel();

      const downloadUrl = window.URL.createObjectURL(fileBlob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = `Inventory_All_Export_${Date.now()}.xlsx`;
      link.click();

      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error("Inventory export failed", error);
    }
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-normal mb-6 text-[#06284B]">
        Inventory All List
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
        category={category}
        categoryOptions={CATEGORY_OPTIONS}
        showCategory
        onCategoryChange={(value) => {
          setCategory(value);
        }}
        onExportExcel={handleExportExcel}
      />

      <InventoryTable
        search={search}
        status={status}
        startDate={startDate}
        endDate={endDate}
        showCategoryColumn
        category={category}
      />
    </div>
  );
}
