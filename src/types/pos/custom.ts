/* ============================================================
   Custom Order Types
============================================================ */

export interface AdditionalStone {
  stone_name_id?: string;
  stone_shape_id?: string;
  cutting?: string;
  quality?: string;
  clarity?: string;
  color?: string;
  size?: string;
  s_weight?: number;
}

export interface CustomSpec {
  item_type_id?: string;
  metal_id?: string;
  metal_color?: string;
  stone_name_id?: string;
  stone_shape_id?: string;
  cutting?: string;
  quality?: string;
  clarity?: string;
  color?: string;
  size?: string;
  s_weight?: number;
  product_name?: string;
  product_size?: string;
  description?: string;
  nwt?: number;
  gwt?: number;
  additional_stones?: AdditionalStone[];
}

export interface CustomSessionItem {
  session_id: string;
  product_id: string;
  product_code: string;
  product_name: string;
  image: string | null;
  metal?: string;
  metal_color?: string;
  size?: string;
  /** deposit amount (label shown under product info) */
  deposit?: number;
  price?: number;
  qty: number;
  is_customized?: boolean;
  custom_spec?: CustomSpec;
}

export interface AddToCustomSessionResponse {
  success: boolean;
  message?: string;
  data?: CustomSessionItem;
}

export interface CustomSessionListResponse {
  success: boolean;
  data: CustomSessionItem[];
}
