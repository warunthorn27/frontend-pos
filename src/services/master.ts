import type { MasterItem, MasterType } from "../types/master";
import type { SelectOption } from "../types/shared/select";
import { API_BASE, getAuthHeaders, readJson } from "./apiClient";

type MastersResponse = {
  success: boolean;
  count?: number;
  data?: MasterItem[];
  message?: string;
};

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
