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
  productName: string;
  itemType: string;
  productSize: string;

  code: string;
  metal: string;
  metalColor: string;

  description: string;

  gwt: string;
  nwt: string;

  accessoriesCode: string;

  primaryStone: PrimaryStoneForm;
  additionalStones: AdditionalStoneForm[];
};

export type StoneDiamondForm = {
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
  productName: string;
  code: string;
  productSize: string;
  weight: string;
  weightUnit: WeightUnit;
  description: string;
};

export type AccessoriesForm = {
  productName: string;
  code: string;
  productSize: string;
  weight: string;
  metal: string;
  weightUnit: WeightUnit;
  description: string;
};
