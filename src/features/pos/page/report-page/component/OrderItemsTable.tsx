import dayjs from "dayjs";
import { useDragScroll } from "../hooks/useDragScroll";
import type { OrderReportItem } from "../../../../../types/pos/report";

interface Props {
  items: OrderReportItem["items"];
  order: OrderReportItem;
}

const OrderItemsTable = ({ items, order }: Props) => {
  const { handleMouseDown } = useDragScroll();

  return (
    <div
      onMouseDown={handleMouseDown}
      className="border-t border-gray-50 bg-white relative overflow-x-auto cursor-grab [ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:display-none"
    >
      <table
        className="text-left border-collapse"
        style={{ minWidth: "3600px" }}
      >
        <thead className="bg-[#F8F9FA]">
          <tr className="text-[14px] text-[#06284B] whitespace-nowrap">
            <th className="py-3 px-6 text-center border-b border-[#EBEBEB] font-normal">#</th>
            <th className="py-3 px-6 border-b border-[#EBEBEB] font-normal">Sell ID</th>
            <th className="py-3 px-6 border-b border-[#EBEBEB] font-normal">Customer</th>
            <th className="py-3 px-6 border-b border-[#EBEBEB] font-normal">Date</th>
            <th className="py-3 px-6 text-center border-b border-[#EBEBEB] font-normal">Image</th>
            <th className="py-3 px-6 border-b border-[#EBEBEB] font-normal">Code</th>
            <th className="py-3 px-6 border-b border-[#EBEBEB] font-normal">Product Name</th>
            <th className="py-3 px-6 border-b border-[#EBEBEB] font-normal">Category</th>
            <th className="py-3 px-6 border-b border-[#EBEBEB] font-normal">Item Type</th>
            <th className="py-3 px-6 border-b border-[#EBEBEB] font-normal">Product Size</th>
            <th className="py-3 px-6 border-b border-[#EBEBEB] font-normal">Metal</th>
            <th className="py-3 px-6 border-b border-[#EBEBEB] font-normal">Metal Color</th>
            <th className="py-3 px-6 border-b border-[#EBEBEB] text-center font-normal">Gwt</th>
            <th className="py-3 px-6 border-b border-[#EBEBEB] text-center font-normal">Nwt</th>
            <th className="py-3 px-6 border-b border-[#EBEBEB] font-normal">Stone Name</th>
            <th className="py-3 px-6 border-b border-[#EBEBEB] font-normal">Shape</th>
            <th className="py-3 px-6 border-b border-[#EBEBEB] font-normal">Size</th>
            <th className="py-3 px-6 border-b border-[#EBEBEB] text-center font-normal">S.Weight</th>
            <th className="py-3 px-6 border-b border-[#EBEBEB] text-center font-normal">Color</th>
            <th className="py-3 px-6 border-b border-[#EBEBEB] text-center font-normal">Cutting</th>
            <th className="py-3 px-6 border-b border-[#EBEBEB] text-center font-normal">Quality</th>
            <th className="py-3 px-6 border-b border-[#EBEBEB] text-center font-normal">Clarity</th>
            <th className="py-3 px-6 border-b border-[#EBEBEB] text-center font-normal">Qty</th>
            <th className="py-3 px-6 border-b border-[#EBEBEB] text-center font-normal">Tax</th>
            <th className="py-3 px-6 border-b border-[#EBEBEB] text-right font-normal">Price</th>
            <th className="py-3 px-6 border-b border-[#EBEBEB] text-center font-normal">Discount</th>
            <th className="py-3 px-6 text-right border-b border-[#EBEBEB] font-normal">Amount</th>
          </tr>
        </thead>

        <tbody className="text-[14px] text-[#06284B]">
          {items.map((item, idx) => (
            <tr key={item._id} className="hover:bg-gray-50 border-b border-[#F0F0F0] whitespace-nowrap">
              <td className="py-4 px-6 text-center">{idx + 1}</td>
              <td className="py-4 px-6">{order.order_no}</td>
              <td className="py-4 px-6">{order.customer_name}</td>
              <td className="py-4 px-6">
                {item.date ? dayjs(item.date).format("DD/MM/YYYY") : "-"}
              </td>
              <td className="py-4 px-6 text-center">
                <div className="w-[35px] h-[35px] mx-auto border border-[#EBEBEB] rounded-md overflow-hidden bg-white flex items-center justify-center p-1">
                  {item.image ? (
                    <img src={item.image} alt="" className="w-full h-full object-contain" />
                  ) : (
                    <div className="w-3.5 h-3.5 border border-[#EBEBEB] rotate-45" />
                  )}
                </div>
              </td>
              <td className="py-4 px-6 uppercase">{item.code}</td>
              <td className="py-4 px-6">{item.product_name}</td>
              <td className="py-4 px-6">{item.category}</td>
              <td className="py-4 px-6">{item.item_type}</td>
              <td className="py-4 px-6">{item.product_size}</td>
              <td className="py-4 px-6">{item.metal}</td>
              <td className="py-4 px-6">{item.metal_color || "-"}</td>
              <td className="py-4 px-6 text-center">{item.gwt || 0}</td>
              <td className="py-4 px-6 text-center">{item.nwt || 0}</td>
              <td className="py-4 px-6">{item.stone_name || "-"}</td>
              <td className="py-4 px-6">{item.shape || "-"}</td>
              <td className="py-4 px-6">{item.size || "-"}</td>
              <td className="py-4 px-6 text-center">{item.s_weight || 0}</td>
              <td className="py-4 px-6 text-center">{item.color || "-"}</td>
              <td className="py-4 px-6 text-center uppercase">{item.cutting || "-"}</td>
              <td className="py-4 px-6 text-center">{item.quality || "-"}</td>
              <td className="py-4 px-6 text-center">{item.clarity || "-"}</td>
              <td className="py-4 px-6 text-center">{item.qty}</td>
              <td className="py-4 px-6 text-center">{item.tax}</td>
              <td className="py-4 px-6 text-right">
                {item.price.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                })}
              </td>
              <td className="py-4 px-6 text-center">{item.discount}</td>
              <td className="py-4 px-6 text-right">
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
