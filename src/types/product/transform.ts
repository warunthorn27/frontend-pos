import type { BaseProductForm, StoneDiamondForm } from "./form";
import type { CreateStonePayload } from "./payload";
import type { BackendProductResponse } from "./response";

export function mapStoneFormToPayload(
  form: StoneDiamondForm,
): CreateStonePayload {
  return {
    product_name: form.productName.trim(),
    code: form.code.trim(),
    category: "stone",

    stone_name: form.stoneName,
    shape: form.shape,
    size: form.size,

    net_weight: Number(form.weight),
    unit: form.unit,

    description: form.description || undefined,
    color: form.color || undefined,
    cutting: form.cutting || undefined,
    quality: form.quality || undefined,
    clarity: form.clarity || undefined,
  };
}

export type ProductRow = {
  id: string;
  imageUrl: string | null;
  code: string;
  productName: string;
  category: string;
  typeOrStone: string;
  size: string;
  metal: string;
  color: string;
  status: "active" | "inactive";
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

export function mapProductToForm(res: BackendProductResponse): BaseProductForm {
  const detail = res.product_detail_id;
  const primaryStone = detail?.primary_stone;

  return {
    // ===== STATUS =====
    active: res.is_active ?? true,

    // ===== BASIC INFO =====
    productName: res.product_name ?? "",
    code: res.product_code ?? "",
    itemType: res.product_item_type ?? "",
    productSize: detail?.size ?? "",

    metal: res.attributes?.metal?.name ?? "",
    metalColor: res.attributes?.metal_color?.name ?? "",

    description: detail?.description ?? "",

    // ===== WEIGHT =====
    gwt: detail?.gross_weight !== undefined ? String(detail.gross_weight) : "",
    nwt: detail?.net_weight !== undefined ? String(detail.net_weight) : "",

    // ===== PRIMARY STONE =====
    primaryStone: {
      stoneName: primaryStone?.stone_name ?? "",
      shape: primaryStone?.shape ?? "",
      size: primaryStone?.size ?? "",
      weight:
        primaryStone?.weight !== undefined ? String(primaryStone.weight) : "",
      unit: "cts",
      color: primaryStone?.color ?? "",
      cutting: primaryStone?.cutting ?? "",
      quality: primaryStone?.quality ?? "",
      clarity: primaryStone?.clarity ?? "",
    },

    // ===== ADDITIONAL STONES =====
    additionalStones:
      detail?.additional_stones?.map((s) => ({
        stoneName: s.stone_name ?? "",
        shape: s.shape ?? "",
        size: s.size ?? "",
        weight: s.weight !== undefined ? String(s.weight) : "",
        unit: "cts",
        color: s.color ?? "",
        cutting: s.cutting ?? "",
        quality: s.quality ?? "",
        clarity: s.clarity ?? "",
      })) ?? [],

    // ===== ACCESSORIES =====
    accessories: {
      active: true,
      productName: res.related_accessories?.[0]?.name ?? "",
      code: res.related_accessories?.[0]?.code ?? "",
      productSize: "",
      weight:
        res.related_accessories?.[0]?.weight !== undefined
          ? String(res.related_accessories[0].weight)
          : "",
      metal: "",
      weightUnit: "g",
      description: "",
    },
  };
}
