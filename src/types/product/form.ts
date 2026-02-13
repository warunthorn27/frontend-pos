// ใช้กับ useState, StoneDiamondInfoCard, onChange
// UI FormState
// ใช้กับ useState, input, onChange, props ของ modal

import type { WeightUnit } from "../shared/unit";

export type BaseProductForm = {
  active: boolean;
  productId: string;
  productName: string;
  itemType: string;
  productSize: string;
  code: string;
  metal: string;
  metalColor: string;
  description: string;
  gwt: string;
  nwt: string;
  unit: WeightUnit;
  accessories: AccessoriesForm;
  primaryStone: PrimaryStoneForm;
  additionalStones: AdditionalStoneForm[];
};

export type PrimaryStoneForm = {
  stoneName: string;
  shape: string;
  size: string;
  weight: string;
  unit: WeightUnit;
  color: string;
  cutting: string;
  quality: string;
  clarity: string;
};

export type AdditionalStoneForm = {
  stoneName: string;
  shape: string;
  size: string;
  weight: string;
  unit: WeightUnit;
  color: string;
  cutting: string;
  quality: string;
  clarity: string;
};

export type StoneDiamondForm = {
  active: boolean;
  productId: string;
  productName: string;
  code: string;
  description: string;
  stoneName: string;
  shape: string;
  size: string;
  weight: string;
  unit: WeightUnit;
  color: string;
  cutting: string;
  quality: string;
  clarity: string;
};

export type OthersForm = {
  active: boolean;
  productId: string;
  productName: string;
  code: string;
  productSize: string;
  weight: string;
  unit: WeightUnit;
  description: string;
};

export type AccessoriesForm = {
  active: boolean;
  productId: string;
  productName: string;
  code: string;
  productSize: string;
  metal: string;
  weight: string;
  unit: WeightUnit;
  description: string;
};

export type ProductCategory =
  | "productmaster"
  | "semimount"
  | "stone"
  | "accessory"
  | "others";

export type FormByCategory = {
  productmaster: BaseProductForm;
  semimount: BaseProductForm;
  stone: StoneDiamondForm;
  accessory: AccessoriesForm;
  others: OthersForm;
};
