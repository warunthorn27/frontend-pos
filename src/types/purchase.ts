/* =========================================================
   PRODUCT TYPES
========================================================= */

import type { ProductCategory } from "./product/form";
import type { WeightUnit } from "./shared/unit";

// backend product
export type BackendProduct = {
  _id: string;
  product_code: string;
  product_name: string;
  category?:
    | string
    | {
        _id: string;
        master_name: string;
      };
  type_stone?: string | null;
  image?: string | null;

  gross_weight?: number;
  net_weight?: number;
  stone_weight?: number;
};

// frontend product
export type Product = {
  id: string;
  code: string;
  productName: string;

  category: ProductCategory;

  typeOrStoneName: string;
  imageUrl?: string;

  grossWeight?: number;
  netWeight?: number;
  stoneWeight?: number;

  hasStoneWeight?: boolean;
  hasNetWeight?: boolean;
};

/* =========================================================
   PURCHASE TABLE TYPES
========================================================= */

export type PurchaseItemRow = {
  productId: string;
  code: string;
  name: string;
  imageUrl?: string;

  category: ProductCategory;

  stoneWeight: string;
  stoneUnit: WeightUnit;

  netWeight: string;
  grossWeight: string;

  quantity: number;
  unit: "pcs" | "g";

  cost: number;
  amount: number;
  price: number;

  hasStoneWeight?: boolean;
  hasNetWeight?: boolean;

  /** import validation */
  isError?: boolean;
  errorReason?: string;

  validationErrors?: RowValidationErrors;
};

/* =========================================================
   API PAYLOAD
========================================================= */

export interface CreatePurchasePayload {
  date: string;
  vendor_name: string;
  ref1?: string;
  ref2?: string;
  note?: string;

  currency: string;
  manual_rate?: number;

  items: {
    product_id: string;
    quantity: number;
    unit: string;

    stone_weight: number;
    net_weight: number;
    gross_weight: number;

    cost: number;
    price: number;
  }[];
}

/* =========================================================
   IMPORT TYPES
========================================================= */

export interface ImportPurchaseResponse {
  success: boolean;
  count: number;

  data: ImportPurchaseItem[];

  hasError: boolean;
  errorCount: number;

  errorData: ImportErrorRow[];
}

export type ImportPurchaseItem = {
  product_id: string;
  code: string;
  name: string;
  image?: string;

  stone_weight?: number;
  net_weight?: number;
  gross_weight?: number;

  quantity?: number;
  unit?: "pcs" | "g";

  cost?: number;
  amount?: number;
  price?: number;

  isError?: boolean;
  errorReason?: string;
};

export type ImportErrorRow = {
  Code?: string;
  Name?: string;
  Category?: string;
  QTY?: number;

  Error_Reason: string;
  isError: true;
};

/* =========================================================
   FORM VALIDATION
========================================================= */

export type RowValidationErrors = {
  grossWeight?: boolean;
  quantity?: boolean;
  cost?: boolean;
  price?: boolean;
};
