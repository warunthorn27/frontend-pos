import type {
  AccessoriesForm,
  BaseProductForm,
  OthersForm,
  ProductCategory,
  StoneDiamondForm,
} from "./form";

export type ProductRow = {
  id: string;
  imageUrl: string | null;
  code: string;
  productName: string;
  category: ProductCategory; // logic
  categoryLabel: string; // display
  typeOrStone: string;
  size: string;
  metal: string;
  color: string;
  status: "active" | "inactive";
};

export const PRODUCT_CATEGORY_LABEL: Record<ProductCategory, string> = {
  productmaster: "Product Master",
  semimount: "Semi-Mount",
  stone: "Stone / Diamond",
  accessory: "Accessories",
  others: "Others",
};

// view model
export type ProductDetail = {
  id: string;
  name: string;
  code: string;
  category: string;
  itemType: string;
  size?: string;
  metal?: string;
  metalColor?: string;
  description?: string;
  grossWeight?: number;
  netWeight?: number;
};

export type ProductViewModalModel = {
  id: string;
  name: string;
  code: string;
  category: string;
  itemType: string;

  images: string[];

  productSize?: string;
  metal?: string;
  metalColor?: string;

  gwt?: string;
  nwt?: string;

  primaryStone?: {
    stoneName: string;
    shape: string;
    size: string;
    weight: string;
    color?: string;
    cutting?: string;
    quality?: string;
    clarity?: string;
  };

  accessories: {
    code: string;
    name: string;
    weight: string;
    unit: string;
    image?: string;
  }[];
};

export function mapBaseProductFormToUpdatePayload(form: BaseProductForm) {
  return {
    product_name: form.productName.trim(),
    code: form.code.trim(),
    item_type: form.itemType,
    size: form.productSize,
    metal: form.metal,
    metal_color: form.metalColor === "" ? "" : form.metalColor || undefined,
    gross_weight: form.gwt === "" ? undefined : Number(form.gwt),
    net_weight: form.nwt === "" ? undefined : Number(form.nwt),
    unit: "g",
    description: form.description === "" ? "" : form.description || undefined,
    primary_stone: {
      stone_name: form.primaryStone.stoneName,
      shape: form.primaryStone.shape,
      size: form.primaryStone.size,
      weight:
        form.primaryStone.weight === ""
          ? undefined
          : Number(form.primaryStone.weight),
      unit: form.primaryStone.unit,
      color: form.primaryStone.color,
      cutting: form.primaryStone.cutting,
      quality: form.primaryStone.quality,
      clarity: form.primaryStone.clarity,
    },

    additional_stones:
      form.additionalStones.length > 0
        ? form.additionalStones.map((s) => ({
            stone_name: s.stoneName || undefined,
            shape: s.shape || undefined,
            size: s.size || "",
            weight: s.weight === "" ? undefined : Number(s.weight),
            unit: s.unit,
            color: s.color || "",
            cutting: s.cutting || undefined,
            quality: s.quality || undefined,
            clarity: s.clarity || undefined,
          }))
        : [],

    related_accessories: form.accessories.productId
      ? [
          {
            product_id: form.accessories.productId,
            weight:
              form.accessories.weight === ""
                ? undefined
                : Number(form.accessories.weight),
            size: form.accessories.productSize,
            metal: form.accessories.metal,
            unit: form.accessories.unit ?? "g",
            description:
              form.accessories.description === ""
                ? ""
                : form.accessories.description || undefined,
          },
        ]
      : undefined,
  };
}

export function mapStoneFormToUpdatePayload(form: StoneDiamondForm) {
  return {
    product_name: form.productName,
    code: form.code,
    description: form.description ?? "",
    stone_name: form.stoneName,
    shape: form.shape,
    size: form.size,
    weight: form.weight === "" ? undefined : Number(form.weight),
    unit: form.unit,

    // ส่ง empty string ไปให้ backend update
    color: form.color ?? "",
    cutting: form.cutting ?? "",
    quality: form.quality ?? "",
    clarity: form.clarity ?? "",
  };
}

export function mapAccessoriesFormToUpdatePayload(
  form: AccessoriesForm,
): Record<string, unknown> {
  return {
    product_name: form.productName,
    code: form.code,
    size: form.productSize,
    metal: form.metal,
    weight: form.weight === "" ? undefined : Number(form.weight),
    unit: form.unit ?? "g",
    description: form.description ?? "",
  };
}

export function mapOthersFormToUpdatePayload(form: OthersForm) {
  return {
    product_name: form.productName,
    code: form.code,
    size: form.productSize,
    weight: form.weight === "" ? undefined : Number(form.weight),
    unit: form.unit,
    description: form.description ?? "",
  };
}
