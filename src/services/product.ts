import type { MasterItem } from "../types/master";
import type {
  CategoryOption,
  FormattedProductResponse,
  ProductListResponse,
} from "../types/product/response";
import { API_BASE, getAuthHeaders, ApiError } from "./apiClient";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      ...getAuthHeaders(),
      ...(init?.headers ?? {}),
    },
  });

  const text = await res.text();

  let data: unknown;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = null;
  }

  if (res.status === 401) {
    // ไม่ throw ทิ้งทันที
    return Promise.reject(new ApiError(401, "UNAUTHORIZED"));
  }

  if (!res.ok) {
    const message =
      typeof data === "object" && data !== null && "message" in data
        ? String((data as { message?: string }).message)
        : "Request failed";

    return Promise.reject(new ApiError(res.status, message));
  }

  return data as T;
}

/* =======================
   APIs
======================= */

// export function fetchProducts(params?: {
//   page?: number;
//   limit?: number;
//   category?: string;
//   search?: string;
// }) {
//   const query = new URLSearchParams();

//   if (params?.page) query.append("page", String(params.page));
//   if (params?.limit) query.append("limit", String(params.limit));
//   if (params?.category) query.append("category", params.category);
//   if (params?.search) query.append("search", params.search);

//   return request<ProductListResponse>(`/product/all?${query.toString()}`);
// }

export function fetchProducts(params?: {
  page?: number;
  limit?: number;
  category?: string;
  itemType?: string;
  stoneName?: string;
  search?: string;
}) {
  const query = new URLSearchParams();

  if (params?.page) {
    query.append("page", String(params.page));
  }

  if (params?.limit) {
    query.append("limit", String(params.limit));
  }

  if (params?.category) {
    query.append("category", params.category);
  }

  if (params?.itemType) {
    query.append("item_type", params.itemType);
  }

  if (params?.search) {
    query.append("search", params.search);
  }

  const queryString = query.toString();

  return request<ProductListResponse>(
    queryString ? `/product/all?${queryString}` : `/product/all`,
  );
}

export function getProductById(id: string) {
  return request<{ data: FormattedProductResponse }>(`/product/${id}`);
}

/* ---------- CREATE ---------- */
export function createMasterProduct(formData: FormData) {
  return request(`/master`, {
    method: "POST",
    body: formData,
  });
}

export function createStoneDiamond(formData: FormData) {
  return request(`/stone`, {
    method: "POST",
    body: formData,
  });
}

export function createSemiMount(formData: FormData) {
  return request(`/semimount`, {
    method: "POST",
    body: formData,
  });
}

export function createAccessory(formData: FormData) {
  return request(`/accessory`, {
    method: "POST",
    body: formData,
  });
}

export function createOthers(formData: FormData) {
  return request(`/others`, {
    method: "POST",
    body: formData,
  });
}

/* ---------- UPDATE ---------- */
// export function updateProduct(id: string, formData: FormData) {
//   return request<{ success: boolean }>(`/update-product/${id}`, {
//     method: "PUT",
//     body: formData,
//   });
// }

export async function updateProduct(id: string, formData: FormData) {
  const res = await request<{ data: FormattedProductResponse }>(
    `/update-product/${id}`,
    {
      method: "PUT",
      body: formData,
    },
  );

  return res.data;
}

export function updateStoneDiamond(id: string, formData: FormData) {
  return request<{ success: boolean }>(`/update-product/${id}`, {
    method: "PUT",
    body: formData,
  });
}

export function updateSemiMount(id: string, formData: FormData) {
  return request<{ success: boolean }>(`/update-product/${id}`, {
    method: "PUT",
    body: formData,
  });
}

export function updateAccessory(id: string, formData: FormData) {
  return request<{ success: boolean }>(`/update-product/${id}`, {
    method: "PUT",
    body: formData,
  });
}

export function updateOthers(id: string, formData: FormData) {
  return request<{ success: boolean }>(`/update-product/${id}`, {
    method: "PUT",
    body: formData,
  });
}

export function updateProductStatus(
  id: string,
  active: boolean,
): Promise<{ success: boolean }> {
  return request<{ success: boolean }>(`/update/product/status/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      is_active: active,
    }),
  });
}

/* ---------- DELETE ---------- */
export function deleteProduct(id: string) {
  return request<{ success: boolean }>(`/del-productOne/${id}`, {
    method: "DELETE",
  });
}

export function fetchCategories() {
  return request<{ data: CategoryOption[] }>("/category/all");
}

export function fetchItemTypes() {
  return request<{
    success: boolean;
    count: number;
    data: MasterItem[];
  }>("/masters?type=item_type");
}

export function fetchProductById(id: string) {
  return request<{ data: FormattedProductResponse }>(`/product/${id}`);
}
