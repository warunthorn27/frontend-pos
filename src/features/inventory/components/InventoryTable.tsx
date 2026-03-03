import DataTable from "../../../component/table/DataTable";
import type { InventoryItem } from "../../../types/inventory";
import type { Column } from "../../../types/table";

export default function InventoryTable() {
  const columns: Column<InventoryItem>[] = [
    { key: "index", header: "#", width: "70px" },

    // IMAGE COLUMN
    {
      key: "image",
      header: "Image",
      width: "100px",
      render: (value) => (
        <div className="flex items-center justify-center">
          {value ? (
            <img
              src={value as string}
              alt="product"
              className="w-10 h-10 object-cover rounded-md border"
            />
          ) : (
            <div className="w-10 h-10 bg-gray-100 rounded-md border" />
          )}
        </div>
      ),
    },

    { key: "code", header: "Code", width: "150px" },
    { key: "productName", header: "Product Name", width: "250px" },
    { key: "date", header: "Date", width: "150px" },
    { key: "unit", header: "Unit", width: "120px" },
    { key: "qty", header: "Qty", width: "120px" },
    { key: "cost", header: "Cost", width: "150px" },
    { key: "amount", header: "Amount", width: "150px" },
    { key: "salePrice", header: "Sale Price", width: "150px" },

    {
      key: "status",
      header: "Status",
      width: "150px",
      render: (value) => {
        const isInStock = value === "In Stock";

        return (
          <span
            className={`px-3 py-1 text-sm rounded-full border ${
              isInStock
                ? "text-green-600 border-green-500 bg-green-50"
                : "text-red-600 border-red-500 bg-red-50"
            }`}
          >
            {value}
          </span>
        );
      },
    },
  ];

  const mockData: InventoryItem[] = [
    {
      id: "1",
      index: 1,
      image: "/images/sample1.png",
      code: "CHN-1001",
      productName: "Diamond Pendant",
      date: "21/01/2026",
      unit: "Pcs",
      qty: 10,
      cost: 0,
      amount: 0,
      salePrice: 0,
      status: "In Stock",
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={mockData} // ใส่ mock ได้ทีหลัง
      page={1}
      pageSize={10}
      total={0}
      totalPages={0}
      startIndex={0}
      endIndex={0}
      onPageChange={() => {}}
      onPageSizeChange={() => {}}
    />
  );
}
