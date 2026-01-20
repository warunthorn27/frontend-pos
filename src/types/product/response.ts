// backend output

export type ProductListItem = {
  _id: string;
  image: string | null;
  code: string;
  name: string;
  category: string;
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

export type BackendAccessory = {
  product_id?: {
    _id: string;
    product_name?: string;
    product_code?: string;
  };
  weight?: number;
  size?: string;
  metal?: string;
  description?: string;
};

export type BackendAdditionalStone = {
  stone_name?: string;
  shape?: string;
  size?: string;
  color?: string;
  cutting?: string;
  quality?: string;
  clarity?: string;
  qty?: number;
  weight?: number;
};

export type ProductDetailResponse = {
  _id: string;
  is_active: boolean;
  product_name: string;
  product_code: string;
  product_item_type: string;

  attributes?: {
    metal?: { name: string };
    metal_color?: { name: string };
  };

  product_detail_id: {
    size?: string;
    description?: string;
    gross_weight?: number;
    net_weight?: number;

    primary_stone?: {
      stone_name?: string;
      shape?: string;
      size?: string;
      weight?: number;
      color?: string;
      cutting?: string;
      quality?: string;
      clarity?: string;
    };

    additional_stones?: BackendAdditionalStone[];

    related_accessories?: BackendAccessory[];
  };
};

export type ProductGetOneResponse = {
  _id: string;
  product_name: string;
  product_code: string;
  product_category: string;
  product_item_type: string;

  attributes?: {
    metal?: { name: string };
    metal_color?: { name: string };
  };

  product_detail_id?: {
    size?: string;
    description?: string;
    gross_weight?: number;
    net_weight?: number;
  };
};

export type CategoryOption = {
  _id: string;
  name: string;
};

export type ItemTypeOption = {
  _id: string;
  name: string;
};

export type BackendProductResponse = {
  _id: string;
  is_active?: boolean;
  product_name?: string;
  product_code?: string;
  product_item_type?: string;

  product_detail_id?: {
    size?: string;
    description?: string;
    gross_weight?: number;
    net_weight?: number;

    primary_stone?: {
      stone_name?: string;
      shape?: string;
      size?: string;
      weight?: number;
      color?: string;
      cutting?: string;
      quality?: string;
      clarity?: string;
    };

    additional_stones?: Array<{
      stone_name?: string;
      shape?: string;
      size?: string;
      weight?: number;
      color?: string;
      cutting?: string;
      quality?: string;
      clarity?: string;
    }>;
  };

  attributes?: {
    metal?: { name?: string };
    metal_color?: { name?: string };
  };

  related_accessories?: Array<{
    code?: string;
    name?: string;
    weight?: number;
  }>;
};
