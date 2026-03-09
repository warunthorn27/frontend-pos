import type { BackendMaster } from "../../types/master";
import type {
  BackendProductDetail,
  FormattedProductResponse,
} from "../../types/product/response";
import type { BackendProduct, Product } from "../../types/purchase";
import {
  normalizeCategoryFromDetail,
  normalizeCategoryFromList,
} from "./resolveProductForm";

export function mapBackendProduct(p: BackendProduct): Product {
  const rawCategory =
    typeof p.category === "object"
      ? p.category.master_name
      : (p.category ?? "");

  const category = normalizeCategoryFromList({
    master_name: rawCategory,
  });

  let grossWeight = 0;
  let netWeight = 0;
  let stoneWeight = 0;

  switch (category) {
    case "productmaster":
    case "semimount":
      grossWeight = p.gross_weight ?? 0;
      netWeight = p.net_weight ?? 0;
      stoneWeight = p.stone_weight ?? 0;
      break;

    case "stone":
      stoneWeight = p.stone_weight ?? 0;
      grossWeight = stoneWeight;
      break;

    case "accessory":
    case "others":
      grossWeight = p.gross_weight ?? 0;
      break;
  }

  return {
    id: p._id,
    code: p.product_code,
    productName: p.product_name,
    category,
    typeOrStoneName: p.type_stone ?? "",
    imageUrl: p.image ?? undefined,

    grossWeight,
    netWeight,
    stoneWeight,

    hasStoneWeight: stoneWeight > 0,
    hasNetWeight: netWeight > 0,
  };
}

function mapMaster(master?: BackendMaster) {
  if (!master) return undefined;

  return {
    _id: master._id,
    name: master.master_name,
  };
}

export function mapProductDetail(
  api: BackendProductDetail,
): FormattedProductResponse {
  return {
    ...api,

    product_category: normalizeCategoryFromDetail(api.category),

    /** ---------------- PRIMARY STONE ---------------- */
    primary_stone: api.primary_stone && {
      ...api.primary_stone,
      stone_name: mapMaster(api.primary_stone.stone_name),
      shape: mapMaster(api.primary_stone.shape),
      cutting: mapMaster(api.primary_stone.cutting),
      quality: mapMaster(api.primary_stone.quality),
      clarity: mapMaster(api.primary_stone.clarity),
    },

    additional_stones:
      api.additional_stones?.map((s) => ({
        ...s,
        stone_name: mapMaster(s.stone_name),
        shape: mapMaster(s.shape),
        cutting: mapMaster(s.cutting),
        quality: mapMaster(s.quality),
        clarity: mapMaster(s.clarity),
      })) ?? [],

    related_accessories:
      api.related_accessories?.map((acc) => ({
        product_id: acc.product_id,
        weight: acc.weight,
        unit: acc.unit ?? "g",
        size: acc.size ?? "",
        metal:
          typeof acc.metal === "string"
            ? { _id: "", name: acc.metal }
            : acc.metal
              ? { _id: acc.metal._id, name: acc.metal.master_name }
              : { _id: "", name: "" },
        description: acc.description,
      })) ?? [],
  };
}
