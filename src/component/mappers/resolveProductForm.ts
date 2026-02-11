import type { FormattedProductResponse } from "../../types/product/response";
import type {
  AccessoriesForm,
  BaseProductForm,
  OthersForm,
  ProductCategory,
  StoneDiamondForm,
} from "../../types/product/form";
import {
  mapAccessoriesFormToUpdatePayload,
  mapBaseProductFormToUpdatePayload,
  mapOthersFormToUpdatePayload,
  mapStoneFormToUpdatePayload,
} from "../../types/product/transform";
import { extractId } from "../../utils/extractId";

/* =========================
   CATEGORY NORMALIZER
========================= */
export const CATEGORY_NAME_TO_KEY: Record<string, ProductCategory> = {
  "product master": "productmaster",
  "semi-mount": "semimount",
  "stone / diamond": "stone",
  stone: "stone",
  accessories: "accessory",
  others: "others",
};

export function normalizeCategoryFromList(category?: {
  master_name?: string;
}): ProductCategory {
  if (!category?.master_name) {
    throw new Error("Product category is missing from list");
  }

  const key = category.master_name.toLowerCase().replace(/\s|-/g, "");

  if (
    key === "productmaster" ||
    key === "semimount" ||
    key === "stone" ||
    key === "accessory" ||
    key === "others"
  ) {
    return key;
  }

  throw new Error(`Unknown product category: ${category.master_name}`);
}

export function normalizeCategoryFromDetail(category?: {
  name?: string;
}): ProductCategory {
  if (!category?.name) {
    throw new Error("Product category is missing from detail");
  }

  const key = category.name.toLowerCase().replace(/\s|-/g, "");

  if (
    key === "productmaster" ||
    key === "semimount" ||
    key === "stone" ||
    key === "accessory" ||
    key === "others"
  ) {
    return key;
  }

  throw new Error(`Unknown product category: ${category.name}`);
}

/* =========================
   RESOLVE BY CATEGORY
========================= */
type FormByCategory = {
  productmaster: BaseProductForm;
  semimount: BaseProductForm;
  stone: StoneDiamondForm;
  accessory: AccessoriesForm;
  others: OthersForm;
};

export function resolveProductFormByCategory(
  category: ProductCategory,
  product: FormattedProductResponse,
): FormByCategory[typeof category] {
  switch (category) {
    case "productmaster":
    case "semimount":
      return mapToBaseProductForm(product);

    case "stone":
      return mapToStoneDiamondForm(product);

    case "accessory":
      return mapToAccessoriesForm(product);

    case "others":
      return mapToOthersForm(product);
  }
}

// accessory = product ตัวมันเอง
export function resolveAccessoryForm(
  product: FormattedProductResponse,
): AccessoriesForm {
  return {
    active: product.is_active ?? true,
    productId: product._id,
    productName: product.product_name ?? "",
    code: product.code ?? "",
    productSize: product.product_size ?? "",
    weight: product.weight != null ? String(product.weight) : "",
    unit: product.unit ?? "g",
    metal: extractId(product.metal),
    description: product.description ?? "",
  };
}

/* =========================
   PUBLIC API
========================= */
export function mapFormToUpdatePayload(
  category: ProductCategory,
  form: BaseProductForm | StoneDiamondForm | AccessoriesForm | OthersForm,
): Record<string, unknown> {
  switch (category) {
    case "productmaster":
    case "semimount":
      return mapBaseProductFormToUpdatePayload(form as BaseProductForm);

    case "stone":
      return mapStoneFormToUpdatePayload(form as StoneDiamondForm);

    case "accessory":
      return mapAccessoriesFormToUpdatePayload(form as AccessoriesForm);

    case "others":
      return mapOthersFormToUpdatePayload(form as OthersForm);
  }
}

