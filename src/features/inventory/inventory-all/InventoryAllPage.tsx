import { useState } from "react";
import ListToolbar from "../../../component/ui/ListToolbar";
import InventoryTable from "../components/InventoryTable";
import { CATEGORY_OPTIONS } from "../../../utils/categoryOptions";

export default function InventoryAllPage() {
  const [search, setSearch] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [status, setStatus] = useState<string | undefined>();
  const [category, setCategory] = useState<string[]>([]);

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
