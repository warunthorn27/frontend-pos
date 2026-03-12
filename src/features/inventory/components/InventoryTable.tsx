import { useEffect, useMemo, useState } from "react";
import DataTable from "../../../component/table/DataTable";
import type { InventoryItem } from "../../../types/inventory";
import type { Column } from "../../../types/table";
import { getInventory } from "../../../services/inventory";
import { mapInventoryItem } from "../../../component/mappers/inventoryMapper";
import InventoryDetailsDrawer from "./InventoryDetailsDrawer";
import { formatDateDisplay } from "../../../utils/date";
import ProductImage from "../../products/product-list/components/ProductImage";
import { getCategoryLabel } from "../../../utils/categoryOptions";
import { formatStockUnit } from "../../../utils/unit";
import { formatCurrency } from "../../../utils/number";

type Props = {
  warehouseId?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
  search?: string;
  showCategoryColumn?: boolean;
  category?: string[];
};

export default function InventoryTable({
  warehouseId,
  status,
  startDate,
  endDate,
  search,
  showCategoryColumn = false,
  category = [],
}: Props) {
  const [data, setData] = useState<InventoryItem[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [selectedStockId, setSelectedStockId] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const startIndex = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const endIndex = total === 0 ? 0 : Math.min(page * pageSize, total);

  const handleRowClick = (row: InventoryItem) => {
    setSelectedStockId(row.id);
    setDrawerOpen(true);
  };

  const baseColumns: Column<InventoryItem>[] = [
    { key: "index", header: "#", width: "70px" },

    {
      key: "image",
      header: "Image",
      width: "100px",
      render: (value, row) => (
        <div className="flex justify-center">
          <ProductImage
            imageUrl={value as string | null}
            alt={row.productName}
          />
        </div>
      ),
    },

    { key: "code", header: "Code", width: "150px" },
    { key: "productName", header: "Product Name", width: "200px" },
    {
      key: "date",
      header: "Date",
      width: "150px",
      render: (value) => formatDateDisplay(value as string),
    },
  ];

  const categoryColumn: Column<InventoryItem> = {
    key: "category",
    header: "Category",
    width: "180px",
    render: (value) => getCategoryLabel(value as string),
  };

  const otherColumns: Column<InventoryItem>[] = [
    {
      key: "qty",
      header: "Qty",
      width: "100px",
      headerClassName: "text-right",
      className: "text-right",
    },
    {
      key: "unit",
      header: "Unit",
      width: "90px",
      render: (value) => formatStockUnit(value as string),
    },
    {
      key: "cost",
      header: "Cost",
      width: "130px",
      headerClassName: "text-right",
      className: "text-right",
      render: (value) => formatCurrency(value as number),
    },
    {
      key: "amount",
      header: "Amount",
      width: "150px",
      headerClassName: "text-right",
      className: "text-right",
      render: (value) => formatCurrency(value as number),
    },
    {
      key: "salePrice",
      header: "Sale Price",
      width: "130px",
      headerClassName: "text-right",
      className: "text-right",
      render: (value) => formatCurrency(value as number),
    },

    {
      key: "status",
      header: "Status",
      width: "180px",
      render: (value) => {
        const isInStock = value === "In Stock";

        return (
          <span
            className={`inline-flex items-center gap-2 px-2.5 py-1.5 text-sm rounded-full border
          ${
            isInStock
              ? "text-black border-[#34C759]"
              : "text-black border-[#E71010]"
          }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                isInStock ? "bg-[#34C759]" : "bg-[#E71010]"
              }`}
            />
            {value}
          </span>
        );
      },
    },
  ];

  // รวม columns ตรงนี้
  const columns: Column<InventoryItem>[] = [
    ...baseColumns,
    ...(showCategoryColumn ? [categoryColumn] : []),
    ...otherColumns,
  ];

  const categoryParam = useMemo(() => category.join(","), [category]);

  useEffect(() => {
    const loadInventory = async () => {
      if (!showCategoryColumn && !warehouseId) return;

      const response = await getInventory({
        warehouse: showCategoryColumn ? undefined : warehouseId,
        page,
        limit: pageSize,
        status,
        search,
        start_date: startDate,
        end_date: endDate,
        category: categoryParam,
      });

      const mapped = (response.data ?? []).map((item, i) =>
        mapInventoryItem(item, (page - 1) * pageSize + i),
      );

      setData(mapped);
      setTotal(response.total_record);
      setTotalPages(response.total_page);
    };

    loadInventory();
  }, [
    warehouseId,
    page,
    pageSize,
    status,
    search,
    startDate,
    endDate,
    showCategoryColumn,
    categoryParam,
  ]);

  return (
    <>
      <DataTable
        columns={columns}
        data={data}
        page={page}
        pageSize={pageSize}
        total={total}
        totalPages={totalPages}
        startIndex={startIndex}
        endIndex={endIndex}
        onPageChange={setPage}
        onPageSizeChange={(size) => {
          setPageSize(size);
          setPage(1);
        }}
        onRowClick={handleRowClick}
      />

      <InventoryDetailsDrawer
        stockId={selectedStockId}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      />
    </>
  );
}
