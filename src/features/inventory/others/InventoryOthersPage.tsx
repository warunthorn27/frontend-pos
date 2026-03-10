import { useEffect, useState } from "react";
import ListToolbar from "../../../component/ui/ListToolbar";
import InventoryTable from "../components/InventoryTable";
import { getWarehouses } from "../../../services/warehouse";

export default function InventoryOthersPage() {
  const [search, setSearch] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [status, setStatus] = useState<string | undefined>();
  const [warehouseId, setWarehouseId] = useState<string>();

  useEffect(() => {
    const load = async () => {
      const warehouses = await getWarehouses();

      const others = warehouses.find(
        (w: { warehouse_type: string }) => w.warehouse_type === "others",
      );

      setWarehouseId(others?._id);
    };

    load();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-normal mb-6 text-[#06284B]">
        Inventory Others List
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
      />

      <InventoryTable warehouseId={warehouseId} />
    </div>
  );
}
