import type { BackendProductWithCategory } from "../../types/product/response";
import type { FormByCategory, ProductCategory } from "../../types/product/form";
import {
  mapToAccessoriesForm,
  mapToBaseProductForm,
  mapToOthersForm,
  mapToStoneDiamondForm,
} from "../../types/product/transform";

export function resolveProductForm(
  product: BackendProductWithCategory,
): FormByCategory[ProductCategory] {
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

    default: {
      const _exhaustive: never = product.product_category;
      throw new Error(`Unknown category: ${_exhaustive}`);
    }
  }
}
