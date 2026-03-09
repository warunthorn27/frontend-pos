import type { CreatePurchasePayload } from "../types/purchase";
import { API_BASE, getAuthHeaders } from "./apiClient";

export async function getNextPurchaseNumber(): Promise<string> {
  const res = await fetch(`${API_BASE}/purchase/next-number`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  const json = await res.json();

  if (!res.ok) {
    throw new Error(json?.message || "Failed to get purchase number");
  }

  return json.data;
}

export async function createPurchase(
  payload: CreatePurchasePayload,
): Promise<void> {
  const res = await fetch(`${API_BASE}/purchase/create`, {
    method: "POST",
    headers: {
      ...getAuthHeaders(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const json = await res.json();

  if (!res.ok) {
    throw new Error(json?.message || "Create purchase failed");
  }
}
