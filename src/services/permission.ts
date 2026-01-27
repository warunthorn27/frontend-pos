import type { PermissionDTO } from "../types/permission";
import { API_BASE } from "./apiClient";

type ListResponse = { data?: PermissionDTO[] };

export async function fetchPermissions(): Promise<PermissionDTO[]> {
  const res = await fetch(`${API_BASE}/permission`, {
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) throw new Error(`fetchPermissions failed: ${res.status}`);

  const json = (await res.json()) as ListResponse;
  return Array.isArray(json.data) ? json.data : [];
}
