import type { OrderReportItem } from "../../../../../types/pos/report";
import OrderItemsTable from "./OrderItemsTable";

type TabMode = "Sell" | "Custom" | "Repair";

interface Props {
  order: OrderReportItem;
  isExpanded: boolean;
  toggleRow: (id: string) => void;
  activeTab: TabMode;
}

const OrderCard = ({ order, isExpanded, toggleRow, activeTab }: Props) => {
  return (
    <div className="bg-white rounded-lg border border-[#F0F0F0] overflow-hidden shadow-sm transition-all mb-4">
      {/* Summary Row */}

      <div
        onClick={() => toggleRow(order._id)}
        className="flex items-center justify-between px-6 py-4 cursor-pointer hover:bg-gray-50/50 transition-colors"
      >
        <div className="flex items-center gap-8">
          <div
            className={`transition-transform duration-200 text-gray-400 ${
              isExpanded ? "rotate-90" : ""
            }`}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </div>

          <div className="flex items-center gap-1.5">
            <div className="px-3 py-1 bg-[#E6F4FF] rounded-md flex items-center gap-1">
              <span className="text-[#06284B] text-sm font-normal">ID :</span>

              <span className="text-[#0690F1] text-sm font-bold">
                {order.order_no}
              </span>
            </div>
          </div>

          <span className="text-[#06284B] text-sm font-light">
            {order.order_date}
          </span>

          <span className="text-[#06284B] text-sm font-light">
            {order.total_items}
          </span>

          <span className="text-[#06284B] text-sm font-normal ml-2">
            {order.customer_name}
          </span>
        </div>

        <div className="flex items-center">
          <span className="text-[#06284B] font-bold text-lg">
            ฿{" "}
            {order.header_amount.toLocaleString("en-US", {
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
          activeTab={activeTab}
        />
      )}
    </div>
  );
};

export default OrderCard;
