import { useEffect, useState, useCallback } from "react";
import PosTopNav from "../../components/PosTopNav";
import InventoryTable from "../../../inventory/components/InventoryTable";
import InventoryTabs from "./components/InventoryTabs";
import { getWarehouses } from "../../../../services/warehouse";
import { CATEGORY_OPTIONS } from "../../../../utils/categoryOptions";
import ListToolbar from "../../../../component/ui/ListToolbar";
import { exportInventoryToExcel } from "../../../../services/inventory";

type TabType =
  | "all"
  | "product-master"
  | "stone-diamond"
  | "semi-mount"
  | "accessories"
  | "others";

const TAB_TITLES: Record<TabType, string> = {
  all: "Inventory All List",
  "product-master": "Inventory Product Master List",
  "stone-diamond": "Inventory Stone/Diamond List",
  "semi-mount": "Inventory Semi-Mount List",
  accessories: "Inventory Accessories List",
  others: "Inventory Other List",
};

type WarehouseMap = {
  productMaster?: string;
  stone?: string;
  semimount?: string;
  accessory?: string;
  others?: string;
};

export default function PosInventoryPage() {
  const [activeTab, setActiveTab] = useState<TabType>("all");
  const [warehouses, setWarehouses] = useState<WarehouseMap>({});

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<string | undefined>();
  const [category, setCategory] = useState<string[]>([]);
  const [loadingWarehouse, setLoadingWarehouse] = useState(true);

  useEffect(() => {
    const loadWarehouses = async () => {
      const data = await getWarehouses();

      const map: WarehouseMap = {};

      data.forEach((w: { _id: string; warehouse_type: string }) => {
        if (w.warehouse_type === "productmaster") map.productMaster = w._id;
        if (w.warehouse_type === "stone") map.stone = w._id;
        if (w.warehouse_type === "semimount") map.semimount = w._id;
        if (w.warehouse_type === "accessory") map.accessory = w._id;
        if (w.warehouse_type === "others") map.others = w._id;
      });
      console.log("WAREHOUSE DATA", data);
      setWarehouses(map);
      setLoadingWarehouse(false);
    };

    loadWarehouses();
  }, []);

  const resolveWarehouse = (): string | undefined => {
    const id =
      activeTab === "product-master"
        ? warehouses.productMaster
        : activeTab === "stone-diamond"
          ? warehouses.stone
          : activeTab === "semi-mount"
            ? warehouses.semimount
            : activeTab === "accessories"
              ? warehouses.accessory
              : activeTab === "others"
                ? warehouses.others
                : undefined;

    console.log("resolved warehouse:", activeTab, id);

    return id;
  };

  const handleExportExcel = useCallback(async () => {
    try {
      const warehouseType =
        activeTab === "product-master"
          ? "productmaster"
          : activeTab === "stone-diamond"
            ? "stone"
            : activeTab === "semi-mount"
              ? "semimount"
              : activeTab === "accessories"
                ? "accessory"
                : activeTab === "others"
                  ? "others"
                  : undefined;

      const fileBlob = await exportInventoryToExcel(warehouseType);

      const downloadUrl = window.URL.createObjectURL(fileBlob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = `Inventory_${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}_Export_${Date.now()}.xlsx`;
      link.click();

      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error("Inventory export failed", error);
    }
  }, [activeTab]);

  return (
    <div className="bg-white">
      <PosTopNav onLogout={() => console.log("logout")} />

      {/* TAB */}
      <InventoryTabs activeTab={activeTab} onChange={setActiveTab} />

      <div className="flex flex-col min-h-screen bg-[#F8F8F8]">
        <div className="px-10 py-8">
          <div className="flex items-start justify-between">
            <h2 className="text-xl font-normal text-[#06284B]">
              {TAB_TITLES[activeTab]}
            </h2>

            {/* HEADER + FILTER */}
            <ListToolbar
              align="right"
              searchPosition="last"
              search={search}
              onSearchChange={setSearch}
              status={status}
              onStatusChange={setStatus}
              category={category}
              categoryOptions={CATEGORY_OPTIONS}
              onCategoryChange={setCategory}
              showCategory={activeTab === "all"}
              onExportExcel={handleExportExcel}
            />
          </div>

          {/* TABLE */}
          <div className="mt-6">
            {loadingWarehouse ? (
              <div className="text-gray-400 text-sm">Loading inventory...</div>
            ) : (
              <InventoryTable
                key={activeTab}
                warehouseId={resolveWarehouse()}
                search={search}
                status={status}
                showCategoryColumn={activeTab === "all"}
                category={category}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
