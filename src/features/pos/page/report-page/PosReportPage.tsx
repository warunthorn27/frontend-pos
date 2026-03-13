import { useState, useEffect, useCallback } from "react";
import PosTopNav from "../../components/PosTopNav";
import { getOrderReport } from "../../../../services/pos/posReport";
import type { OrderReportItem } from "../../../../types/pos/report";
import ReportTabs from "./component/ReportTabs";
import ReportHeader from "./component/ReportHeader";
import OrderList from "./component/OrderList";

type TabMode = "Sell" | "Custom" | "Repair";

const PosReportPage = () => {
  const [activeTab, setActiveTab] = useState<TabMode>("Sell");
  const [searchQuery, setSearchQuery] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [isExpandedAll, setIsExpandedAll] = useState(true);
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  const [orders, setOrders] = useState<OrderReportItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);

  const fetchReports = useCallback(async () => {
    setLoading(true);

    try {
      const res = await getOrderReport({
        order_type: activeTab,
        search: searchQuery,
        startDate,
        endDate,
        page: 1,
        limit: 100,
      });

      if (res.success) {
        setOrders(res.data);
        setTotalCount(res.total);
      }
    } catch (err) {
      console.error("Failed to fetch reports", err);
    } finally {
      setLoading(false);
    }
  }, [activeTab, searchQuery, startDate, endDate]);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  const toggleRow = (id: string) => {
    const next = new Set(expandedRows);

    if (next.has(id)) next.delete(id);
    else next.add(id);

    setExpandedRows(next);
  };

  useEffect(() => {
    if (isExpandedAll) {
      setExpandedRows(new Set(orders.map((o) => o._id)));
    } else {
      setExpandedRows(new Set());
    }
  }, [isExpandedAll, orders]);

  const handleExportExcel = async () => {
    try {
      const { API_BASE, getAuthHeaders } =
        await import("../../../../services/apiClient");

      const url = `${API_BASE}/orders/export-excel?order_type=${activeTab}`;

      const res = await fetch(url, {
        headers: getAuthHeaders(),
      });

      const blob = await res.blob();

      const downloadUrl = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = downloadUrl;

      a.download = `${activeTab}_Report_${
        new Date().toISOString().split("T")[0]
      }.xlsx`;

      document.body.appendChild(a);
      a.click();

      window.URL.revokeObjectURL(downloadUrl);
      document.body.removeChild(a);
    } catch (err) {
      console.error("Export Excel failed", err);
    }
  };

  return (
    <div className="bg-white h-screen flex flex-col font-roboto overflow-hidden">
      <PosTopNav onLogout={() => console.log("logout")} />

      <ReportTabs activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="flex-1 bg-[#F8F8F8] overflow-y-auto hide-scrollbar">
        <div className="px-10 py-8 w-full">
          <ReportHeader
            activeTab={activeTab}
            totalCount={totalCount}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            startDate={startDate}
            endDate={endDate}
            setStartDate={setStartDate}
            setEndDate={setEndDate}
            isExpandedAll={isExpandedAll}
            setIsExpandedAll={setIsExpandedAll}
            handleExportExcel={handleExportExcel}
          />

          <OrderList
            orders={orders}
            loading={loading}
            expandedRows={expandedRows}
            toggleRow={toggleRow}
            activeTab={activeTab}
          />
        </div>
      </div>
    </div>
  );
};

export default PosReportPage;
