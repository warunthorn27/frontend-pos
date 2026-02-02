export type WeightUnit = "g" | "cts";

// สำหรับ backend เต็ม (ถ้าจำเป็น)
export type BackendUnit = "g" | "pcs" | "pair" | "cts";

export const WEIGHT_UNIT_OPTIONS: { value: WeightUnit; label: string }[] = [
  { value: "g", label: "g" },
  { value: "cts", label: "cts" },
];
