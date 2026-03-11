import type {
  PosItemType,
  PosProduct,
  CatalogueCategoryItem,
  CatalogueProductItem,
} from "../../types/pos/catalogue";

import type { CatalogueTab } from "../../types/pos/navigation";

/* ========================================
   ItemType Mapper
======================================== */

export const mapItemType = (item: PosItemType): CatalogueCategoryItem => ({
  id: item._id,
  label: item.name,
  image: item.image ?? null,
});

/* ========================================
   Tab → Category Mapper
======================================== */

export const mapTabToCategoryKey = (tab: CatalogueTab): string => {
  switch (tab) {
    case "product-master":
      return "productmaster";
    case "stone-diamond":
      return "stone";
    case "semi-mount":
      return "semimount";
    case "accessories":
      return "accessory";
    case "others":
      return "others";
    default:
      return "productmaster";
  }
};

/* ========================================
   Product Mapper
======================================== */

export const mapProduct = (p: PosProduct): CatalogueProductItem => ({
  id: p._id,
  code: p.product_code ?? "",
  name: p.product_name ?? "",
  size: p.size ?? undefined,
  metal: p.metal ?? undefined,
  metalColor: p.metal_color ?? undefined,
  price: p.price ?? 0,
  imageUrl: p.image ?? null,
  inStock: (p.quantity ?? 0) > 0,
});
