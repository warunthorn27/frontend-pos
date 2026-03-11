import { useState } from "react";
import PosTopNav from "../../components/PosTopNav";

interface SellItem {
  id: string;
  name: string;
  code: string;
  price: number;
  originalPrice?: number;
  qty: number;
  discount: number;
  image?: string;
}

const mockItems: SellItem[] = [
  {
    id: "1",
    name: "Ruby Ring",
    code: "ER-1001 / Ruby 18K Rose Gold / 18mm",
    price: 22400,
    originalPrice: 28000,
    qty: 1,
    discount: 20,
  },
  {
    id: "2",
    name: "Opal Blossom Elegance Ring",
    code: "ER-1001 / Opal 18K Rose Gold 14mm / 18mm",
    price: 16000,
    qty: 1,
    discount: 0,
  },
];

const PosSellPage = () => {
  const [items, setItems] = useState<SellItem[]>(mockItems);

  const clearAll = () => {
    setItems([]);
  };

  const subtotal = items.reduce((sum, i) => sum + i.price * i.qty, 0);
  const tax = subtotal * 0.07;
  const grandTotal = subtotal + tax;

  return (
    <div className="flex flex-col h-full bg-[#F8F8F8]">
      <PosTopNav onLogout={() => console.log("logout")} />

      <div className="flex flex-1 p-8 gap-6">
        {/* LEFT SIDE */}
        <div className="flex-1 bg-white border rounded-lg p-6">
          {/* HEADER */}
          <div className="flex justify-between mb-6">
            <h2 className="text-xl text-[#06284B]">Details</h2>

            <div className="flex items-center gap-4">
              <input
                placeholder="Enter code"
                className="flex items-center border border-[#CFCFCF] bg-white rounded-md px-3 h-[40px] w-[400px] focus-within:border-[#005AA7]"
              />

              <button
                onClick={clearAll}
                className="text-lg text-[#2A2A2A] hover:underline"
              >
                Clear All
              </button>
            </div>
          </div>

          {/* EMPTY STATE */}
          {items.length === 0 && (
            <div className="flex flex-col items-center justify-center h-[400px] text-center">
              <img src="/empty-pos.svg" className="w-[140px] opacity-40 mb-6" />

              <div className="text-[#06284B] text-lg font-medium">
                No items added yet
              </div>

              <div className="text-sm text-gray-500">
                Add items to start the order.
              </div>
            </div>
          )}

          {/* ITEMS */}
          {items.length > 0 && (
            <div className="space-y-6">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between border-b pb-4"
                >
                  <div className="flex gap-4 items-center">
                    <div className="w-16 h-16 bg-gray-100 rounded"></div>

                    <div>
                      <div className="text-sm font-medium">{item.name}</div>

                      <div className="text-xs text-gray-500">{item.code}</div>

                      <div className="text-sm mt-1">
                        ฿ {item.price.toLocaleString()}
                        {item.originalPrice && (
                          <span className="text-gray-400 line-through ml-2">
                            ฿ {item.originalPrice.toLocaleString()}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* ACTIONS */}
                  <div className="flex items-center gap-4">
                    <div className="border px-3 py-1 text-xs rounded">
                      {item.discount}%
                    </div>

                    <div className="flex items-center gap-2">
                      <button className="w-7 h-7 border rounded">-</button>
                      <span>{item.qty}</span>
                      <button className="w-7 h-7 border rounded">+</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT SIDE */}
        <div className="w-[420px] bg-white border rounded-lg p-6 flex flex-col justify-between">
          <div>
            <div className="flex justify-between text-sm mb-4">
              <span>#SA-213626</span>
              <span>15 Feb, 2026</span>
            </div>

            <div className="mb-6">
              <label className="text-sm">Customer *</label>

              <select className="w-full border rounded mt-1 p-2">
                <option>Choose a customer</option>
              </select>
            </div>

            <div className="text-sm space-y-3">
              <div className="flex justify-between">
                <span>Total Items</span>
                <span>{items.length}</span>
              </div>

              <div className="flex justify-between">
                <span>Sub Total</span>
                <span>฿ {subtotal.toLocaleString()}</span>
              </div>

              <div className="flex justify-between text-red-500">
                <span>Discount</span>
                <span>0.00</span>
              </div>

              <div className="flex justify-between">
                <span>Tax (7%)</span>
                <span>฿ {tax.toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-lg font-medium mb-4">
              <span>Grand Total</span>
              <span>฿ {grandTotal.toLocaleString()}</span>
            </div>

            <button className="w-full h-11 bg-[#2E5B9A] text-white rounded-md">
              Finish Order
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PosSellPage;
