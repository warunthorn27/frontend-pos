export type SelectOption = { label: string; value: string };

export type WeightUnit = "cts" | "g";

export type PrimaryStoneForm = {
  stoneName: string;
  shape: string;
  size: string;
  weightCts: string;
  weightUnit: WeightUnit;
  color: string;
  cutting: string;
  quality: string;
  clarity: string;
};

export type AdditionalStoneForm = {
  stoneName: string;
  shape: string;
  size: string;
  weightCts: string;
  weightUnit: WeightUnit;
  color: string;
  cutting: string;
  quality: string;
  clarity: string;
  qty: string; // มีเฉพาะ additional
};

export type BaseProductForm = {
  active: boolean;
  productName: string;
  itemType: string;
  productSize: string;
  code: string;
  metal: string;
  metalColor: string;
  description: string;
  gwt: string;
  nwt: string;
  accessories: AccessoriesForm;
  primaryStone: PrimaryStoneForm;
  additionalStones: AdditionalStoneForm[];
};

export type StoneDiamondForm = {
  active: boolean;
  weightUnit: WeightUnit;
  nwt: string;
  productName: string;
  code: string;
  description: string;
  stoneName: string;
  shape: string;
  size: string;
  weight: string;
  color: string;
  cutting: string;
  quality: string;
  clarity: string;
};

export type OthersForm = {
  active: boolean;
  productName: string;
  code: string;
  productSize: string;
  weight: string;
  weightUnit: WeightUnit;
  description: string;
};

export type AccessoriesForm = {
  active: boolean;
  productName: string;
  code: string;
  productSize: string;
  weight: string;
  metal: string;
  weightUnit: WeightUnit;
  description: string;
};
