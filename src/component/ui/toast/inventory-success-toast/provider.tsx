import { useState } from "react";
import { InventorySuccessToastContext } from "./context";
import InventorySuccessToast from "./InventorySuccessToast";

export function InventorySuccessToastProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [count, setCount] = useState<number | null>(null);

  const showInventorySuccessToast = (itemCount: number) => {
    setCount(itemCount);
  };

  const closeToast = () => {
    setCount(null);
  };

  return (
    <InventorySuccessToastContext.Provider
      value={{ showInventorySuccessToast }}
    >
      {children}

      {count !== null && (
        <InventorySuccessToast count={count} onClose={closeToast} />
      )}
    </InventorySuccessToastContext.Provider>
  );
}
