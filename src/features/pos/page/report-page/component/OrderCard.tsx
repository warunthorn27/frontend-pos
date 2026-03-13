import dayjs from "dayjs";
import type { OrderReportItem } from "../../../../../types/pos/report";
import OrderItemsTable from "./OrderItemsTable";

type TabMode = "Sell" | "Custom" | "Repair";

interface Props {
  order: OrderReportItem;
  isExpanded: boolean;
  toggleRow: (id: string) => void;
  activeTab: TabMode;
}

const OrderCard = ({ order, isExpanded, toggleRow }: Props) => {
  return (
    <div className="bg-white rounded-lg border border-[#F0F0F0] overflow-hidden shadow-sm transition-all mb-4">
      {/* Summary Row */}

      <div
        onClick={() => toggleRow(order._id)}
        className="flex items-center justify-between px-6 py-3 cursor-pointer hover:bg-gray-50/50 transition-colors"
      >
        <div className="flex items-center gap-8">
          <div
            className={`transition-transform duration-200 text-[#06284B] shrink-0 ${
              isExpanded ? "rotate-0" : "-rotate-90"
            }`}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </div>
          
          <div className="flex items-center gap-1.5 min-w-[120px]">
            <div className="px-2.5 py-1 bg-[#E6F4FF] rounded-md flex items-center gap-2">
              <span className="text-[#06284B] text-[15px] font-normal">ID :</span>
              <span className="text-[#06284B] text-[15px] font-normal uppercase">
                {order.order_no}
              </span>
            </div>
          </div>

          <span className="text-[#06284B] text-[15px] font-normal min-w-[100px]">
            {dayjs(order.order_date).format("DD/MM/YYYY")}
          </span>

          <span className="text-[#06284B] text-[15px] font-normal min-w-[30px]">
            {order.total_items}
          </span>

          <span className="text-[#06284B] text-[15px] font-normal truncate max-w-[300px]">
            {order.customer_name}
          </span>
        </div>

        <div className="flex items-center gap-1 pr-2">
          <span className="text-[#06284B] font-normal text-lg">
            ฿ {order.header_amount.toLocaleString("en-US", {
              minimumFractionDigits: 2,
            })}
          </span>
        </div>
      </div>

      {/* Detail Table */}

      {isExpanded && (
        <OrderItemsTable
          items={order.items}
          order={order}
        />
      )}
    </div>
  );
};

export default OrderCard;
