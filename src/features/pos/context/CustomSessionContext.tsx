import React, { createContext, useContext, useState, useCallback, useRef } from "react";
import {
  addToCustomSession,
  getCustomSessionList,
} from "../../../services/pos/posCustom";
import CustomAddedToast from "../components/CustomAddedToast";
import type { ToastItem } from "../components/CustomAddedToast";

/* =================================================================
   Context Shape
================================================================= */
interface CustomSessionContextValue {
  /** Current count of items in custom session */
  customCount: number;
  /** Add a product to the session; shows toast on success */
  addItem: (productId: string, productInfo?: {
    name: string;
    code: string;
    imageUrl?: string | null;
    metal?: string;
    metalColor?: string;
  }) => Promise<void>;
  /** Pull latest count from server (called from PosCustomPage on mount) */
  refreshCount: () => Promise<void>;
}

const CustomSessionContext = createContext<CustomSessionContextValue | null>(null);

/* =================================================================
   Provider
================================================================= */
export const CustomSessionProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [customCount, setCustomCount] = useState(0);
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const toastIdRef = useRef(0);

  const refreshCount = useCallback(async () => {
    try {
      const items = await getCustomSessionList();
      const total = items.reduce((sum, i) => sum + (i.qty ?? 1), 0);
      setCustomCount(total);
    } catch (err) {
      console.error("refreshCount error", err);
    }
  }, []);

  const addItem = useCallback(
    async (
      productId: string,
      productInfo?: {
        name: string;
        code: string;
        imageUrl?: string | null;
        metal?: string;
        metalColor?: string;
      },
    ) => {
      try {
        const res = await addToCustomSession(productId);

        // Optimistically bump counter
        setCustomCount((c) => c + 1);

        // Show toast
        const id = ++toastIdRef.current;
        setToasts((prev) => [
          ...prev,
          {
            id,
            productName: productInfo?.name ?? res.data?.product_name ?? "Item",
            productCode: productInfo?.code ?? res.data?.product_code ?? "",
            imageUrl: productInfo?.imageUrl ?? res.data?.image ?? null,
            metal: productInfo?.metal ?? res.data?.metal,
            metalColor: productInfo?.metalColor ?? res.data?.metal_color,
          },
        ]);
      } catch (err) {
        console.error("addToCustomSession error", err);
      }
    },
    [],
  );

  const removeToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <CustomSessionContext.Provider value={{ customCount, addItem, refreshCount }}>
      {children}
      <CustomAddedToast toasts={toasts} onClose={removeToast} />
    </CustomSessionContext.Provider>
  );
};

/* =================================================================
   Hook
================================================================= */
export const useCustomSession = (): CustomSessionContextValue => {
  const ctx = useContext(CustomSessionContext);
  if (!ctx) throw new Error("useCustomSession must be inside CustomSessionProvider");
  return ctx;
};
