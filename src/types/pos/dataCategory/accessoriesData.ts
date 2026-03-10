import type { CatalogueProductItem } from "../catalogue";

export const accessoriesData: CatalogueProductItem[] = [
  {
    id: "acc-1",
    code: "RG-1003",
    name: "Opal Blossom Elegance Ring",
    description: "A rose gold–tone ring with a floral design.",
    metal: "18K RG",
    metalColor: "Rose Gold",
    size: "18 mm",
    price: 16000,
    currency: "฿",
    imageUrl: "/images/ring.png",
    inStock: true,
  },
  {
    id: "acc-2",
    code: "ER-2001",
    name: "Gold Earring Backs",
    description: "Classic locking earring backs.",
    metal: "18K YG",
    metalColor: "Yellow Gold",
    price: 6000,
    currency: "฿",
    imageUrl: "/images/earring-backs.png",
    inStock: false,
  },
];
