import type { WeightUnit } from "./unit";

export type SelectOption = {
  label: string;
  value: string;
};

export type AccessoriesOption = SelectOption & {
  productCode: string;
  productName: string;
  productSize: string;
  metal: string;
  defaultWeight?: string;
  unit: WeightUnit;
  description?: string;
};
