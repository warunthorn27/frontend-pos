import type {
  InventoryApiItem,
  InventoryDetailResponse,
  InventoryItem,
} from "../../types/inventory";
import type { FormattedProductResponse } from "../../types/product/response";
import { normalizeCategoryFromDetail } from "./resolveProductForm";

export function mapInventoryItem(
  item: InventoryApiItem,
  index: number,
): InventoryItem {
  return {
    id: item._id,
    index: index + 1,
    image: item.image,
    code: item.code,
    productName: item.product_name,
    category: item.category,
    date: item.date,
    unit: item.unit ?? "-",
    qty: item.qty,
    cost: item.cost,
    amount: item.amount,
    salePrice: item.sale_price,
    status: item.status,
  };
}

export function mapInventoryDetailToProduct(
  data: InventoryDetailResponse,
): FormattedProductResponse {
  const p = data.product_details;
  const stone = data.stone_details;

  const productUnit: "g" | "cts" =
    data.product_details?.gwt || data.product_details?.nwt ? "g" : "cts";

  return {
    _id: data._id,
    is_active: true,

    product_category: normalizeCategoryFromDetail({
      name: p.category,
    }),

    category: {
      _id: "",
      name: p.category,
    },
    product_name: p.product_name,
    code: p.code,
    description: p.description,
    item_type: p.item_type ? { _id: "", name: p.item_type } : undefined,
    product_size: p.product_size,
    metal: p.metal ? { _id: "", name: p.metal } : undefined,
    metal_color: p.metal_color ? { _id: "", name: p.metal_color } : undefined,
    weight: p.weight ?? undefined,
    gross_weight: p.gwt ?? undefined,
    net_weight: p.nwt ?? undefined,

    unit: productUnit,

    primary_stone: stone?.stone_name
      ? {
          stone_name: { _id: "", name: stone.stone_name },
          shape: stone.shape ? { _id: "", name: stone.shape } : undefined,
          size: stone.size,
          weight: stone.s_weight,
          unit: productUnit,
          color: stone.color,
          cutting: stone.cutting ? { _id: "", name: stone.cutting } : undefined,
          quality: stone.quality ? { _id: "", name: stone.quality } : undefined,
          clarity: stone.clarity ? { _id: "", name: stone.clarity } : undefined,
        }
      : undefined,

    additional_stones:
      data.additional_stones?.map((s) => ({
        stone_name: s.stone_name ? { _id: "", name: s.stone_name } : undefined,
        shape: s.shape ? { _id: "", name: s.shape } : undefined,
        size: s.size,
        weight: s.s_weight,
        unit: productUnit,
        color: s.color,
        cutting: s.cutting ? { _id: "", name: s.cutting } : undefined,
        quality: s.quality ? { _id: "", name: s.quality } : undefined,
        clarity: s.clarity ? { _id: "", name: s.clarity } : undefined,
      })) ?? [],

    related_accessories:
      data.accessories?.map((acc) => ({
        product_id: {
          _id: "",
          product_name: acc.product_name,
          product_code: acc.code,
        },

        weight: acc.weight,
        unit: productUnit,
        size: acc.size,

        metal: {
          _id: "",
          name: acc.metal ?? "",
        },

        description: acc.description,
      })) ?? [],

    file: [],
  };
}
