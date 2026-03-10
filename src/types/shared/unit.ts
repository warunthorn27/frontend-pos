export type WeightUnit = "g" | "cts";

export const WEIGHT_UNIT_OPTIONS: { value: WeightUnit; label: string }[] = [
  { value: "g", label: "g" },
  { value: "cts", label: "cts" },
];

export type StockUnit = "pcs" | "g" | "cts";

export type StockUnitOption = {
  value: StockUnit;
  label: string;
};

export const STOCK_UNIT_OPTIONS: StockUnitOption[] = [
  { value: "pcs", label: "pcs" },
  { value: "g", label: "g" },
  { value: "cts", label: "cts" },
];
