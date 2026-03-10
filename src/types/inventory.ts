import type { StockUnit } from "./shared/unit";

// ==============================
// INVENTORY TAB
// ==============================

export type InventoryTab =
  | "all"
  | "product-master"
  | "stone-diamond"
  | "semi-mount"
  | "accessories"
  | "others";

// ==============================
// API RESPONSE TYPES
// ==============================

export interface InventoryApiItem {
  _id: string;
  image?: string;
  code: string;
  product_name: string;
  category?: string;
  date: string;
  unit: StockUnit;
  qty: number;
  cost: number;
  amount: number;
  sale_price: number;
  status: string;
}

// ==============================
// FRONTEND TYPES
// ==============================

export interface InventoryItem {
  id: string;
  index: number;
  image?: string;
  code: string;
  productName: string;
  category?: string;
  date: string;
  unit: string;
  qty: number;
  cost: number;
  amount: number;
  salePrice: number;
  status: string;
}

// ==============================
// PAGINATION RESPONSE
// ==============================

export interface InventoryResponse {
  success: boolean;
  count: number;
  total_record: number;
  total_page: number;
  current_page: number;
  limit: number;
  data: InventoryApiItem[];
}

// ==============================
// INVENTORY DETAIL TYPES
// ==============================

export interface InventoryDetailProduct {
  category: string;
  code: string;
  product_name: string;
  item_type: string;
  product_size: string;
  metal: string;
  metal_color: string;
  description: string;
  nwt: number;
  gwt: number;
  weight?: number;
}

export interface InventoryStoneDetails {
  stone_name: string;
  shape: string;
  size: string;
  s_weight: number;
  color: string;
  cutting: string;
  quality: string;
  clarity: string;
}

export interface InventoryAdditionalStone {
  stone_name: string;
  shape: string;
  size: string;
  s_weight: number;
  color?: string;
  cutting?: string;
  quality?: string;
  clarity?: string;
}

export interface InventoryAccessory {
  code: string;
  product_name: string;
  weight: number;
  size: string;
  metal: string;
  description: string;
}

export interface InventoryDetailResponse {
  _id: string;
  date: string;
  unit: "g" | "pcs"; // stock unit
  qty: number;
  avg_cost: number;
  total_cost_amount: number;
  sale_price: number;
  total_sale_amount: number;
  total_gross_weight: number;
  status: string;

  product_details: InventoryDetailProduct;
  stone_details: InventoryStoneDetails;
  additional_stones: InventoryAdditionalStone[];
  accessories: InventoryAccessory[];
}
