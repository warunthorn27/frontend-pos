export type WeightUnit = "g" | "cts";

export const WEIGHT_UNIT_OPTIONS: ReadonlyArray<{
  label: string;
  value: WeightUnit;
}> = [
  { value: "g", label: "g" },
  { value: "cts", label: "cts" },
];
