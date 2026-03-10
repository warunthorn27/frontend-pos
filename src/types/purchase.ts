import type { ProductCategory } from "./product/form";
import type { WeightUnit } from "./shared/unit";

// backend type
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

// frontend type
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
};

// payload
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
