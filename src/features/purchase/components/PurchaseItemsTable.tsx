export default function PurchaseItemsTable() {
  return (
    <div className="space-y-4">
      {/* Header row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="font-medium">Items</h2>
          <button className="bg-blue-700 text-white px-4 py-2 rounded-md text-sm">
            + Select Product
          </button>
        </div>

        <button className="bg-blue-500 text-white px-4 py-2 rounded-md text-sm">
          Import
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto border rounded-md">
        <table className="w-full text-sm border-collapse">
          <thead className="bg-gray-100">
            <tr>
              {[
                "#",
                "Items",
                "S.Weight",
                "Nwt",
                "Gwt",
                "Qty",
                "Unit",
                "Cost",
                "Amount",
                "Price",
              ].map((h) => (
                <th
                  key={h}
                  className="border-b px-3 py-2 text-left font-medium"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr className="text-gray-400 bg-white">
              <td colSpan={10} className="px-3 py-10 text-center">
                No items selected
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
