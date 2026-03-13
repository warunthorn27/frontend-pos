import { createContext, useContext } from "react";

/* =================================================================
   Context Shape
 ================================================================= */
export interface CustomSessionContextValue {
  /** Current count of items in custom session */
  customCount: number;
  /** Current count of items in sell session */
  sellCount: number;
  /** Add a product to the custom session; shows toast on success */
  addItem: (productId: string, productInfo?: {
    name: string;
    code: string;
    imageUrl?: string | null;
    metal?: string;
    metalColor?: string;
  }) => Promise<void>;
  /** Add a product to the sell session */
  addSellItem: (productId: string, price: number, productInfo?: {
    name: string;
    code: string;
    imageUrl?: string | null;
  }) => Promise<void>;
  /** Pull latest counts from server */
  refreshCount: () => Promise<void>;
}

export const CustomSessionContext = createContext<CustomSessionContextValue | null>(null);

/* =================================================================
   Hook
 ================================================================= */
export const useCustomSession = (): CustomSessionContextValue => {
  const ctx = useContext(CustomSessionContext);
  if (!ctx) throw new Error("useCustomSession must be inside CustomSessionProvider");
  return ctx;
};
