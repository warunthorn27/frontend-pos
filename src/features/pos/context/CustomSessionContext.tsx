import React, { useState, useCallback, useRef } from "react";
import {
  addToCustomSession,
  getCustomSessionList,
} from "../../../services/pos/posCustom";
import {
  addToSellSession,
  getSellSessionList,
} from "../../../services/pos/posSell";
import CustomAddedToast from "../components/CustomAddedToast";
import type { ToastItem } from "../components/CustomAddedToast";
import { CustomSessionContext } from "./useCustomSession";

/* =================================================================
   Provider
================================================================= */
export const CustomSessionProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [customCount, setCustomCount] = useState(0);
  const [sellCount, setSellCount] = useState(0);
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const toastIdRef = useRef(0);

  const refreshCount = useCallback(async () => {
    try {
      const [customItems, sellRes] = await Promise.all([
        getCustomSessionList(),
        getSellSessionList(),
      ]);
      
      const customTotal = customItems.reduce((sum, i) => sum + (i.qty ?? 1), 0);
      setCustomCount(customTotal);

      const sellTotal = sellRes.data.reduce((sum, i) => sum + (i.qty ?? 1), 0);
      setSellCount(sellTotal);
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

  const addSellItem = useCallback(
    async (
      productId: string,
      price: number,
      productInfo?: {
        name: string;
        code: string;
        imageUrl?: string | null;
      },
    ) => {
      try {
        await addToSellSession({ product_id: productId, unit_price: price });

        // Optimistically bump counter
        setSellCount((c) => c + 1);

        // Show toast (reusing the same toast system)
        const id = ++toastIdRef.current;
        setToasts((prev) => [
          ...prev,
          {
            id,
            productName: productInfo?.name ?? "Item",
            productCode: productInfo?.code ?? "",
            imageUrl: productInfo?.imageUrl ?? null,
          },
        ]);
      } catch (err) {
        console.error("addSellItem error", err);
      }
    },
    [],
  );

  const removeToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <CustomSessionContext.Provider value={{ customCount, sellCount, addItem, addSellItem, refreshCount }}>
      {children}
      <CustomAddedToast toasts={toasts} onClose={removeToast} />
    </CustomSessionContext.Provider>
  );
};
