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
  addToSellSession,
} from "../../../../services/pos/posSell";
import { getPosCustomers } from "../../../../services/pos/posCustom";
import type { PosCustomer } from "../../../../services/pos/posCustom";
import type {
  SellSessionItem,
  SellSearchProduct,
} from "../../../../types/pos/sell";
import { useCustomSession } from "../../context/useCustomSession";
import CustomerDropdown from "../../components/CustomerDropdown";
import CustomerCreateModal from "../../components/CustomerCreateModal";
import BoxItemsIcon from "../../../../assets/svg/sell-items.svg?react";
import SearchIcon from "../../../../assets/svg/search.svg?react";
import DiscountIcon from "../../../../assets/svg/discount.svg?react";
import MinusIcon from "../../../../assets/svg/minus.svg?react";
import PlusIcon from "../../../../assets/svg/plus.svg?react";
import DeleteIcon from "../../../../assets/svg/trash.svg?react";
import EditIcon from "../../../../assets/svg/edit.svg?react";
import ProductImage from "../../../products/product-list/components/ProductImage";

const PosSellPage = () => {
  const [items, setItems] = useState<SellSessionItem[]>([]);
  const [loading, setLoading] = useState(false);
  const { refreshCount } = useCustomSession();
  const [orderRef, setOrderRef] = useState<string>("");
  const [customers, setCustomers] = useState<PosCustomer[]>([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>("");
  const [customerError, setCustomerError] = useState(false);

  // Search State
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SellSearchProduct[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);

  // Customer Modal State
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);

  // Price Edit State
  const [editingPriceSessionId, setEditingPriceSessionId] = useState<
    string | null
  >(null);
  const [editingPriceValue, setEditingPriceValue] = useState<string>("");

  // Global Discount State
  const [globalDiscountPercent, setGlobalDiscountPercent] =
    useState<string>("0");

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
      .catch(() =>
        setOrderRef(`SA-${Math.floor(100000 + Math.random() * 900000)}`),
      );

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
    } catch (err: unknown) {
      console.error("Failed to add product", err);

      const message =
        err instanceof Error ? err.message : "Failed to add product";

      alert(message);
    } finally {
      setLoading(false);
    }
  };

  /* ── Finish order ────────────────────────────────── */
  const handleFinishOrder = async () => {
    if (!selectedCustomerId) {
      setCustomerError(true);
      return;
    }

    setCustomerError(false);

    setLoading(true);
    try {
      const payload = {
        customer_id: selectedCustomerId,
        items: items.map((i) => ({
          product_id: i.product_id,
          product_code: i.product_code,
          product_name: i.product_name,
          image: i.image,
          qty: i.qty,
          unit_price: i.unit_price,
          discount_percent: i.discount_percent,
          discount_amount: i.discount_amount,
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
    } catch (err: unknown) {
      console.error("Failed to finish order", err);

      const message =
        err instanceof Error ? err.message : "Finish Order failed";

      alert(message);
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
        <div className="flex-1 bg-white border border-[#E5E7EB] rounded-lg p-16 pt-12 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-normal text-[#06284B]">Details</h2>

            <div className="flex gap-4 items-center">
              <div className="relative flex items-center">
                <input
                  placeholder="Enter code"
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  onFocus={() => handleSearch(searchQuery, true)}
                  className="flex items-center font-light text-sm border border-[#CFCFCF] bg-white rounded-md px-3 w-[350px] h-[40px] transition focus:outline-none focus-within:border-[#005AA7]"
                />
                <div className="absolute right-3 text-gray-400">
                  <SearchIcon className="w-5 h-5" />
                </div>

                {/* Search Results Dropdown */}
                {showResults && (
                  <div
                    className="absolute top-11 left-0 w-full bg-white border border-[#CFCFCF] rounded-md shadow-lg z-[201] max-h-[360px] overflow-auto [&::-webkit-scrollbar]:hidden"
                    style={{ scrollbarWidth: "none" }}
                  >
                    {isSearching && searchResults.length === 0 ? (
                      <div className="p-4 text-center text-gray-400 text-sm">
                        Searching...
                      </div>
                    ) : searchQuery.trim() && searchResults.length === 0 ? (
                      <div className="p-4 text-center text-gray-400 text-sm">
                        No products found
                      </div>
                    ) : (
                      <div className="divide-y divide-gray-200">
                        {searchResults.map((product) => (
                          <div
                            key={product.product_id}
                            onClick={() => handleAddFromSearch(product)}
                            className="flex items-center gap-4 p-3 hover:bg-gray-50 cursor-pointer transition-colors"
                          >
                            <ProductImage
                              imageUrl={product.image || null}
                              alt={product.product_name}
                              className="w-12 h-12 shrink-0"
                            />
                            <div className="flex-1 min-w-0">
                              <h4 className="text-sm font-normal text-[#06284B] truncate">
                                {product.product_name}
                              </h4>
                              <div className="flex justify-between items-center mt-1">
                                <p className="text-xs text-gray-500">
                                  {product.product_code}
                                </p>
                                <span className="text-xs text-gray-400 font-normal">
                                  {product.category_name}
                                </span>
                              </div>
                              <div className="flex justify-between items-center mt-1">
                                {/* <span className="text-[13px] text-[#2E5B9A] font-bold">
                                  ฿ {product.unit_price.toLocaleString()}
                                </span> */}
                                {/* <span className="text-[10px] bg-gray-50 px-1.5 py-0.5 rounded text-gray-400 border border-gray-100 italic">
                                  Qty: {product.qty_in_stock}
                                </span> */}
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
                  <div
                    className="fixed inset-0 z-[200]"
                    onClick={() => setShowResults(false)}
                  />
                )}
              </div>
              <button
                onClick={handleClearAll}
                className="text-lg font-normal text-[#2A2A2A] hover:underline"
              >
                Clear All
              </button>
            </div>
          </div>

          {/* List Content */}
          <div
            className="flex-1 overflow-auto pr-2 [&::-webkit-scrollbar]:hidden"
            style={{ scrollbarWidth: "none" }}
          >
            {loading && items.length === 0 ? (
              <div className="py-20 text-center text-gray-400">Loading...</div>
            ) : items.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-36 text-center">
                <BoxItemsIcon className="w-64 h-64" />
                <div className="text-[#084072] font-normal text-lg mt-8">
                  No items added yet
                </div>
                <div className="text-lg text-[#BABABA] mt-1 font-light">
                  Add items to start the order.
                </div>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {items.map((item) => (
                  <div key={item.session_id} className="py-6 first:pt-0">
                    <div className="flex items-center gap-8">
                      {/* Image */}
                      <ProductImage
                        imageUrl={item.image || null}
                        alt={item.product_name}
                        className="w-[72px] h-[72px] shrink-0"
                      />

                      {/* Product Info */}
                      <div className="flex-1 min-w-[220px]">
                        <h3 className="text-base font-normal text-[#2A2A2A]">
                          {item.product_name}
                        </h3>

                        <div className="text-sm text-gray-500 mt-1">
                          {item.product_code} / {item.subtitle}
                        </div>
                      </div>

                      {/* Price */}
                      <div className="w-[200px] flex items-center gap-3 text-base">
                        {editingPriceSessionId === item.session_id ? (
                          <input
                            type="text"
                            autoFocus
                            value={editingPriceValue}
                            onChange={(e) =>
                              setEditingPriceValue(e.target.value)
                            }
                            onBlur={() => handlePriceSave(item.session_id)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter")
                                handlePriceSave(item.session_id);
                              if (e.key === "Escape")
                                setEditingPriceSessionId(null);
                            }}
                            className="w-[100px] h-[32px] border border-[#CFCFCF] rounded px-2 text-sm outline-none focus:border-[#005AA7]"
                          />
                        ) : (
                          <>
                            {/* ราคาหลังลด */}
                            <span
                              className="cursor-pointer text-[#2A2A2A]"
                              onClick={() => handlePriceToggle(item)}
                            >
                              ฿{" "}
                              {(
                                item.unit_price *
                                (1 - item.discount_percent / 100)
                              ).toLocaleString("en-US", {
                                minimumFractionDigits: 2,
                              })}
                            </span>

                            {/* ราคาเดิม */}
                            {item.discount_percent > 0 && (
                              <span className="text-gray-400 line-through text-md">
                                ฿{" "}
                                {item.unit_price.toLocaleString("en-US", {
                                  minimumFractionDigits: 2,
                                })}
                              </span>
                            )}
                          </>
                        )}
                      </div>

                      {/* Discount */}
                      <div className="flex items-center gap-2 border border-[#CFCFCF] rounded-md px-3 h-[40px] w-[120px]">
                        <DiscountIcon className="w-10 h-10 text-gray-700" />

                        <input
                          type="text"
                          value={item.discount_percent}
                          onChange={(e) =>
                            handleDiscountChange(
                              item.session_id,
                              e.target.value,
                            )
                          }
                          onFocus={(e) => e.target.select()}
                          className="w-full bg-transparent text-md outline-none text-center"
                        />

                        <span className="text-md text-gray-600">%</span>
                      </div>

                      {/* Qty */}
                      <div className="flex items-center gap-4 w-[120px] justify-center">
                        <button
                          onClick={() => handleQtyChange(item, -1)}
                          className="w-7 h-7 border border-[#CFCFCF] rounded-full flex items-center justify-center text-gray-700 hover:bg-gray-200"
                        >
                          <MinusIcon className="w-5 h-5" />
                        </button>

                        <span className="w-4 text-center text-base font-normal">
                          {item.qty}
                        </span>

                        <button
                          onClick={() => handleQtyChange(item, 1)}
                          className="w-7 h-7 border border-[#CFCFCF] rounded-full flex items-center justify-center text-gray-700 hover:bg-gray-200"
                        >
                          <PlusIcon className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 w-[60px] justify-end">
                        <button
                          onClick={() => handlePriceToggle(item)}
                          className="text-black"
                        >
                          <EditIcon className="w-6 h-6" />
                        </button>

                        <button
                          onClick={() => handleDelete(item.session_id)}
                          className="text-[#E71010]"
                        >
                          <DeleteIcon className="w-6 h-6" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ═══ RIGHT SIDE ═══ */}
        <div className="w-[450px] bg-white border border-[#E5E7EB] rounded-lg p-6 flex flex-col justify-between overflow-hidden">
          <div>
            <div className="flex justify-between text-lg text-[#2A2A2A] mb-6 font-normal">
              <span>#{orderRef}</span>
              <span className="font-light">{today}</span>
            </div>

            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-4">
                <label className="text-lg font-normal text-[#2A2A2A] whitespace-nowrap">
                  Customer <span className="text-red-500">*</span>
                </label>
                <div className="flex-1 min-w-0">
                  <CustomerDropdown
                    customers={customers}
                    value={selectedCustomerId}
                    onChange={(id) => {
                      setSelectedCustomerId(id);
                      setCustomerError(false);
                    }}
                    onAddCustomer={() => setIsCustomerModalOpen(true)}
                    error={customerError}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-3 pt-6 border-t border-gray-100">
              <div className="flex justify-between text-base text-[#2A2A2A]">
                <span>Total Items</span>
                <span className="text-[#2A2A2A] font-light">
                  {items.reduce((sum, i) => sum + i.qty, 0)}
                </span>
              </div>
              <div className="flex justify-between text-base text-[#2A2A2A]">
                <span>Sub Total</span>
                <span className="text-[#2A2A2A] font-light">
                  ฿{" "}
                  {itemsSubTotal.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                  })}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm text-[#06284B] font-normal">
                <div className="flex items-center gap-4">
                  <span className="text-[#E71010] font-normal text-base">
                    Discount
                  </span>
                  <div className="relative">
                    <input
                      type="text"
                      value={globalDiscountPercent}
                      onChange={(e) => setGlobalDiscountPercent(e.target.value)}
                      onFocus={(e) => e.target.select()}
                      className="w-24 h-8 border border-[#CFCFCF] rounded px-6 text-end text-sm outline-none focus:border-[#2E5B9A] pr-8"
                    />
                    <span className="absolute right-2 top-1/2 -translate-y-1/2 text-base text-gray-600 font-normal">
                      %
                    </span>
                  </div>
                </div>
                <span className="text-[#E71010] font-light text-base">
                  ฿{" "}
                  {globalDiscountPct === 0
                    ? "0.00"
                    : taxableAmount.toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                      })}
                </span>
              </div>
              <div className="flex justify-between text-base text-[#2A2A2A]">
                <span>Tax (7%)</span>
                <span className="text-[#2A2A2A] font-light">
                  ฿{" "}
                  {taxTotal.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                  })}
                </span>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-gray-100">
            <div className="flex justify-between items-baseline mb-6">
              <span className="text-[#2A2A2A] font-normal text-xl">
                Grand Total
              </span>
              <span className="text-[#2A2A2A] font-normal text-xl">
                ฿{" "}
                {grandTotal.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                })}
              </span>
            </div>

            <button
              onClick={handleFinishOrder}
              disabled={loading || items.length === 0}
              className="w-full h-12 bg-[#005AA7] hover:bg-[#084072] disabled:opacity-70 disabled:cursor-not-allowed text-white text-base rounded-md font-normal flex items-center justify-center transition-colors"
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
