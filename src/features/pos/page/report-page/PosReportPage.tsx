import { useState, useEffect, useCallback } from "react";
import PosTopNav from "../../components/PosTopNav";
import DateRangePicker from "../../../../component/ui/DateRangePicker";
import { getOrderReport } from "../../../../services/pos/posReport";
import type { OrderReportItem } from "../../../../types/pos/report";

// Icons
import SearchIcon from "../../../../assets/svg/search.svg?react";
import PrintIcon from "../../../../assets/svg/print.svg?react";
import ExportIcon from "../../../../assets/svg/file-x.svg?react";

type TabMode = "Sell" | "Custom" | "Repair";

const PosReportPage = () => {
  const [activeTab, setActiveTab] = useState<TabMode>("Sell");
  const [searchQuery, setSearchQuery] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isExpandedAll, setIsExpandedAll] = useState(false);
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
        limit: 100 
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

  // Handle row expansion
  const toggleRow = (id: string) => {
    const next = new Set(expandedRows);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    setExpandedRows(next);
  };

  useEffect(() => {
    if (isExpandedAll) {
      setExpandedRows(new Set(orders.map(o => o._id)));
    } else {
      setExpandedRows(new Set());
    }
  }, [isExpandedAll, orders]);

  // Handle Drag-to-Scroll logic
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    el.style.cursor = "grabbing";
    el.style.userSelect = "none";
    
    const startX = e.pageX - el.offsetLeft;
    const scrollLeft = el.scrollLeft;
    
    const handleMouseMove = (moveEvent: MouseEvent) => {
      const x = moveEvent.pageX - el.offsetLeft;
      const walk = (x - startX) * 1.5; // Scroll sensitivity
      el.scrollLeft = scrollLeft - walk;
    };
    
    const handleMouseUp = () => {
      el.style.cursor = "grab";
      el.style.removeProperty("user-select");
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  const handleExportExcel = async () => {
    try {
      const { API_BASE, getAuthHeaders } = await import("../../../../services/apiClient");
      const url = `${API_BASE}/orders/export-excel?order_type=${activeTab}`;
      
      const res = await fetch(url, {
        headers: getAuthHeaders()
      });

      if (!res.ok) throw new Error("Export failed");

      const blob = await res.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = downloadUrl;
      a.download = `${activeTab}_Report_${new Date().toISOString().split('T')[0]}.xlsx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(downloadUrl);
      document.body.removeChild(a);
    } catch (err) {
      console.error("Export Excel failed", err);
      alert("Failed to export Excel. Please try again.");
    }
  };

  const renderOrderList = () => {
    if (loading && orders.length === 0) {
      return <div className="py-20 text-center text-gray-400 font-light font-roboto">Loading reports...</div>;
    }

    if (orders.length === 0) {
      return (
        <div className="py-20 text-center text-gray-400 font-light border-2 border-dashed border-gray-100 rounded-xl bg-white/50 font-roboto">
          No reports found for the selected filters.
        </div>
      );
    }

    return (
      <div className="space-y-4 pb-10">
        {orders.map((order) => {
          const isExpanded = expandedRows.has(order._id);
          return (
            <div key={order._id} className="bg-white rounded-lg border border-[#F0F0F0] overflow-hidden shadow-sm transition-all mb-4">
              {/* Summary Row - Stationary */}
              <div 
                onClick={() => toggleRow(order._id)}
                className="flex items-center justify-between px-6 py-4 cursor-pointer hover:bg-gray-50/50 transition-colors"
              >
                <div className="flex items-center gap-8">
                  <div className={`transition-transform duration-200 text-gray-400 ${isExpanded ? "rotate-90" : ""}`}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="9 18 15 12 9 6"/>
                    </svg>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="px-3 py-1 bg-[#E6F4FF] rounded-md flex items-center gap-1">
                       <span className="text-[#06284B] text-sm font-normal">ID :</span>
                       <span className="text-[#0690F1] text-sm font-bold">{order.order_no}</span>
                    </div>
                  </div>
                  <span className="text-[#06284B] text-sm font-light">{order.order_date}</span>
                  <span className="text-[#06284B] text-sm font-light">{order.total_items}</span>
                  <span className="text-[#06284B] text-sm font-normal ml-2">{order.customer_name}</span>
                </div>
                <div className="flex items-center">
                  <span className="text-[#06284B] font-bold text-lg">฿ {order.header_amount.toLocaleString("en-US", { minimumFractionDigits: 2 })}</span>
                </div>
              </div>

              {/* Detail Table Area */}
              {isExpanded && (
                <div 
                  onMouseDown={handleMouseDown}
                  className="border-t border-gray-50 bg-white p-0 animate-in fade-in slide-in-from-top-2 duration-200 relative overflow-x-auto no-scrollbar cursor-grab"
                >
                  <table className="text-left border-separate border-spacing-0 min-w-full" style={{ width: "4200px" }}>
                    <thead>
                      <tr className="bg-[#F8F9FA] text-[13px] text-[#06284B] border-b border-gray-100">
                        {/* Sticky Left Headers */}
                        <th className="py-3 px-6 font-medium sticky left-0 bg-[#F8F9FA] z-30 border-b border-gray-100" style={{ minWidth: "60px", width: "60px" }}>#</th>
                        <th className="py-3 px-4 font-medium sticky left-[60px] bg-[#F8F9FA] z-30 border-b border-gray-100" style={{ minWidth: "180px", width: "180px" }}>Sell ID</th>
                        <th className="py-3 px-4 font-medium sticky left-[240px] bg-[#F8F9FA] z-30 border-b border-gray-100" style={{ minWidth: "220px", width: "220px" }}>Customer</th>
                        <th className="py-3 px-4 font-medium sticky left-[460px] bg-[#F8F9FA] z-30 border-r border-gray-200/50 shadow-[6px_0_12px_-4px_rgba(0,0,0,0.06)] border-b border-gray-100" style={{ minWidth: "180px", width: "180px" }}>Date</th>
                        
                        {/* Scrollable Headers */}
                        <th className="py-3 px-4 font-medium border-b border-gray-100" style={{ minWidth: "200px", width: "200px" }}>Code</th>
                        <th className="py-3 px-4 font-medium border-b border-gray-100" style={{ minWidth: "300px", width: "300px" }}>Product Name</th>
                        <th className="py-3 px-4 font-medium border-b border-gray-100" style={{ minWidth: "140px", width: "140px" }}>Category</th>
                        <th className="py-3 px-4 font-medium border-b border-gray-100" style={{ minWidth: "140px", width: "140px" }}>Item Type</th>
                        <th className="py-3 px-4 font-medium border-b border-gray-100" style={{ minWidth: "140px", width: "140px" }}>Product Size</th>
                        <th className="py-3 px-4 font-medium border-b border-gray-100" style={{ minWidth: "120px", width: "120px" }}>Metal</th>
                        <th className="py-3 px-4 font-medium border-b border-gray-100" style={{ minWidth: "140px", width: "140px" }}>Metal Color</th>
                        <th className="py-3 px-4 font-medium text-right border-b border-gray-100" style={{ minWidth: "120px", width: "120px" }}>Gwt</th>
                        <th className="py-3 px-4 font-medium text-right border-b border-gray-100" style={{ minWidth: "120px", width: "120px" }}>Nwt</th>
                        <th className="py-3 px-4 font-medium border-b border-gray-100" style={{ minWidth: "200px", width: "200px" }}>Stone Name</th>
                        <th className="py-3 px-4 font-medium border-b border-gray-100" style={{ minWidth: "120px", width: "120px" }}>Shape</th>
                        <th className="py-3 px-4 font-medium border-b border-gray-100" style={{ minWidth: "120px", width: "120px" }}>Size</th>
                        <th className="py-3 px-4 font-medium text-right border-b border-gray-100" style={{ minWidth: "140px", width: "140px" }}>S.Weight</th>
                        <th className="py-3 px-4 font-medium border-b border-gray-100" style={{ minWidth: "120px", width: "120px" }}>Color</th>
                        <th className="py-3 px-4 font-medium border-b border-gray-100" style={{ minWidth: "140px", width: "140px" }}>Cutting</th>
                        <th className="py-3 px-4 font-medium border-b border-gray-100" style={{ minWidth: "140px", width: "140px" }}>Quality</th>
                        <th className="py-3 px-4 font-medium border-b border-gray-100" style={{ minWidth: "140px", width: "140px" }}>Clearity</th>
                        <th className="py-3 px-4 font-medium text-right border-b border-gray-100" style={{ minWidth: "100px", width: "100px" }}>Qty</th>
                        
                        {activeTab === "Custom" ? (
                          <th className="py-3 px-4 font-medium text-right border-b border-gray-100" style={{ minWidth: "160px", width: "160px" }}>Deposit</th>
                        ) : (
                          <>
                            <th className="py-3 px-4 font-medium text-center border-b border-gray-100" style={{ minWidth: "100px", width: "100px" }}>Tax</th>
                            <th className="py-3 px-4 font-medium text-right border-b border-gray-100" style={{ minWidth: "160px", width: "160px" }}>Price</th>
                            <th className="py-3 px-4 font-medium text-center border-b border-gray-100" style={{ minWidth: "120px", width: "120px" }}>Discount</th>
                          </>
                        )}

                        {/* Sticky Right Header */}
                        <th className="py-3 px-6 font-medium text-right sticky right-0 z-30 bg-[#F8F9FA] border-l border-gray-200 shadow-[-6px_0_12px_-4px_rgba(0,0,0,0.08)] border-b border-gray-100" style={{ minWidth: "180px", width: "180px" }}>Amount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50 text-[13px] text-[#06284B] font-light">
                      {order.items.map((item, idx) => (
                        <tr key={item._id} className="hover:bg-gray-50/40 transition-colors group">
                          {/* Sticky Left Data Cells */}
                          <td className="py-4 px-6 text-gray-400 sticky left-0 bg-white group-hover:bg-gray-50 transition-colors z-20 border-b border-gray-50">{idx + 1}</td>
                          <td className="py-4 px-4 whitespace-nowrap sticky left-[60px] bg-white group-hover:bg-gray-50 transition-colors z-20 border-b border-gray-50">{order.order_no}</td>
                          <td className="py-4 px-4 whitespace-nowrap sticky left-[240px] bg-white group-hover:bg-gray-50 transition-colors z-20 border-b border-gray-50">{order.customer_name}</td>
                          <td className="py-4 px-4 whitespace-nowrap sticky left-[460px] bg-white group-hover:bg-gray-50 transition-colors z-20 border-r border-gray-100 shadow-[6px_0_12px_-4px_rgba(0,0,0,0.04)] border-b border-gray-50">{item.date}</td>
                          
                          {/* Scrollable Data Cells */}
                          <td className="py-4 px-4 border-b border-gray-50">{item.code}</td>
                          <td className="py-4 px-4 font-normal border-b border-gray-50">{item.product_name}</td>
                          <td className="py-4 px-4 text-gray-500 font-light border-b border-gray-50">{item.category}</td>
                          <td className="py-4 px-4 text-gray-500 font-light border-b border-gray-50">{item.item_type}</td>
                          <td className="py-4 px-4 text-gray-500 font-light border-b border-gray-50">{item.product_size}</td>
                          <td className="py-4 px-4 text-gray-500 font-light border-b border-gray-50">{item.metal}</td>
                          <td className="py-4 px-4 text-gray-500 font-light border-b border-gray-50">{item.metal_color}</td>
                          <td className="py-4 px-4 text-gray-500 text-right font-light border-b border-gray-50">{item.gwt > 0 ? `${item.gwt} g` : "-"}</td>
                          <td className="py-4 px-4 text-gray-500 text-right font-light border-b border-gray-50">{item.nwt > 0 ? `${item.nwt} g` : "-"}</td>
                          <td className="py-4 px-4 text-gray-500 font-light border-b border-gray-50">{item.stone_name}</td>
                          <td className="py-4 px-4 text-gray-500 font-light border-b border-gray-50">{item.shape}</td>
                          <td className="py-4 px-4 text-gray-500 font-light border-b border-gray-50">{item.size}</td>
                          <td className="py-4 px-4 text-gray-500 text-right font-light border-b border-gray-50">{item.s_weight > 0 ? `${item.s_weight} cts` : "-"}</td>
                          <td className="py-4 px-4 text-gray-500 font-light border-b border-gray-50">{item.color}</td>
                          <td className="py-4 px-4 text-gray-500 font-light border-b border-gray-50">{item.cutting}</td>
                          <td className="py-4 px-4 text-gray-500 font-light border-b border-gray-50">{item.quality}</td>
                          <td className="py-4 px-4 text-gray-500 font-light border-b border-gray-50">{item.clarity}</td>
                          <td className="py-4 px-4 text-right font-light border-b border-gray-50">{item.qty}</td>
                          
                          {activeTab === "Custom" ? (
                            <td className="py-4 px-4 text-right font-light border-b border-gray-50">
                              {(item.deposit || 0).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                            </td>
                          ) : (
                            <>
                              <td className="py-4 px-4 text-center text-gray-500 font-light border-b border-gray-50">{item.tax}</td>
                              <td className="py-4 px-4 text-right font-light border-b border-gray-50">{item.price.toLocaleString("en-US", { minimumFractionDigits: 2 })}</td>
                              <td className="py-4 px-4 text-center font-light border-b border-gray-50">{item.discount}</td>
                            </>
                          )}

                          {/* Sticky Right Amount Cell */}
                          <td className="py-4 px-6 text-right font-medium sticky right-0 bg-white group-hover:bg-gray-50 transition-colors z-20 border-l border-gray-100 shadow-[-6px_0_12px_-4px_rgba(0,0,0,0.06)] border-b border-gray-50">
                            {item.amount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="bg-white h-screen flex flex-col font-roboto overflow-hidden">
      <PosTopNav onLogout={() => console.log("logout")} />

      {/* TABS - Fixed at top */}
      <div className="h-12 flex items-end px-10 text-base gap-10 border-b bg-white relative z-40 flex-shrink-0">
        {(["Sell", "Custom", "Repair"] as TabMode[]).map((tab) => {
          const active = activeTab === tab;
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`cursor-pointer pb-2 transition-all ${
                active
                  ? "text-[#06284B] border-b-2 border-[#06284B] font-normal"
                  : "text-[#838383] font-light hover:text-[#06284B]"
              }`}
            >
              {tab}
            </button>
          );
        })}
      </div>

      {/* Scrollable Content Area */}
      <div className="flex-1 bg-[#F8F8F8] overflow-y-auto no-scrollbar">
        <div className="px-10 py-8 w-full">
          {/* Header & Filters */}
          <div className="flex justify-between items-start mb-8">
            <h2 className="text-xl font-normal text-[#06284B]">
              {activeTab} Report {totalCount > 0 && <span className="text-sm text-gray-400 ml-2 font-light">({totalCount} records)</span>}
            </h2>
            
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setIsExpandedAll(!isExpandedAll)}
                className={`flex items-center gap-2 px-4 h-10 rounded-md border text-sm font-normal transition-all shadow-sm ${
                  isExpandedAll 
                    ? "bg-[#06284B] text-white border-[#06284B]" 
                    : "bg-white text-gray-600 border-[#CFCFCF] hover:bg-gray-50"
                }`}
              >
                <div className="flex flex-col items-center justify-center -space-y-1">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="18 15 12 9 6 15"/>
                  </svg>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="6 9 12 15 18 9"/>
                  </svg>
                </div>
                Expanded
              </button>

              <div className="w-[300px]">
                <DateRangePicker 
                  startDate={startDate} 
                  endDate={endDate} 
                  onChange={(s: string, e: string) => {
                    setStartDate(s);
                    setEndDate(e);
                  }} 
                />
              </div>

              <div className="flex items-center border border-[#CFCFCF] bg-white rounded-md px-3 h-[40px] w-[300px] focus-within:border-[#005AA7] shadow-sm transition-all focus-within:shadow-md">
                <input
                  type="text"
                  placeholder="ID / Customer / Key info"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 bg-transparent text-sm font-light outline-none"
                />
                <SearchIcon className="w-5 h-5 text-gray-400" />
              </div>

              <div className="flex items-center gap-3 ml-3">
                <PrintIcon className="w-8 h-8 text-gray-600 cursor-pointer hover:text-[#005AA7] transition-all" />
                <ExportIcon 
                  onClick={handleExportExcel}
                  className="w-8 h-8 text-gray-600 cursor-pointer hover:text-[#005AA7] transition-all" 
                />
              </div>
            </div>
          </div>

          <div className="mt-6">
            {renderOrderList()}
          </div>
        </div>
      </div>

      <style>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none; /* IE and Edge */
          scrollbar-width: none; /* Firefox */
        }
      `}</style>
    </div>
  );
};

export default PosReportPage;
