import type {
  CreateMasterResponse,
  MasterItem,
  MasterType,
} from "../types/master";
import type { BackendAccessoryMaster } from "../types/product/response";
import type { SelectOption } from "../types/shared/select";
import { API_BASE, getAuthHeaders, readJson } from "./apiClient";

type MastersResponse = {
  success: boolean;
  count?: number;
  data?: MasterItem[];
  message?: string;
};

export async function createMaster(
  type: string,
  name: string,
): Promise<CreateMasterResponse> {
  const res = await fetch(`${API_BASE}/create-masters`, {
    method: "POST",
    headers: {
      ...getAuthHeaders(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      master_type: type,
      master_name: name,
    }),
  });

  const json = await readJson<CreateMasterResponse>(res);

  if (!json.success) {
    throw new Error(json.message || "Create master failed");
  }

  return json;
}

export async function fetchMasterOptions(
  type: MasterType,
): Promise<SelectOption[]> {
  try {
    const res = await fetch(
      `${API_BASE}/masters?type=${encodeURIComponent(type)}`,
      {
        method: "GET",
        headers: getAuthHeaders(),
      },
    );

    if (res.status === 401) {
      console.warn(`[fetchMasterOptions] Unauthorized for ${type}`);
      return [];
    }

    if (!res.ok) {
      console.warn(`[fetchMasterOptions] Failed ${type}, status=${res.status}`);
      return [];
    }

    const json = await readJson<MastersResponse>(res);

    if (!json.success || !Array.isArray(json.data)) return [];

    return json.data.map((m) => ({
      label: m.master_name,
      value: m._id,
    }));
  } catch (err) {
    console.error(err);
    return [];
  }
}

export async function fetchAccessoryMaster(): Promise<
  BackendAccessoryMaster[]
> {
  const res = await fetch(`${API_BASE}/product/all?category=accessory`, {
    headers: getAuthHeaders(),
  });

  if (!res.ok) return [];

  const json = await readJson<{
    success: boolean;
    data?: BackendAccessoryMaster[];
  }>(res);

  if (!json.success || !Array.isArray(json.data)) return [];

  return json.data;
}
