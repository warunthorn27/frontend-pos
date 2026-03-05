import { useContext } from "react";
import { InventorySuccessToastContext } from "./context";

export function useInventorySuccessToast() {
  const context = useContext(InventorySuccessToastContext);

  if (!context) {
    throw new Error(
      "useInventorySuccessToast must be used inside InventorySuccessToastProvider",
    );
  }

  return context;
}
