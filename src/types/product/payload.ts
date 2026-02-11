// ตรง backend Joi
// ใช้กับ service
// ไม่ผูกกับ UI

import type { WeightUnit } from "../shared/unit";

export type CreateStonePayload = {
  product_name: string;
  code: string;
  category: "stone";

  stone_name: string;
  shape: string;
  size: string;

  weight: string;
  unit: WeightUnit;

  description?: string;
  color?: string;
  cutting?: string;
  quality?: string;
  clarity?: string;
};
