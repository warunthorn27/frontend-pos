// backend output

import type { BackendMaster } from "../master";
import type { ProductCategory } from "./form";

export type ProductListItem = {
  _id: string;
  image: string | null;
  product_code: string;
  product_name: string;

  category: {
    _id: string;
    master_name: string;
  };

  type_stone: string;
  size: string;
  metal: string;
  color: string;
  is_active: boolean;
};

export type ProductListResponse = {
  data: ProductListItem[];
  total: number;
};

// ใช้กับ fetchAccessoryMaster()
export type BackendAccessoryMaster = {
  _id: string;
  product_name: string;
  product_code: string;
  size: string;
  metal: string | BackendMaster;
  weight: string;
  unit: "g" | "cts";
  description?: string;
};

// ใช้กับ product.related_accessories[]
export type BackendRelatedAccessory = {
  product_id?: {
    _id: string;
    product_name?: string;
    product_code?: string;
  };
  weight?: string;
  unit?: "g" | "cts";
  size?: string;
  metal: string | BackendMaster;
  description?: string;
};

export type BackendAdditionalStone = {
  stone_name?: BackendMaster;
  shape?: BackendMaster;
  color?: string;
  cutting?: BackendMaster;
  quality?: BackendMaster;
  clarity?: BackendMaster;
  size?: string;
  weight?: string;
  unit?: "g" | "cts";
};

export type CategoryOption = {
  _id: string;
  name: string;
};

export type ItemTypeOption = {
  _id: string;
  name: string;
};

// export type BackendProductWithCategory = BackendProductResponse & {
//   product_category: ProductCategory;
// };

// Api model ใช้แทนข้อมูลที่มาจาก backend

export type FormattedProductResponse = {
  product_category: ProductCategory;
  _id: string;
  is_active: boolean;
  product_name: string;
  code: string;
  description?: string;

  category: {
    _id: string;
    name: string;
  };

  item_type?: {
    _id: string;
    name: string;
  };

  product_size?: string;

  metal?: {
    _id: string;
    name: string;
  };

  metal_color?: {
    _id: string;
    name: string;
  };

  weight?: number;
  gross_weight?: number;
  net_weight?: number;
  unit?: "g" | "cts";

  primary_stone?: {
    stone_name?: { _id: string; name: string };
    shape?: { _id: string; name: string };
    size?: string;
    weight?: number;
    unit?: "g" | "cts";
    color?: string;
    cutting?: { _id: string; name: string };
    quality?: { _id: string; name: string };
    clarity?: { _id: string; name: string };
  };

  additional_stones?: Array<{
    stone_name?: { _id: string; name: string };
    shape?: { _id: string; name: string };
    size?: string;
    weight?: number;
    unit?: "g" | "cts";
    color?: string;
    cutting?: { _id: string; name: string };
    quality?: { _id: string; name: string };
    clarity?: { _id: string; name: string };
  }>;

  related_accessories?: Array<{
    product_id: {
      _id: string;
      product_name: string;
      product_code: string;

      product_detail_id?: {
        unit: "g" | "cts";
        weight: number;
      };
    };
    weight?: number;
    unit: "g" | "cts";
    size: string;
    metal: {
      _id: string;
      name: string;
    };
    description?: string;
  }>;

  file?: string[];
};
