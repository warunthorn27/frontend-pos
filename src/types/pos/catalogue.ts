export type CatalogueMode = "master" | "inventory";

/* ========================================
   POS API TYPES (Backend response)
======================================== */
export interface PosCategory {
  _id: string;
  master_name: string;
}

export interface PosItemType {
  _id: string;
  name: string;
  image: string | null;
  count: number;
}

export interface PosProduct {
  _id: string;
  product_code: string;
  product_name: string;
  image: string | null;
  unit?: string;
  size?: string;
  metal?: string;
  metal_color?: string;
  price: number;
  quantity: number;
}

export interface PosProductListResponse {
  success: boolean;
  data: PosProduct[];
  pagination: {
    total: number;
    page: number;
    pages: number;
  };
}

export interface PosProductDetail {
  _id: string;
  product_code: string;
  product_name: string;

  description: string;
  images: string[];

  cover_image: string | null;

  price: number;
  quantity: number;

  unit: string;
}

/* ========================================
   UI TYPES (Catalogue Components)
======================================== */

export interface CatalogueCategoryItem {
  id: string;
  label: string;
  image?: string | null;
}

export interface CatalogueProductItem {
  id: string;
  code: string;
  name: string;
  description?: string;
  metal?: string;
  metalColor?: string;
  size?: string;
  price?: number;
  currency?: string;
  imageUrl?: string | null;
  inStock?: boolean;
}

export interface PosProductBulk {
  _id: string;
  product_code: string;
  product_name: string;
  image: string | null;
  price: number;
}
