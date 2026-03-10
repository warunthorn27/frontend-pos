import type {
  InventoryDetailResponse,
  InventoryResponse,
} from "../types/inventory";
import { API_BASE, getAuthHeaders } from "./apiClient";

export async function getInventory(params?: {
  warehouse?: string;
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
  start_date?: string;
  end_date?: string;
  category?: string;
}): Promise<InventoryResponse> {
  const query = new URLSearchParams();

  if (params?.warehouse) query.append("warehouse", params.warehouse);
  if (params?.page) query.append("page", String(params.page));
  if (params?.limit) query.append("limit", String(params.limit));
  if (params?.status) query.append("status", params.status);
  if (params?.search) query.append("search", params.search);
  if (params?.start_date) query.append("start_date", params.start_date);
  if (params?.end_date) query.append("end_date", params.end_date);
  if (params?.category) {
    query.append("category", params.category);
  }

  const url =
    query.toString().length > 0
      ? `${API_BASE}/stock?${query.toString()}`
      : `${API_BASE}/stock`;

  const res = await fetch(url, {
    headers: getAuthHeaders(),
  });

  const json: InventoryResponse = await res.json();
  return json;
}

// inventory details
export async function getInventoryDetail(
  id: string,
): Promise<InventoryDetailResponse> {
  const res = await fetch(`${API_BASE}/stock/detail/${id}`, {
    headers: getAuthHeaders(),
  });

  const json = await res.json();
  return json.data;
}
