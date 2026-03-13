import { useDragScroll } from "../hooks/useDragScroll";
import type { OrderReportItem } from "../../../../../types/pos/report";

type TabMode = "Sell" | "Custom" | "Repair";

interface Props {
  items: OrderReportItem["items"];
  order: OrderReportItem;
  activeTab: TabMode;
}

const OrderItemsTable = ({ items, order, activeTab }: Props) => {
  const { handleMouseDown } = useDragScroll();

  return (
    <div
      onMouseDown={handleMouseDown}
      className="border-t border-gray-50 bg-white relative overflow-x-auto cursor-grab"
    >
      <table
        className="text-left border-separate border-spacing-0 min-w-full"
        style={{ width: "4200px" }}
      >
        <thead>
          <tr className="bg-[#F8F9FA] text-[13px] text-[#06284B]">
            <th className="py-3 px-6 sticky left-0 bg-[#F8F9FA]">#</th>

            <th className="py-3 px-4 sticky left-[60px] bg-[#F8F9FA]">
              Sell ID
            </th>

            <th className="py-3 px-4 sticky left-[240px] bg-[#F8F9FA]">
              Customer
            </th>

            <th className="py-3 px-4 sticky left-[460px] bg-[#F8F9FA]">Date</th>

            <th className="py-3 px-4">Code</th>
            <th className="py-3 px-4">Product Name</th>
            <th className="py-3 px-4">Category</th>
            <th className="py-3 px-4">Item Type</th>
            <th className="py-3 px-4">Product Size</th>
            <th className="py-3 px-4">Metal</th>
            <th className="py-3 px-4">Metal Color</th>
            <th className="py-3 px-4 text-right">Gwt</th>
            <th className="py-3 px-4 text-right">Nwt</th>
            <th className="py-3 px-4">Stone Name</th>
            <th className="py-3 px-4">Shape</th>
            <th className="py-3 px-4">Size</th>
            <th className="py-3 px-4 text-right">S.Weight</th>
            <th className="py-3 px-4">Color</th>
            <th className="py-3 px-4">Cutting</th>
            <th className="py-3 px-4">Quality</th>
            <th className="py-3 px-4">Clearity</th>
            <th className="py-3 px-4 text-right">Qty</th>

            {activeTab === "Custom" ? (
              <th className="py-3 px-4 text-right">Deposit</th>
            ) : (
              <>
                <th className="py-3 px-4 text-center">Tax</th>
                <th className="py-3 px-4 text-right">Price</th>
                <th className="py-3 px-4 text-center">Discount</th>
              </>
            )}

            <th className="py-3 px-6 text-right sticky right-0 bg-[#F8F9FA]">
              Amount
            </th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-50 text-[13px] text-[#06284B] font-light">
          {items.map((item, idx) => (
            <tr key={item._id} className="hover:bg-gray-50/40">
              <td className="py-4 px-6 sticky left-0 bg-white">{idx + 1}</td>

              <td className="py-4 px-4 sticky left-[60px] bg-white">
                {order.order_no}
              </td>

              <td className="py-4 px-4 sticky left-[240px] bg-white">
                {order.customer_name}
              </td>

              <td className="py-4 px-4 sticky left-[460px] bg-white">
                {item.date}
              </td>

              <td className="py-4 px-4">{item.code}</td>
              <td className="py-4 px-4">{item.product_name}</td>
              <td className="py-4 px-4">{item.category}</td>
              <td className="py-4 px-4">{item.item_type}</td>
              <td className="py-4 px-4">{item.product_size}</td>
              <td className="py-4 px-4">{item.metal}</td>
              <td className="py-4 px-4">{item.metal_color}</td>

              <td className="py-4 px-4 text-right">
                {item.gwt > 0 ? `${item.gwt} g` : "-"}
              </td>

              <td className="py-4 px-4 text-right">
                {item.nwt > 0 ? `${item.nwt} g` : "-"}
              </td>

              <td className="py-4 px-4">{item.stone_name}</td>
              <td className="py-4 px-4">{item.shape}</td>
              <td className="py-4 px-4">{item.size}</td>

              <td className="py-4 px-4 text-right">
                {item.s_weight > 0 ? `${item.s_weight} cts` : "-"}
              </td>

              <td className="py-4 px-4">{item.color}</td>
              <td className="py-4 px-4">{item.cutting}</td>
              <td className="py-4 px-4">{item.quality}</td>
              <td className="py-4 px-4">{item.clarity}</td>

              <td className="py-4 px-4 text-right">{item.qty}</td>

              {activeTab === "Custom" ? (
                <td className="py-4 px-4 text-right">
                  {(item.deposit || 0).toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                  })}
                </td>
              ) : (
                <>
                  <td className="py-4 px-4 text-center">{item.tax}</td>

                  <td className="py-4 px-4 text-right">
                    {item.price.toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                    })}
                  </td>

                  <td className="py-4 px-4 text-center">{item.discount}</td>
                </>
              )}

              <td className="py-4 px-6 text-right sticky right-0 bg-white font-medium">
                {item.amount.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                })}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrderItemsTable;
