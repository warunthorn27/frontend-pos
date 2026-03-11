import PosTopNav from "../../components/PosTopNav";

const PosCustomPage = () => {
  return (
    <div className="flex flex-col h-full bg-[#F8F8F8]">
      <PosTopNav onLogout={() => console.log("logout")} />

      <div className="flex flex-1 p-8 gap-6">
        {/* LEFT SIDE */}
        <div className="flex-1 bg-white border rounded-lg p-6">
          <div className="flex justify-between mb-6">
            <h2 className="text-xl text-[#06284B]">Details</h2>

            <div className="flex gap-4">
              <input
                placeholder="Enter code"
                className="w-[280px] h-10 border rounded-md px-3 text-sm"
              />

              <button className="text-sm text-gray-500">Clear All</button>
            </div>
          </div>

          {/* PRODUCT LIST MOCK */}
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b pb-4">
              <div className="flex gap-4 items-center">
                <div className="w-14 h-14 bg-gray-100 rounded"></div>

                <div>
                  <div className="text-sm font-medium">
                    Oval Pink Peach Sapphire Ring
                  </div>
                  <div className="text-xs text-gray-500">
                    RG-1001 / Oval 18K Rose Gold
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <input
                  className="w-28 border rounded px-2 py-1 text-sm"
                  defaultValue="Deposit"
                />
                <div className="flex gap-2">
                  <button>-</button>
                  <span>1</span>
                  <button>+</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="w-[420px] bg-white border rounded-lg p-6 flex flex-col justify-between">
          <div>
            <div className="flex justify-between text-sm mb-4">
              <span>#CST-213626</span>
              <span>15 Feb, 2026</span>
            </div>

            <div className="mb-6">
              <label className="text-sm">Customer</label>
              <select className="w-full border rounded mt-1 p-2">
                <option>Choose a customer</option>
              </select>
            </div>

            <div className="text-sm space-y-2">
              <div className="flex justify-between">
                <span>Total Items</span>
                <span>3</span>
              </div>

              <div className="flex justify-between">
                <span>Total Deposit</span>
                <span>฿ 30,000.00</span>
              </div>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-lg font-medium mb-4">
              <span>Grand Total</span>
              <span>฿ 30,000.00</span>
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

export default PosCustomPage;
