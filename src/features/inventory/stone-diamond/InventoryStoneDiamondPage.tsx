import { useState } from "react";
import ListToolbar from "../../../component/ui/ListToolbar";
import InventoryTable from "../components/InventoryTable";

export default function InventoryStoneDiamondPage() {
  const [search, setSearch] = useState("");
  const [dateRange, setDateRange] = useState("");
  const [status, setStatus] = useState("");

  return (
    <div>
      <h1 className="text-2xl font-normal mb-6 text-[#06284B]">
        Inventory Stone / Diamond List
      </h1>

      <ListToolbar
        search={search}
        onSearchChange={setSearch}
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
        status={status}
        onStatusChange={setStatus}
        onAddClick={() => {}}
      />

      <InventoryTable />
    </div>
  );
}
