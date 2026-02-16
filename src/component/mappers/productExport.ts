export const PRODUCT_EXPORT_OPTIONS = [
  { key: "all", label: "All" },
  { key: "productMaster", label: "Product Master" },
  { key: "stoneDiamond", label: "Stone / Diamond" },
  { key: "semiMount", label: "Semi-Mount" },
  { key: "accessories", label: "Accessories" },
  { key: "others", label: "Others" },
] as const;

export type ProductExportSheet = (typeof PRODUCT_EXPORT_OPTIONS)[number]["key"];

export const CATEGORY_KEY_TO_LABEL: Record<ProductExportSheet, string> =
  PRODUCT_EXPORT_OPTIONS.reduce(
    (acc, cur) => {
      acc[cur.key] = cur.label;
      return acc;
    },
    {} as Record<ProductExportSheet, string>,
  );
