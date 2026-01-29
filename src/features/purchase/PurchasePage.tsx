import PurchaseInfoCard from "./components/PurchaseInfoCard";
import PurchaseItemsTable from "./components/PurchaseItemsTable";

export default function PurchasePage() {
  return (
    <div className="w-full h-full flex flex-col overflow-hidden">
      <div className="w-full max-w-[1690px] mx-auto flex flex-col flex-1 min-h-0">
        <div className="flex items-center justify-between mb-5">
          <h1 className="text-2xl font-normal text-[#084072]">Purchase</h1>
        </div>

        <div className="w-full h-full flex flex-col rounded-md bg-gray-50">
          {/* Main Content */}
          <div className="flex-1 px-8 pt-6 pb-24">
            <div className="max-w-[1600px] space-y-8">
              {/* Purchase info (no card) */}
              <PurchaseInfoCard />

              {/* Items */}
              <PurchaseItemsTable />

              {/* Note */}
              <div className="max-w-xl">
                <label className="block text-sm font-medium mb-2">Note</label>
                <textarea
                  rows={4}
                  className="w-full border rounded-md px-3 py-2 text-sm"
                />
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className=" px-8 py-4">
            <div className="max-w-[1600px] flex justify-center gap-3">
              <button className="px-4 py-2 border rounded-md">Cancel</button>
              <button className="px-4 py-2 bg-gray-300 text-gray-600 rounded-md">
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
