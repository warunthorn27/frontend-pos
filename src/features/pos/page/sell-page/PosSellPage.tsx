import { useEffect, useState, useCallback } from "react";
import PosTopNav from "../../components/PosTopNav";
import { 
  getSellSessionList, 
  updateSellSessionItem, 
  getNextSellOrderNumber, 
  deleteSellSessionItem, 
  clearSellSession, 
  finishSellOrder, 
  searchProductsForSell,
  addToSellSession 
} from "../../../../services/pos/posSell";
import { getPosCustomers } from "../../../../services/pos/posCustom";
import type { PosCustomer } from "../../../../services/pos/posCustom";
import type { SellSessionItem, SellSearchProduct } from "../../../../types/pos/sell";
import { useCustomSession } from "../../context/useCustomSession";
import CustomerDropdown from "../../components/CustomerDropdown";
import CustomerCreateModal from "../../components/CustomerCreateModal";

const PosSellPage = () => {
  const [items, setItems] = useState<SellSessionItem[]>([]);
  const [loading, setLoading] = useState(false);
  const { refreshCount } = useCustomSession();
  const [orderRef, setOrderRef] = useState<string>("");
  const [customers, setCustomers] = useState<PosCustomer[]>([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>("");

  // Search State
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SellSearchProduct[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);

  // Customer Modal State
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);

  // Price Edit State
  const [editingPriceSessionId, setEditingPriceSessionId] = useState<string | null>(null);
  const [editingPriceValue, setEditingPriceValue] = useState<string>("");

  // Global Discount State
  const [globalDiscountPercent, setGlobalDiscountPercent] = useState<string>("0");

  /* ── Load session items ───────────────────────── */
  const loadItems = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getSellSessionList();
      setItems(res.data);
    } catch (err) {
      console.error("Failed to load sell session", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchCustomers = useCallback(async () => {
    try {
      const data = await getPosCustomers();
      setCustomers(data);
    } catch (err) {
      console.error("Failed to load customers", err);
    }
  }, []);

  useEffect(() => {
    loadItems();
    refreshCount();
    getNextSellOrderNumber()
      .then((no) => setOrderRef(no))
      .catch(() => setOrderRef(`SA-${Math.floor(100000 + Math.random() * 900000)}`));
    
    fetchCustomers();
  }, [loadItems, refreshCount, fetchCustomers]);

  /* ── Update qty ─────────────────────────────────── */
  const handleQtyChange = async (item: SellSessionItem, delta: number) => {
    const newQty = item.qty + delta;

    if (newQty < 1) {
      await handleDelete(item.session_id);
      return;
    }

    if (newQty > item.max_qty && delta > 0) {
      alert(`Only ${item.max_qty} items in stock`);
      return;
    }

    // Optimistic update
    setItems((prev) =>
      prev.map((i) =>
        i.session_id === item.session_id ? { ...i, qty: newQty } : i,
      ),
    );

    try {
      await updateSellSessionItem(item.session_id, { qty: newQty });
      refreshCount();
    } catch (err) {
      console.error("Failed to update qty", err);
      loadItems(); // revert on error
    }
  };

  /* ── Update discount ─────────────────────────────── */
  const handleDiscountChange = async (sessionId: string, percent: string) => {
    const val = parseFloat(percent) || 0;
    
    // Optimistic update
    setItems((prev) =>
      prev.map((i) =>
        i.session_id === sessionId ? { ...i, discount_percent: val } : i,
      ),
    );

    try {
      await updateSellSessionItem(sessionId, { discount_percent: val });
    } catch (err) {
      console.error("Failed to update discount", err);
      loadItems();
    }
  };

  /* ── Update price ────────────────────────────────── */
  const handlePriceToggle = (item: SellSessionItem) => {
    if (editingPriceSessionId === item.session_id) {
      setEditingPriceSessionId(null);
    } else {
      setEditingPriceSessionId(item.session_id);
      setEditingPriceValue((item.unit_price || 0).toString());
    }
  };

  const handlePriceSave = async (sessionId: string) => {
    const newVal = parseFloat(editingPriceValue) || 0;
    
    // Optimistic update
    setItems((prev) =>
      prev.map((i) =>
        i.session_id === sessionId ? { ...i, unit_price: newVal } : i,
      ),
    );

    setEditingPriceSessionId(null);

    try {
      await updateSellSessionItem(sessionId, { unit_price: newVal });
    } catch (err) {
      console.error("Failed to update price", err);
      loadItems();
    }
  };

  /* ── Delete single item ──────────────────────────── */
  const handleDelete = async (sessionId: string) => {
    setItems((prev) => prev.filter((i) => i.session_id !== sessionId));
    try {
      await deleteSellSessionItem(sessionId);
      refreshCount();
    } catch (err) {
      console.error("Failed to delete item", err);
      loadItems(); // revert
    }
  };

  /* ── Clear all items ─────────────────────────────── */
  const handleClearAll = async () => {
    setItems([]);
    try {
      await clearSellSession();
      refreshCount();
    } catch (err) {
      console.error("Failed to clear session", err);
      loadItems();
    }
  };

  /* ── Search Items ─────────────────────────────── */
  const handleSearch = async (query: string, isFocus = false) => {
    setSearchQuery(query);
    
    if (!query.trim() && !isFocus) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }

    setIsSearching(true);
    setShowResults(true);
    try {
      const res = await searchProductsForSell(query.trim());
      setSearchResults(res.data);
    } catch (err) {
      console.error("Search failed", err);
    } finally {
      setIsSearching(false);
    }
  };

  const handleAddFromSearch = async (product: SellSearchProduct) => {
    if (product.qty_in_stock <= 0) {
      alert("This product is out of stock.");
      return;
    }

    setLoading(true);
    try {
      await addToSellSession({
        product_id: product.product_id,
        unit_price: product.unit_price,
      });
      setSearchQuery("");
      setShowResults(false);
      loadItems();
      refreshCount();
    } catch (err: any) {
      console.error("Failed to add product", err);
      alert(err.message || "Failed to add product");
    } finally {
      setLoading(false);
    }
  };

  /* ── Finish order ────────────────────────────────── */
  const handleFinishOrder = async () => {
    if (!selectedCustomerId) {
      alert("Please select a customer first.");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        customer_id: selectedCustomerId,
        items: items.map(i => ({
          product_id: i.product_id,
          product_code: i.product_code,
          product_name: i.product_name,
          image: i.image,
          qty: i.qty,
          unit_price: i.unit_price,
          discount_percent: i.discount_percent,
          discount_amount: i.discount_amount
        })),
        sub_total: itemsSubTotal,
        discount_percent: globalDiscountPct,
        discount_total: globalDiscountAmount,
        tax_amount: taxTotal,
        grand_total: grandTotal,
        remark: "",
      };

      await finishSellOrder(payload);
      setItems([]);
      setSelectedCustomerId("");
      refreshCount();
      getNextSellOrderNumber()
        .then((no) => setOrderRef(no))
        .catch(() => {});
      alert("Order finished successfully!");
    } catch (err: any) {
      console.error("Failed to finish order", err);
      alert(err.message || "Finish Order failed");
    } finally {
      setLoading(false);
    }
  };

  const handleCustomerCreated = async (newCustomerId: string) => {
    setIsCustomerModalOpen(false);
    await fetchCustomers();
    setSelectedCustomerId(newCustomerId);
  };

  /* ── Totals ───────────────────────────── */
  // Items subtotal (sum of unit_price * qty after item discount)
  const itemsSubTotal = items.reduce((sum, i) => {
    const discountedPrice = i.unit_price * (1 - i.discount_percent / 100);
    return sum + discountedPrice * i.qty;
  }, 0);
  
  // Global discount percentage
  const globalDiscountPct = parseFloat(globalDiscountPercent) || 0;
  
  // Value after global discount
  const taxableAmount = itemsSubTotal * (1 - globalDiscountPct / 100);

  // Global discount deduction amount
  const globalDiscountAmount = itemsSubTotal - taxableAmount;
  
  // Tax (7%) based on taxable amount
  const taxTotal = taxableAmount * 0.07;
  
  // Grand total
  const grandTotal = taxableAmount + taxTotal;

  const today = new Date().toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return (
    <div className="flex flex-col h-full bg-[#F8F8F8]">
      <PosTopNav onLogout={() => console.log("logout")} />

      <div className="flex flex-1 overflow-hidden p-8 gap-6">
        {/* ═══ LEFT SIDE ═══ */}
        <div className="flex-1 bg-white border border-[#E5E7EB] rounded-xl p-6 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-[#06284B]">Details</h2>
            
            <div className="flex gap-4 items-center">
              <div className="relative flex items-center">
                <input
                  placeholder="Enter code"
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  onFocus={() => handleSearch(searchQuery, true)}
                  className="w-[320px] h-10 border border-[#E5E7EB] rounded-md px-4 pr-10 text-sm outline-none focus:border-[#2E5B9A]"
                />
                <div className="absolute right-3 text-gray-400">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                  </svg>
                </div>

                {/* Search Results Dropdown */}
                {showResults && (
                  <div 
                    className="absolute top-11 left-0 w-full bg-white border border-[#E5E7EB] rounded-lg shadow-xl z-[201] max-h-[360px] overflow-auto [&::-webkit-scrollbar]:hidden"
                    style={{ scrollbarWidth: "none" }}
                  >
                    {isSearching && searchResults.length === 0 ? (
                      <div className="p-4 text-center text-gray-400 text-sm">Searching...</div>
                    ) : (searchQuery.trim() && searchResults.length === 0) ? (
                      <div className="p-4 text-center text-gray-400 text-sm">No products found</div>
                    ) : (
                      <div className="divide-y divide-gray-50">
                        {searchResults.map((product) => (
                          <div 
                            key={product.product_id} 
                            onClick={() => handleAddFromSearch(product)}
                            className="flex items-center gap-4 p-3 hover:bg-blue-50 cursor-pointer transition-colors"
                          >
                            <div className="w-12 h-12 rounded bg-gray-50 border border-gray-100 flex-shrink-0 overflow-hidden flex items-center justify-center">
                              {product.image && <img src={product.image} className="w-full h-full object-cover" />}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="text-[14px] font-semibold text-[#06284B] truncate">
                                {product.product_name}
                              </h4>
                              <div className="flex justify-between items-center mt-0.5">
                                <p className="text-[12px] text-gray-400">{product.product_code}</p>
                                <span className="text-[12px] text-gray-400 font-normal">
                                  {product.category_name}
                                </span>
                              </div>
                              <div className="flex justify-between items-center mt-1">
                                <span className="text-[13px] text-[#2E5B9A] font-bold">฿ {product.unit_price.toLocaleString()}</span>
                                <span className="text-[10px] bg-gray-50 px-1.5 py-0.5 rounded text-gray-400 border border-gray-100 italic">Qty: {product.qty_in_stock}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
                
                {/* Overlay to close search */}
                {showResults && (
                  <div className="fixed inset-0 z-[200]" onClick={() => setShowResults(false)} />
                )}
              </div>
              <button 
                onClick={handleClearAll}
                className="text-sm font-medium text-gray-500 hover:text-red-500 transition-colors"
              >
                Clear All
              </button>
            </div>
          </div>

          {/* List Content */}
          <div className="flex-1 overflow-auto pr-2 [&::-webkit-scrollbar]:hidden" style={{ scrollbarWidth: "none" }}>
            {loading && items.length === 0 ? (
              <div className="py-20 text-center text-gray-400">Loading...</div>
            ) : items.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                 <svg className="w-20 h-20 text-gray-100 mb-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"/>
                 </svg>
                 <div className="text-[#06284B] font-medium">No items added yet</div>
                 <div className="text-sm text-gray-400 mt-1">Add items to start the order.</div>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {items.map((item) => (
                  <div key={item.session_id} className="py-6 first:pt-0">
                    <div className="flex items-start gap-4">
                      {/* Thumbnail */}
                      <div className="w-16 h-16 rounded bg-gray-50 border border-gray-100 flex-shrink-0 overflow-hidden flex items-center justify-center">
                        {item.image ? (
                          <img src={item.image} alt={item.product_name} className="w-full h-full object-cover" />
                        ) : null}
                      </div>

                      {/* Main Info Area */}
                      <div className="flex-1 min-w-0">
                        {/* Name + Price + Actions */}
                        <div className="flex justify-between items-start">
                          <div className="min-w-0">
                            <h3 className="text-[15px] font-semibold text-gray-900 truncate">
                              {item.product_name}
                            </h3>
                            <div className="text-[12px] text-gray-400 mt-0.5">
                              {item.product_code} / {item.subtitle}
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                                {editingPriceSessionId === item.session_id ? (
                                  <div className="flex items-center gap-2">
                                    <input
                                      type="text"
                                      autoFocus
                                      onFocus={(e) => e.target.select()}
                                      className="w-24 h-8 border border-[#E5E7EB] rounded-md px-2 text-[14px] font-semibold text-[#06284B] outline-none focus:border-[#2E5B9A]"
                                      value={editingPriceValue}
                                      onChange={(e) => setEditingPriceValue(e.target.value)}
                                      onBlur={() => handlePriceSave(item.session_id)}
                                      onKeyDown={(e) => {
                                        if (e.key === "Enter") handlePriceSave(item.session_id);
                                        if (e.key === "Escape") setEditingPriceSessionId(null);
                                      }}
                                    />
                                  </div>
                                ) : (
                                  <>
                                    <span className="text-[14px] font-semibold text-[#06284B]">
                                        ฿ {(item.unit_price * (1 - item.discount_percent / 100)).toLocaleString()}
                                    </span>
                                    {item.discount_percent > 0 && (
                                        <span className="text-[12px] text-gray-400 line-through">
                                            ฿ {item.unit_price.toLocaleString()}
                                        </span>
                                    )}
                                  </>
                                )}
                            </div>
                          </div>
                          
                           {/* Actions */}
                           <div className="flex items-center gap-2">
                             <button
                               onClick={() => handlePriceToggle(item)}
                               className={`transition-colors p-1 ${editingPriceSessionId === item.session_id ? "text-blue-500" : "text-gray-300 hover:text-blue-500"}`}
                             >
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                                </svg>
                             </button>
                             <button 
                               onClick={() => handleDelete(item.session_id)}
                               className="text-gray-300 hover:text-red-500 transition-colors p-1"
                             >
                               <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                 <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/>
                               </svg>
                             </button>
                           </div>
                         </div>

                        {/* Controls: Discount + Qty */}
                        <div className="flex justify-end items-center mt-3 gap-4">
                           <div className="flex items-center gap-2">
                                <input
                                    type="text"
                                    className="w-16 h-8 border border-[#E5E7EB] rounded text-center text-xs outline-none focus:border-[#2E5B9A]"
                                    value={item.discount_percent}
                                    onChange={(e) => handleDiscountChange(item.session_id, e.target.value)}
                                    onFocus={(e) => e.target.select()}
                                />
                                <span className="text-xs text-gray-500">%</span>
                           </div>

                           <div className="flex items-center gap-3">
                            <button 
                              onClick={() => handleQtyChange(item, -1)}
                              className="w-7 h-7 border border-[#E5E7EB] rounded-full flex items-center justify-center text-gray-400 hover:border-gray-400 hover:text-gray-600 transition-all"
                            >−</button>
                            <span className="w-4 text-center text-[14px] font-medium text-gray-800">{item.qty}</span>
                            <button 
                              onClick={() => handleQtyChange(item, 1)}
                              className="w-7 h-7 border border-[#E5E7EB] rounded-full flex items-center justify-center text-gray-400 hover:border-gray-400 hover:text-gray-600 transition-all"
                            >+</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ═══ RIGHT SIDE ═══ */}
        <div className="w-[420px] bg-white border border-[#E5E7EB] rounded-xl p-6 flex flex-col justify-between overflow-hidden">
          <div>
            <div className="flex justify-between text-[13px] text-gray-400 mb-6">
              <span className="font-medium text-gray-900">#{orderRef}</span>
              <span>{today}</span>
            </div>

            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-4">
                <label className="text-sm font-medium text-gray-700 whitespace-nowrap">
                  Customer <span className="text-red-500">*</span>
                </label>
                <div className="flex-1 min-w-0">
                  <CustomerDropdown
                    customers={customers}
                    value={selectedCustomerId}
                    onChange={setSelectedCustomerId}
                    onAddCustomer={() => setIsCustomerModalOpen(true)}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-3 pt-6 border-t border-gray-100">
              <div className="flex justify-between text-sm text-gray-500">
                <span>Total Items</span>
                <span className="text-gray-900 font-medium">{items.reduce((sum, i) => sum + i.qty, 0)}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-500">
                <span>Sub Total</span>
                <span className="text-gray-900 font-medium">฿ {itemsSubTotal.toLocaleString("en-US", { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between items-center text-sm text-[#06284B] font-medium">
                <div className="flex items-center gap-2">
                    <span className="text-red-500">Discount</span>
                    <div className="relative">
                        <input
                            type="text"
                            value={globalDiscountPercent}
                            onChange={(e) => setGlobalDiscountPercent(e.target.value)}
                            onFocus={(e) => e.target.select()}
                            className="w-16 h-8 border border-[#E5E7EB] rounded px-2 text-center text-xs outline-none focus:border-[#2E5B9A] pr-4"
                        />
                        <span className="absolute right-1 top-1/2 -translate-y-1/2 text-[10px] text-gray-400 font-normal">%</span>
                    </div>
                </div>
                <span className="text-red-500">
                    ฿ {globalDiscountPct === 0 ? "0.00" : taxableAmount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex justify-between text-sm text-gray-500">
                <span>Tax (7%)</span>
                <span className="text-gray-900 font-medium">฿ {taxTotal.toLocaleString("en-US", { minimumFractionDigits: 2 })}</span>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-gray-100">
            <div className="flex justify-between items-baseline mb-6">
              <span className="text-gray-900 font-bold text-lg">Grand Total</span>
              <span className="text-gray-900 font-bold text-2xl">฿ {grandTotal.toLocaleString("en-US", { minimumFractionDigits: 2 })}</span>
            </div>

            <button 
              onClick={handleFinishOrder}
              disabled={loading || items.length === 0}
              className="w-full h-12 bg-[#005AA7] hover:bg-[#004A8A] disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg font-bold flex items-center justify-center transition-colors shadow-sm"
            >
              {loading ? "Processing..." : "Finish Order"}
            </button>
          </div>
        </div>
      </div>

      <CustomerCreateModal
        open={isCustomerModalOpen}
        onClose={() => setIsCustomerModalOpen(false)}
        onSuccess={handleCustomerCreated}
      />
    </div>
  );
};

export default PosSellPage;
