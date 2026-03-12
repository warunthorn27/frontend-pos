export interface SellSessionItem {
  session_id: string;
  customer_id?: string;
  product_id: string;
  product_code: string;
  product_name: string;
  subtitle: string;
  image: string | null;
  qty: number;
  max_qty: number;
  unit_price: number;
  discount_percent: number;
  discount_amount: number;
}

export interface SellSummary {
  current_date: string;
  total_items: number;
  sub_total: number;
  tax_rate: number;
}

export interface SellSessionListResponse {
  success: boolean;
  data: SellSessionItem[];
  summary: SellSummary;
}

export interface SellSearchProduct {
  product_id: string;
  product_code: string;
  product_name: string;
  category_name: string;
  image: string | null;
  qty_in_stock: number;
  unit_price: number;
}

export interface SellSearchResponse {
  success: boolean;
  data: SellSearchProduct[];
}

export interface SaveSellOrderPayload {
  customer_id: string;
  items: any[];
  sub_total: number;
  discount_percent?: number;
  discount_total: number;
  tax_rate?: number;
  tax_amount: number;
  grand_total: number;
  remark?: string;
}
