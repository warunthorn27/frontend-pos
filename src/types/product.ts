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

export type ProductMasterForm = {
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
