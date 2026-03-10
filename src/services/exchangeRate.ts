import { API_BASE, getAuthHeaders } from "./apiClient";

export async function getExchangeRate(currency: string, date: string) {
  const res = await fetch(
    `${API_BASE}/get-rate?currency=${currency}&date=${date}`,
    {
      headers: getAuthHeaders(),
    },
  );

  const json = await res.json();

  if (!res.ok) {
    throw new Error(json?.message || "Failed to fetch exchange rate");
  }

  return json; // return ทั้ง object
}
