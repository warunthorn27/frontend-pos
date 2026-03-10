import type { CatalogueProductItem } from "../catalogue";

export const stoneDiamondData = [
  {
    id: "diamond",
    label: "DIAMOND",
    image: null,
  },
  {
    id: "emerald",
    label: "EMERALD",
    image: null,
  },
  {
    id: "amethyst",
    label: "AMETHYST",
    image: null,
  },
  {
    id: "sapphire",
    label: "SAPPHIRE",
    image: null,
  },
  {
    id: "ruby",
    label: "RUBY",
    image: null,
  },
];

export const stoneDiamondProducts: CatalogueProductItem[] = [
  {
    id: "rg-1001",
    code: "RG-1001",
    name: "Oval Pink Peach Sapphire Ring",
    description:
      "Rose gold ring featuring an oval-cut pink center stone with round diamond accents.",
    metal: "18K",
    metalColor: "Gold",
    size: "4.0 mm",
    price: 1200,
    currency: "$",
    inStock: true,
  },
  {
    id: "rg-1002",
    code: "RG-1002",
    name: "Diamond Ring",
    metal: "18K RG",
    metalColor: "Rose Gold",
    size: "18 mm",
    price: 950,
    currency: "$",
    inStock: false,
  },
];
