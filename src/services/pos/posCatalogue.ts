import { API_BASE, fetchWithAuth } from "../apiClient";

import type {
  PosItemType,
  PosProductDetail,
  PosProductListResponse,
} from "../../types/pos/catalogue";

/* =========================================================
   1. GET ITEM TYPES
   GET /POS/ItemTypes
========================================================= */

export const getItemTypes = async (
  category: string,
): Promise<PosItemType[]> => {
  const url = `${API_BASE}/POS/ItemTypes?category=${category}`;

  const res = await fetchWithAuth<{
    success: boolean;
    data: {
      _id: string;
      name: string;
      image: string | null;
      count: number;
    }[];
  }>(url);

  return res.data.map((item) => ({
    id: item._id,
    name: item.name,
    image: item.image,
    count: item.count,
  }));
};

/* =========================================================
   2. GET PRODUCT LIST
   GET /POS/Product/list
========================================================= */

interface GetProductsParams {
  category: string;
  item_type_id?: string;
  view_mode: "master" | "inventory";
  page?: number;
  limit?: number;
  search?: string;
}

// export const getProducts = async (
//   params: GetProductsParams,
// ): Promise<{
//   data: PosProduct[];
//   pagination: PosProductListResponse["pagination"];
// }> => {
//   const query = new URLSearchParams();

//   query.append("category", params.category);
//   query.append("view_mode", params.view_mode);

//   if (params.item_type) query.append("item_type", params.item_type);
//   if (params.page) query.append("page", String(params.page));
//   if (params.limit) query.append("limit", String(params.limit));
//   if (params.search) query.append("search", params.search);

//   const url = `${API_BASE}/POS/Product/list?${query.toString()}`;

//   const res = await fetchWithAuth<{
//     success: boolean;
//     data: PosProduct[];
//     pagination: PosProductListResponse["pagination"];
//   }>(url);

//   return {
//     data: res.data,
//     pagination: res.pagination,
//   };
// };

export const getProducts = async (
  params: GetProductsParams,
): Promise<PosProductListResponse> => {
  const query = new URLSearchParams();

  query.append("category", params.category);
  query.append("view_mode", params.view_mode);

  if (params.item_type_id) query.append("item_type", params.item_type_id);
  if (params.page) query.append("page", String(params.page));
  if (params.limit) query.append("limit", String(params.limit));
  if (params.search) query.append("search", params.search);

  const url = `${API_BASE}/POS/Product/list?${query.toString()}`;
  const res = await fetchWithAuth<PosProductListResponse>(url);

  return res;
};

/* =========================================================
   3. GET PRODUCT DETAIL
   GET /POS/Product/Detail/:id
========================================================= */

export const getProductDetail = async (
  productId: string,
): Promise<PosProductDetail> => {
  const url = `${API_BASE}/POS/Product/Detail/${productId}`;

  const res = await fetchWithAuth<{
    success: boolean;
    data: PosProductDetail;
  }>(url);

  return res.data;
};
