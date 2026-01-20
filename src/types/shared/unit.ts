export type WeightUnit = "g" | "cts" | "pcs" | "pair";

export const WEIGHT_UNIT_OPTIONS: ReadonlyArray<{
  label: string;
  value: WeightUnit;
}> = [
  { value: "g", label: "g" },
  { value: "cts", label: "cts" },
  { value: "pcs", label: "pcs" },
  { value: "pair", label: "pair" },
];
