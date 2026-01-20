// ใช้กับ useState, StoneDiamondInfoCard, onChange
// UI FormState
// ใช้กับ useState, input, onChange, props ของ modal

import type { WeightUnit } from "../shared/unit";

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
  // qty: string;
};

export type StoneDiamondForm = {
  active: boolean;
  productName: string;
  code: string;
  description: string;
  stoneName: string;
  shape: string;
  size: string;
  weight: string; // string เพราะ input
  unit: WeightUnit;
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
