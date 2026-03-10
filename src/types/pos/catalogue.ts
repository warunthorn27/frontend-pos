// for ItemTypeGrid / UI card
export interface CatalogueCategoryItem {
  id: string;
  label: string;
  image?: string | null;
}

export type CatalogueMode = "master" | "inventory";

export const productMasterTypes = [
  { id: "ring", label: "RING" },
  { id: "pendant", label: "PENDANT" },
  { id: "earrings", label: "EARRINGS" },
  { id: "necklace", label: "NECKLACE" },
  { id: "bangle", label: "BANGLE" },
  { id: "bracelet", label: "BRACELET" },
];

export const stoneTypes = [
  { id: "diamond", label: "DIAMOND" },
  { id: "emerald", label: "EMERALD" },
  { id: "amethyst", label: "AMETHYST" },
  { id: "sapphire", label: "SAPPHIRE" },
  { id: "ruby", label: "RUBY" },
];

export const semiMountTypes = [
  { id: "ring", label: "RING" },
  { id: "necklace", label: "NECKLACE" },
  { id: "pendant", label: "PENDANT" },
  { id: "earrings", label: "EARRINGS" },
  { id: "bangle", label: "BANGLE" },
  { id: "bracelet", label: "BRACELET" },
];

// for Product / Inventory / Backend
export interface CatalogueProductItem {
  id: string;
  code: string;
  name: string;
  description?: string;
  metal?: string;
  metalColor?: string;
  size?: string;
  price?: number;
  currency?: string;
  imageUrl?: string | null;
  inStock?: boolean;
}

export interface PosItemType {
  id: string;
  name: string;
  image?: string | null;
  count: number;
}