/* =========================
   PRODUCT MASTER / SEMIMOUNT
========================= */
export function mapToBaseProductForm(
  product: FormattedProductResponse,
): BaseProductForm {
  const acc = product.related_accessories?.[0];

  return {
    active: product.is_active ?? true,

    productName: product.product_name ?? "",
    code: product.code ?? "",
    description: product.description ?? "",

    itemType: product.item_type?._id ?? "",
    productSize: product.product_size ?? "",

    metal: product.metal?._id ?? "",
    metalColor: product.metal_color?.name ?? "",

    gwt: product.gross_weight !== undefined ? String(product.gross_weight) : "",
    nwt: product.net_weight !== undefined ? String(product.net_weight) : "",
    unit: product.unit ?? "g",

    primaryStone: {
      stoneName: product.primary_stone?.stone_name?._id ?? "",
      shape: product.primary_stone?.shape?._id ?? "",
      size: product.primary_stone?.size ?? "",
      weight:
        product.primary_stone?.weight !== undefined
          ? String(product.primary_stone.weight)
          : "",
      unit: product.primary_stone?.unit ?? "cts",
      color: product.primary_stone?.color ?? "",
      cutting: product.primary_stone?.cutting?._id ?? "",
      quality: product.primary_stone?.quality?._id ?? "",
      clarity: product.primary_stone?.clarity?._id ?? "",
    },

    additionalStones:
      product.additional_stones?.map((s) => ({
        stoneName: s.stone_name?._id ?? "",
        shape: s.shape?._id ?? "",
        size: s.size ?? "",
        weight:
          product.weight !== undefined && product.weight !== null
            ? String(product.weight)
            : "",
        unit: s.unit ?? "g",
        color: s.color ?? "",
        cutting: s.cutting?._id ?? "",
        quality: s.quality?._id ?? "",
        clarity: s.clarity?._id ?? "",
      })) ?? [],

    accessories: acc
      ? {
          active: true,
          productId: acc.product_id._id,
          productName: acc.product_id.product_name ?? "",
          code: acc.product_id.product_code ?? "",
          productSize: acc.size ?? "",
          metal: extractId(acc.metal),
          weight:
            product.weight !== undefined && product.weight !== null
              ? String(product.weight)
              : "",
          unit: acc.unit ?? "g",
          description: acc.description ?? "",
        }
      : {
          active: true,
          productId: "",
          productName: "",
          code: "",
          productSize: "",
          metal: "",
          weight: "",
          unit: "g",
          description: "",
        },
  };
}

/* =========================
   STONE / DIAMOND
========================= */
export function mapToStoneDiamondForm(
  product: FormattedProductResponse,
): StoneDiamondForm {
  const stone = product.primary_stone;

  return {
    active: product.is_active ?? true,
    productName: product.product_name ?? "",
    code: product.code ?? "",
    description: product.description ?? "",

    stoneName: stone?.stone_name?._id ?? "",
    shape: stone?.shape?._id ?? "",
    size: stone?.size ?? "",
    weight:
      product.weight !== undefined && product.weight !== null
        ? String(product.weight)
        : "",
    unit: product.unit ?? "g",

    color: stone?.color ?? "",
    cutting: stone?.cutting?._id ?? "",
    quality: stone?.quality?._id ?? "",
    clarity: stone?.clarity?._id ?? "",
  };
}

/* =========================
   ACCESSORY
========================= */
export function mapToAccessoriesForm(
  product: FormattedProductResponse,
): AccessoriesForm {
  const acc = product.related_accessories?.[0];
  const metalSource = acc?.metal ?? product.metal;

  console.log("[mapToAccessoriesForm]");
  console.log("product.metal:", product.metal);
  console.log("acc?.metal:", acc?.metal);
  console.log("metalSource:", metalSource);
  console.log("metalId:", extractId(metalSource));

  return {
    active: product.is_active ?? true,
    productId: acc?.product_id?._id ?? product._id,
    productName: product.product_name ?? "",
    code: product.code ?? "",
    productSize: product.product_size ?? "",
    metal: extractId(metalSource),
    weight:
      product.weight !== undefined && product.weight !== null
        ? String(product.weight)
        : "",
    unit: product.unit ?? "g",
    description: product.description ?? "",
  };
}

/* =========================
   OTHERS
========================= */
export function mapToOthersForm(product: FormattedProductResponse): OthersForm {
  return {
    active: product.is_active ?? true,
    productName: product.product_name ?? "",
    code: product.code ?? "",
    productSize: product.product_size ?? "",
    weight:
      product.weight !== undefined && product.weight !== null
        ? String(product.weight)
        : "",
    unit: product.unit ?? "g",
    description: product.description ?? "",
  };
}
