import React, { useState } from "react";
import FinishedGoodsPage from "./ProductMaster";

type ProductTab = "list" | "finished" | "stone" | "semiMount" | "others";

const ProductLayout: React.FC = () => {
  const [activeProductTab, setActiveProductTab] = useState<ProductTab>("list");

  return (
    <div className="w-full">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Product</h1>

      <div className="grid grid-cols-[180px,minmax(0,1fr)] gap-6">
        <div className="text-sm text-gray-800">
          <div className="font-semibold mb-2">Product</div>
          <div className="flex flex-col rounded-md bg-gray-100 py-1">
            <button
              type="button"
              onClick={() => setActiveProductTab("list")}
              className={`text-left px-4 py-2 text-xs ${
                activeProductTab === "list"
                  ? "bg-white shadow-sm font-semibold"
                  : "hover:bg-gray-200"
              }`}
            >
              Product List
            </button>
            <button
              type="button"
              onClick={() => setActiveProductTab("finished")}
              className={`text-left px-4 py-2 text-xs ${
                activeProductTab === "finished"
                  ? "bg-white shadow-sm font-semibold"
                  : "hover:bg-gray-200"
              }`}
            >
              Product Master
            </button>
            <button
              type="button"
              onClick={() => setActiveProductTab("stone")}
              className={`text-left px-4 py-2 text-xs ${
                activeProductTab === "stone"
                  ? "bg-white shadow-sm font-semibold"
                  : "hover:bg-gray-200"
              }`}
            >
              Stone / Diamond
            </button>
            <button
              type="button"
              onClick={() => setActiveProductTab("semiMount")}
              className={`text-left px-4 py-2 text-xs ${
                activeProductTab === "semiMount"
                  ? "bg-white shadow-sm font-semibold"
                  : "hover:bg-gray-200"
              }`}
            >
              Semi-Mount
            </button>
            <button
              type="button"
              onClick={() => setActiveProductTab("others")}
              className={`text-left px-4 py-2 text-xs ${
                activeProductTab === "others"
                  ? "bg-white shadow-sm font-semibold"
                  : "hover:bg-gray-200"
              }`}
            >
              Others
            </button>
          </div>
        </div>

        <div>
          {activeProductTab === "list" && (
            <div className="rounded-3xl bg-white shadow-md px-10 py-8">
              <h2 className="text-lg font-semibold mb-4">Product List</h2>

              <div className="flex gap-4 mb-4">
                <select className="w-40 h-9 rounded-md bg-gray-200 px-3 text-xs outline-none">
                  <option value="">Select Category</option>
                </select>
                <div className="flex-1 flex items-center bg-gray-200 rounded-md px-3 h-9">
                  <input
                    className="flex-1 bg-transparent text-xs outline-none"
                    placeholder="Search"
                  />
                  <span className="text-gray-500 text-sm">🔍</span>
                </div>
              </div>

              <div className="border border-gray-300 rounded-md overflow-hidden text-xs">
                <div className="grid grid-cols-[1fr,2fr,2fr,1fr,1fr,1fr] bg-gray-400 text-white font-medium">
                  <div className="px-4 py-2">Image</div>
                  <div className="px-4 py-2">Code</div>
                  <div className="px-4 py-2">Name</div>
                  <div className="px-4 py-2">Category</div>
                  <div className="px-4 py-2">Sale Price</div>
                  <div className="px-4 py-2">Action</div>
                </div>
                <div className="h-64 bg-gray-100" />
              </div>
            </div>
          )}

          {activeProductTab === "finished" && <FinishedGoodsPage />}

          {activeProductTab === "stone" && (
            <div className="rounded-3xl bg-white shadow-md px-10 py-8 text-sm">
              Stone / Diamond (coming soon)
            </div>
          )}

          {activeProductTab === "semiMount" && (
            <div className="rounded-3xl bg-white shadow-md px-10 py-8 text-sm">
              Semi-Mount (coming soon)
            </div>
          )}

          {activeProductTab === "others" && (
            <div className="rounded-3xl bg-white shadow-md px-10 py-8 text-sm">
              Others (coming soon)
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductLayout;
