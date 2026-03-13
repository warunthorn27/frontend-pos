import { useEffect, useState, useCallback } from "react";
import PosTopNav from "../../components/PosTopNav";
import {
  getCustomSessionList,
  updateCustomSession,
  getNextOrderNumber,
  deleteCustomSessionItem,
  clearCustomSession,
  finishCustomOrder,
  getPosCustomers,
  addToCustomSession,
} from "../../../../services/pos/posCustom";
import type { PosCustomer } from "../../../../services/pos/posCustom";
import type { CustomSessionItem } from "../../../../types/pos/custom";
import { useCustomSession } from "../../context/CustomSessionContext";
import CustomerDropdown from "../../components/CustomerDropdown";
import ProductCustomEditorModal from "../../custom/ProductCustomEditorModal";
import { getProducts } from "../../../../services/pos/posCatalogue";
import type { PosProduct } from "../../../../types/pos/catalogue";
import { getCategoryLabel } from "../../../../utils/categoryOptions";
import CustomerCreateModal from "../../components/CustomerCreateModal";
import SearchIcon from "../../../../assets/svg/search.svg?react";
import BoxItemsIcon from "../../../../assets/svg/box-items.svg?react";
import ProductImage from "../../../products/product-list/components/ProductImage";
import DeleteIcon from "../../../../assets/svg/trash.svg?react";
import EditIcon from "../../../../assets/svg/draw.svg?react";

