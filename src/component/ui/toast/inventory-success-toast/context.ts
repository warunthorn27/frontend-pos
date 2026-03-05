import { createContext } from "react";

interface ContextType {
  showInventorySuccessToast: (count: number) => void;
}

export const InventorySuccessToastContext = createContext<ContextType | null>(
  null,
);
