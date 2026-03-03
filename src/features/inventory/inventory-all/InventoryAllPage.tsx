import { useState } from "react";
import ListToolbar from "../../../component/ui/ListToolbar";
import InventoryTable from "../components/InventoryTable";

export default function InventoryAllPage() {
  const [search, setSearch] = useState("");
  const [dateRange, setDateRange] = useState("");
  const [status, setStatus] = useState("");
  const [category, setCategory] = useState("");

  return (
    <div>
      <h1 className="text-2xl font-normal mb-6 text-[#06284B]">
        Inventory All List
      </h1>

      <ListToolbar
        search={search}
        onSearchChange={setSearch}
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
        status={status}
        onStatusChange={setStatus}
        category={category}
        onCategoryChange={setCategory}
        showCategory={true} // เฉพาะ All Page
        onAddClick={() => {}}
      />

      <InventoryTable />
    </div>
  );
}