const PosCustomPage = () => {
  const [items, setItems] = useState<CustomSessionItem[]>([]);
  const [loading, setLoading] = useState(false);
  const { refreshCount } = useCustomSession();
  const [orderRef, setOrderRef] = useState<string>("");
  const [customers, setCustomers] = useState<PosCustomer[]>([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>("");
  // deposit per session_id (local, user types here)
  const [deposits, setDeposits] = useState<Record<string, string>>({});

  // Editor Modal State
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<CustomSessionItem | null>(
    null,
  );

  // Search State
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<PosProduct[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);

  // Customer Modal State
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);

  /* ── Load session items ───────────────────────── */
  const loadItems = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getCustomSessionList();
      setItems(data);
    } catch (err) {
      console.error("Failed to load custom session", err);
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
    getNextOrderNumber()
      .then((no) => setOrderRef(no))
      .catch(() =>
        setOrderRef(`CST-${Math.floor(100000 + Math.random() * 900000)}`),
      );

    fetchCustomers();
  }, [loadItems, refreshCount, fetchCustomers]);

  /* ── Update qty (delete if would go below 1) ────── */
  const handleQtyChange = async (item: CustomSessionItem, delta: number) => {
    const newQty = item.qty + delta;

    if (newQty < 1) {
      await handleDelete(item.session_id);
      return;
    }

    if (newQty === item.qty) return;

    // Optimistic update
    setItems((prev) =>
      prev.map((i) =>
        i.session_id === item.session_id ? { ...i, qty: newQty } : i,
      ),
    );

    try {
      await updateCustomSession(item.session_id, newQty);
      refreshCount();
    } catch (err) {
      console.error("Failed to update qty", err);
      loadItems(); // revert on error
    }
  };

  /* ── Delete single item ──────────────────────────── */
  const handleDelete = async (sessionId: string) => {
    setItems((prev) => prev.filter((i) => i.session_id !== sessionId));
    try {
      await deleteCustomSessionItem(sessionId);
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
      await clearCustomSession();
      refreshCount();
    } catch (err) {
      console.error("Failed to clear session", err);
      loadItems();
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
      const formattedItems = items.map((item) => ({
        session_id: item.session_id,
        product_id: item.product_id,
        product_code: item.product_code,
        product_name: item.product_name,
        image: item.image,
        qty: item.qty,
        unit_price: item.price || 0,
        deposit:
          parseFloat(deposits[item.session_id] ?? "") ||
          (item.deposit ?? item.price ?? 0),
      }));

      const payload = {
        customer_id: selectedCustomerId,
        items: formattedItems,
        sub_total: items.reduce((sum, i) => sum + (i.price || 0) * i.qty, 0),
        discount_total: 0,
        total_deposit: totalDeposit,
        grand_total: totalDeposit, // Assuming Grand Total for custom is the deposit total
        remark: "",
      };

      await finishCustomOrder(payload);
      setItems([]);
      setSelectedCustomerId("");
      setDeposits({});
      refreshCount();
      getNextOrderNumber()
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

  const handleEdit = (item: CustomSessionItem) => {
    setEditingItem(item);
    setIsEditorOpen(true);
  };

  const handleCustomerCreated = async (newCustomerId: string) => {
    setIsCustomerModalOpen(false);
    await fetchCustomers();
    setSelectedCustomerId(newCustomerId);
  };

  /* ── Search Items from Master ─────────────────── */
  const handleSearch = async (query: string, isFocus = false) => {
    setSearchQuery(query);

    // If query is empty and it's from focus, we still want to show initial items
    if (!query.trim() && !isFocus) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }

    setIsSearching(true);
    setShowResults(true);
    try {
      const res = await getProducts({
        view_mode: "master",
        search: query.trim() || undefined, // empty string means show default/recent
        limit: 100, // Fetch enough to cover all products (63 as seen in Postman)
      });
      setSearchResults(res.data);
    } catch (err) {
      console.error("Search failed", err);
    } finally {
      setIsSearching(false);
    }
  };

  const handleAddFromSearch = async (product: PosProduct) => {
    setLoading(true);
    try {
      await addToCustomSession(product._id);
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

  /* ── Derived totals ───────────────────────────── */
  const totalItems = items.reduce((sum, i) => sum + i.qty, 0);
  const totalDeposit = items.reduce((sum, i) => {
    const d =
      parseFloat(deposits[i.session_id] ?? "") || (i.deposit ?? i.price ?? 0);
    return sum + d * i.qty;
  }, 0);

  const today = new Date().toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return (
    <div className="flex flex-col h-full bg-[#F8F8F8] font-inherit">
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
                    className="absolute top-11 left-0 w-full bg-white border border-[#E5E7EB] rounded-lg shadow-xl z-[60] max-h-[360px] overflow-auto [&::-webkit-scrollbar]:hidden"
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
                      <div className="divide-y divide-gray-50">
                        {searchResults.map((product) => (
                          <div
                            key={product._id}
                            onClick={() => handleAddFromSearch(product)}
                            className="flex items-center gap-4 p-3 hover:bg-blue-50 cursor-pointer transition-colors"
                          >
                            <div className="w-12 h-12 rounded bg-gray-50 border border-gray-100 flex-shrink-0 overflow-hidden flex items-center justify-center">
                              {product.image && (
                                <img
                                  src={product.image}
                                  className="w-full h-full object-cover"
                                />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="text-[14px] font-semibold text-[#06284B] truncate">
                                {product.product_name}
                              </h4>
                              <div className="flex justify-between items-center mt-0.5">
                                <p className="text-[12px] text-gray-400">
                                  {product.product_code}
                                </p>
                                <span className="text-[12px] text-gray-400 font-normal">
                                  {getCategoryLabel(
                                    product.category || product.master_name,
                                  )}
                                </span>
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
                    className="fixed inset-0 z-[50]"
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
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {items.map((item) => (
                  <div key={item.session_id} className="py-6 first:pt-0">
                    <div className="flex items-center gap-8">
                      {/* Image */}
                      <ProductImage
                        imageUrl={item.image ?? null}
                        alt={item.product_name}
                        className="w-[72px] h-[72px] shrink-0"
                      />

                      {/* Product Info */}
                      <div className="flex-1 min-w-[220px]">
                        <div className="flex items-center gap-2">
                          <h3 className="text-base font-normal text-[#2A2A2A]">
                            {item.product_name}
                          </h3>

                          {item.is_customized && (
                            <span className="bg-[#EBF5FF] text-[#0066CC] text-[11px] px-2 py-0.5 rounded">
                              Customized
                            </span>
                          )}
                        </div>

                        <div className="text-sm text-gray-500 mt-1">
                          {[
                            item.product_code,
                            item.metal,
                            item.metal_color,
                            item.size,
                          ]
                            .filter(Boolean)
                            .join(" / ")}
                        </div>
                      </div>

                      {/* Deposit */}
                      <div className="w-[140px]">
                        <input
                          type="text"
                          placeholder="Deposit"
                          value={
                            deposits[item.session_id] ??
                            (item.deposit != null
                              ? item.deposit.toLocaleString()
                              : item.price != null
                                ? item.price.toLocaleString()
                                : "")
                          }
                          onChange={(e) =>
                            setDeposits((prev) => ({
                              ...prev,
                              [item.session_id]: e.target.value,
                            }))
                          }
                          className="w-full h-[36px] border border-[#CFCFCF] rounded-md px-3 text-sm outline-none focus:border-[#005AA7]"
                        />
                      </div>

                      {/* Qty */}
                      <div className="flex items-center gap-4 w-[120px] justify-center">
                        <button
                          onClick={() => handleQtyChange(item, -1)}
                          className="w-7 h-7 border border-[#CFCFCF] rounded-full flex items-center justify-center text-gray-700 hover:bg-gray-200"
                        >
                          −
                        </button>

                        <span className="w-4 text-center text-base font-normal">
                          {item.qty}
                        </span>

                        <button
                          onClick={() => handleQtyChange(item, 1)}
                          className="w-7 h-7 border border-[#CFCFCF] rounded-full flex items-center justify-center text-gray-700 hover:bg-gray-200"
                        >
                          +
                        </button>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 w-[60px] justify-end">
                        <button
                          onClick={() => handleEdit(item)}
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
        <div className="w-[450px] bg-white border border-[#E5E7EB] rounded-xl p-6 flex flex-col justify-between overflow-hidden">
          <div>
            <div className="flex justify-between text-lg text-[#2A2A2A] mb-6">
              <span>#{orderRef}</span>
              <span className="font-light">{today}</span>
            </div>

            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-4">
                <label className="text-lg font-normal text-[#2A2A2A] whitespace-nowrap">
                  Customer <span className="text-[#E71010]">*</span>
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

            <div className="space-y-4 pt-6 border-t border-gray-100">
              <div className="flex justify-between text-base font-normal text-[#2A2A2A]">
                <span>Total Items</span>
                <span className="text-base font-light text-[#2A2A2A]">
                  {totalItems}
                </span>
              </div>
              <div className="flex justify-between text-base font-normal text-[#2A2A2A]">
                <span>Total Deposit</span>
                <span className="text-base font-light text-[#2A2A2A]">
                  ฿{" "}
                  {totalDeposit.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                  })}
                </span>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-gray-100">
            <div className="flex justify-between items-baseline mb-6">
              <span className="text-text-[#2A2A2A] font-normal text-xl">
                Grand Total
              </span>
              <span className="text-text-[#2A2A2A] font-normal text-xl">
                ฿{" "}
                {totalDeposit.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                })}
              </span>
            </div>

            <button
              onClick={handleFinishOrder}
              disabled={loading || items.length === 0}
              className="w-full h-12 bg-[#005AA7] hover:bg-[#004A8A] disabled:opacity-70 disabled:cursor-not-allowed text-white rounded-md font-normal flex items-center justify-center transition-colors"
            >
              {loading ? "Processing..." : "Finish Order"}
            </button>
          </div>
        </div>
      </div>

      {/* Editor Modal */}
      {editingItem && (
        <ProductCustomEditorModal
          isOpen={isEditorOpen}
          onClose={() => {
            setIsEditorOpen(false);
            setEditingItem(null);
          }}
          item={editingItem}
          customerId={selectedCustomerId}
          onSaveSuccess={() => {
            loadItems(); // refresh list to see "Customized" badge or data
            refreshCount();
          }}
        />
      )}

      <CustomerCreateModal
        open={isCustomerModalOpen}
        onClose={() => setIsCustomerModalOpen(false)}
        onSuccess={handleCustomerCreated}
      />
    </div>
  );
};

export default PosCustomPage;
