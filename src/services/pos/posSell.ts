import { API_BASE, fetchWithAuth } from "../apiClient";
import type {
  SellSessionItem,
  SellSessionListResponse,
  SellSearchResponse,
  SaveSellOrderPayload
} from "../../types/pos/sell";

/* =========================================================
   1. SEARCH PRODUCTS FOR SELL
   GET /sell/search?keyword=...
========================================================= */

export const searchProductsForSell = async (keyword: string): Promise<SellSearchResponse> => {
  const url = `${API_BASE}/sell/search?keyword=${encodeURIComponent(keyword)}`;
  return fetchWithAuth<SellSearchResponse>(url);
};

/* =========================================================
   2. ADD PRODUCT TO SELL SESSION
   POST /POS/sell/add
========================================================= */

export const addToSellSession = async (payload: {
  product_id: string;
  unit_price: number;
  original_price?: number;
}): Promise<{ success: boolean; status: string; badge_count: number }> => {
  const url = `${API_BASE}/POS/sell/add`;
  return fetchWithAuth<{ success: boolean; status: string; badge_count: number }>(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
};

/* =========================================================
   3. GET SELL SESSION LIST
   GET /POS/sell/list
========================================================= */

export const getSellSessionList = async (): Promise<SellSessionListResponse> => {
  const url = `${API_BASE}/POS/sell/list`;
  return fetchWithAuth<SellSessionListResponse>(url);
};

/* =========================================================
   4. GET NEXT ORDER NUMBER (PREVIEW)
   GET /sell/next-order-no
========================================================= */

export const getNextSellOrderNumber = async (): Promise<string> => {
  const url = `${API_BASE}/sell/next-order-no`;
  const res = await fetchWithAuth<{ success: boolean; order_no: string }>(url);
  return res.order_no;
};

/* =========================================================
   5. UPDATE SELL SESSION ITEM
   PUT /POS/sell/update/:session_id
========================================================= */

export const updateSellSessionItem = async (
  sessionId: string,
  payload: {
    qty?: number;
    unit_price?: number;
    discount_percent?: number;
    discount_amount?: number;
  }
): Promise<{ success: boolean }> => {
  const url = `${API_BASE}/POS/sell/update/${sessionId}`;
  return fetchWithAuth<{ success: boolean }>(url, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
};

/* =========================================================
   6. DELETE SELL SESSION ITEM
   DELETE /POS/sell/delete/:session_id
========================================================= */

export const deleteSellSessionItem = async (sessionId: string): Promise<{ success: boolean }> => {
  const url = `${API_BASE}/POS/sell/delete/${sessionId}`;
  return fetchWithAuth<{ success: boolean }>(url, { method: "DELETE" });
};

/* =========================================================
   7. CLEAR SELL SESSION
   DELETE /POS/sell/clear
========================================================= */

export const clearSellSession = async (): Promise<{ success: boolean }> => {
  const url = `${API_BASE}/POS/sell/clear`;
  return fetchWithAuth<{ success: boolean }>(url, { method: "DELETE" });
};

/* =========================================================
   8. FINISH SELL ORDER
   POST /sell/finish
========================================================= */

export const finishSellOrder = async (payload: SaveSellOrderPayload): Promise<{ success: boolean; order_no: string }> => {
  const url = `${API_BASE}/sell/finish`;
  return fetchWithAuth<{ success: boolean; order_no: string }>(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
};
