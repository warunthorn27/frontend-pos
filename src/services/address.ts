import { API_BASE, getAuthHeaders, readJson } from "./apiClient";

export type AddressListResponse<T> = {
  success?: boolean;
  data?: T;
  message?: string;
};

export type SubDistrictItem = {
  sub_district: string;
  zipcode: string;
};

export async function getProvinces(): Promise<string[]> {
  const res = await fetch(`${API_BASE}/address/provinces`, {
    headers: getAuthHeaders(),
  });
  const json = await readJson<AddressListResponse<string[]>>(res);
  if (!res.ok) throw new Error(json.message || "Get provinces failed");
  return json.data ?? [];
}

export async function getDistricts(province: string): Promise<string[]> {
  const qs = new URLSearchParams({ province });
  const res = await fetch(`${API_BASE}/address/districts?${qs.toString()}`, {
    headers: getAuthHeaders(),
  });
  const json = await readJson<AddressListResponse<string[]>>(res);
  if (!res.ok) throw new Error(json.message || "Get districts failed");
  return json.data ?? [];
}

export async function getSubDistricts(
  province: string,
  district: string
): Promise<SubDistrictItem[]> {
  const qs = new URLSearchParams({ province, district });
  const res = await fetch(
    `${API_BASE}/address/sub-districts?${qs.toString()}`,
    { headers: getAuthHeaders() }
  );
  const json = await readJson<AddressListResponse<SubDistrictItem[]>>(res);
  if (!res.ok) throw new Error(json.message || "Get sub-districts failed");
  return json.data ?? [];
}
