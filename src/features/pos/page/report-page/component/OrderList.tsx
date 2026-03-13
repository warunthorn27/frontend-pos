import OrderCard from "./OrderCard";
import type { OrderReportItem } from "../../../../../types/pos/report";

type TabMode = "Sell" | "Custom" | "Repair";

interface Props {
  orders: OrderReportItem[];
  loading: boolean;
  expandedRows: Set<string>;
  toggleRow: (id: string) => void;
  activeTab: TabMode;
}

const OrderList = ({
  orders,
  loading,
  expandedRows,
  toggleRow,
  activeTab,
}: Props) => {
  if (loading && orders.length === 0) {
    return (
      <div className="py-20 text-center text-gray-400 font-light">
        Loading reports...
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="py-20 text-center text-gray-400 font-light border-2 border-dashed border-gray-100 rounded-xl bg-white/50">
        No reports found for the selected filters.
      </div>
    );
  }

  return (
    <div className="space-y-4 pb-10">
      {orders.map((order) => (
        <OrderCard
          key={order._id}
          order={order}
          isExpanded={expandedRows.has(order._id)}
          toggleRow={toggleRow}
          activeTab={activeTab}
        />
      ))}
    </div>
  );
};

export default OrderList;
