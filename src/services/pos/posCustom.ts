import { API_BASE, fetchWithAuth } from "../apiClient";
import type {
  CustomSessionItem,
  AddToCustomSessionResponse,
  CustomSessionListResponse,
} from "../../types/pos/custom";

/* =========================================================
   1. ADD PRODUCT TO CUSTOM SESSION
   POST /POS/custom/add-to-custom-session
========================================================= */

export const addToCustomSession = async (
  productId: string,
): Promise<AddToCustomSessionResponse> => {
  const url = `${API_BASE}/POS/custom/add-to-custom-session`;

  const res = await fetchWithAuth<AddToCustomSessionResponse>(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ product_id: productId }),
  });

  return res;
};

/* =========================================================
   2. GET CUSTOM SESSION LIST
   GET /POS/custom/custom-session-list
========================================================= */

export const getCustomSessionList = async (): Promise<CustomSessionItem[]> => {
  const url = `${API_BASE}/POS/custom/custom-session-list`;

  const res = await fetchWithAuth<CustomSessionListResponse>(url);

  return res.data;
};

/* =========================================================
   3. UPDATE QTY IN CUSTOM SESSION
   PUT /POS/custom/update-custom/:session_id
========================================================= */

export const updateCustomSession = async (
  sessionId: string,
  qty: number,
): Promise<void> => {
  const url = `${API_BASE}/POS/custom/update-custom/${sessionId}`;

  await fetchWithAuth<{ success: boolean }>(url, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ qty }),
  });
};

/* =========================================================
   4. GET NEXT ORDER NUMBER (PREVIEW)
   GET /custom/next-order-no
========================================================= */

export const getNextOrderNumber = async (): Promise<string> => {
  const url = `${API_BASE}/custom/next-order-no`;

  const res = await fetchWithAuth<{ success: boolean; order_no: string }>(url);

  return res.order_no;
};

/* =========================================================
   5. GET CUSTOMERS FOR POS DROPDOWN
   GET /POS/all-customer
========================================================= */

export interface PosCustomer {
  _id: string;
  customer_id: string;
  customer_name: string;
  customer_phone?: string;
}

export const getPosCustomers = async (): Promise<PosCustomer[]> => {
  const url = `${API_BASE}/POS/all-customer`;

  const res = await fetchWithAuth<{
    success: boolean;
    data: PosCustomer[];
  }>(url);

  return res.data;
};

/* =========================================================
   6. DELETE SINGLE SESSION ITEM
   DELETE /POS/custom/delete-custom-item/:session_id
========================================================= */

export const deleteCustomSessionItem = async (
  sessionId: string,
): Promise<void> => {
  const url = `${API_BASE}/POS/custom/delete-custom-item/${sessionId}`;

  await fetchWithAuth<{ success: boolean }>(url, { method: "DELETE" });
};

/* =========================================================
   6. CLEAR ALL SESSION ITEMS
   DELETE /POS/custom/clear-custom-session
========================================================= */

export const clearCustomSession = async (): Promise<void> => {
  const url = `${API_BASE}/POS/custom/clear-custom-session`;

  await fetchWithAuth<{ success: boolean }>(url, { method: "DELETE" });
};

/* =========================================================
   7. SAVE CUSTOMIZED PRODUCT SPEC
   POST /POS/custom/save-custom-product
========================================================= */

export const saveCustomProduct = async (payload: {
  session_id: string;
  customer_id: string;
  detail_data: any;
}): Promise<void> => {
  const url = `${API_BASE}/POS/custom/save-custom-product`;

  await fetchWithAuth<{ success: boolean }>(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
};

/* =========================================================
   8. FINISH CUSTOM ORDER
   POST /POS/custom/finish-custom-order
========================================================= */

export const finishCustomOrder = async (payload: {
  customer_id: string;
  items: any[];
  sub_total: number;
  discount_total: number;
  total_deposit: number;
  grand_total: number;
  remark?: string;
}): Promise<{ order_no: string }> => {
  const url = `${API_BASE}/POS/custom/finish-custom-order`;

  const res = await fetchWithAuth<{ success: boolean; order_no: string }>(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  return { order_no: res.order_no };
};

/* =========================================================
   9. GET CUSTOM SESSION DETAIL
   GET /POS/custom/:session_id
========================================================= */

export const getCustomSessionDetail = async (sessionId: string): Promise<CustomSessionItem> => {
  const url = `${API_BASE}/POS/custom/${sessionId}`;
  const res = await fetchWithAuth<{ success: boolean; data: CustomSessionItem }>(url);
  return res.data;
};
