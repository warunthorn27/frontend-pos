import type { ProductGetOneResponse } from "../../types/product/response";
import type {
  AccessoriesForm,
  BaseProductForm,
  FormByCategory,
  OthersForm,
  ProductCategory,
  StoneDiamondForm,
} from "../../types/product/form";
import {
  mapToBaseProductForm,
  mapToStoneDiamondForm,
  mapToAccessoriesForm,
  mapToOthersForm,
  mapBaseProductFormToUpdatePayload,
  mapStoneFormToUpdatePayload,
  mapAccessoriesFormToUpdatePayload,
  mapOthersFormToUpdatePayload,
} from "../../types/product/transform";

export function resolveProductForm(
  product: ProductGetOneResponse,
): FormByCategory[typeof product.product_category] {
  switch (product.product_category) {
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

// accessory standalone = product ตัวมันเอง
export function resolveAccessoryForm(
  product: ProductGetOneResponse,
): AccessoriesForm {
  return {
    active: product.is_active ?? true,
    productId: product._id,
    productName: product.product_name ?? "",
    code: product.product_code ?? "",
    productSize: product.product_detail_id?.size ?? "",

    weight:
      product.product_detail_id?.weight != null
        ? String(product.product_detail_id.weight)
        : "",

    unit: product.product_detail_id?.unit === "cts" ? "cts" : "g",
    metal: product.attributes?.metal?._id ?? "",
    description: product.product_detail_id?.description ?? "",
  };
}

export function mapFormToUpdatePayloadByCategory(
  category: ProductCategory,
  form: FormByCategory[ProductCategory],
) {
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

// map สำหรับ UPDATE เท่านั้น
export function mapFormToUpdatePayload(
  category: ProductCategory,
  form: BaseProductForm | AccessoriesForm | StoneDiamondForm | OthersForm,
) {
  switch (category) {
    case "productmaster":
    case "semimount": {
      const f = form as BaseProductForm;
      return {
        product_name: f.productName,
        code: f.code,
        size: f.productSize,
        metal: f.metal,
        item_type: f.itemType,
      };
    }

    case "stone": {
      const f = form as StoneDiamondForm;
      return {
        product_name: f.productName,
        code: f.code,
        stone_name: f.stoneName,
        shape: f.shape,
        size: f.size,
        color: f.color,
        cutting: f.cutting,
        quality: f.quality,
        clarity: f.clarity,
        weight: Number(f.weight),
        unit: f.unit,
        description: f.description,
      };
    }

    case "accessory": {
      const f = form as AccessoriesForm;
      return {
        product_name: f.productName,
        code: f.code,
        size: f.productSize,
        metal: f.metal,
        weight: Number(f.weight),
        unit: f.unit,
        description: f.description,
      };
    }

    case "others": {
      const f = form as OthersForm;
      return {
        product_name: f.productName,
        code: f.code,
        size: f.productSize,
        weight: Number(f.weight),
        unit: f.unit,
        description: f.description,
      };
    }
  }
}
