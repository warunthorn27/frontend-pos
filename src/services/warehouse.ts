import { API_BASE, getAuthHeaders } from "./apiClient";

export async function getWarehouses() {
  const res = await fetch(`${API_BASE}/warehouse`, {
    headers: getAuthHeaders(),
  });

  if (!res.ok) throw new Error("Warehouse fetch failed");

  const json = await res.json();
  return json.data;
}
