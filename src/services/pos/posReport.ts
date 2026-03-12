import { API_BASE, fetchWithAuth } from "../apiClient";
import type { ReportListResponse } from "../../types/pos/report";

export interface ReportParams {
  order_type?: string;
  page?: number;
  limit?: number;
  search?: string;
  startDate?: string;
  endDate?: string;
}

export const getOrderReport = async (params: ReportParams): Promise<ReportListResponse> => {
  const query = new URLSearchParams();
  if (params.order_type) query.append("order_type", params.order_type);
  if (params.page) query.append("page", params.page.toString());
  if (params.limit) query.append("limit", params.limit.toString());
  if (params.search) query.append("search", params.search);
  if (params.startDate) query.append("startDate", params.startDate);
  if (params.endDate) query.append("endDate", params.endDate);
  
  const url = `${API_BASE}/report/orders?${query.toString()}`;
  return fetchWithAuth<ReportListResponse>(url);
};
