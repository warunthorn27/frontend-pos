import { useEffect, useState } from "react";
import CloseIcon from "../../../assets/svg/close.svg?react";
import type { InventoryDetailResponse } from "../../../types/inventory";
import { getInventoryDetail } from "../../../services/inventory";
import { formatDateDisplay } from "../../../utils/date";
import PurchaseProductDetailsContent from "../../purchase/components/PurchaseProductDetailsContent";
import InventoryDetailsInfo from "./InventoryDetailsInfo";
import { mapInventoryDetailToProduct } from "../../../component/mappers/inventoryMapper";

type Props = {
  stockId: string | null;
  open: boolean;
  onClose: () => void;
};

export default function InventoryDetailsDrawer({
  stockId,
  open,
  onClose,
}: Props) {
  const [data, setData] = useState<InventoryDetailResponse | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!stockId || !open) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await getInventoryDetail(stockId);
        setData(res);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [stockId, open]);

  return (
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        className={`
          fixed left-0 right-0 bottom-0 top-[60px] transition-opacity z-40
          ${open ? "opacity-100 visible" : "opacity-0 invisible"}
        `}
      />

      {/* Drawer */}
      <div
        className={`
            fixed right-0 top-[60px] h-[calc(100vh-60px)]
            w-full sm:w-[420px]
            bg-white shadow-xl z-50
            flex flex-col
            transform transition-transform duration-300 ease-in-out
            ${open ? "translate-x-0" : "translate-x-full"}
        `}
      >
        <div className="flex items-center justify-between py-4 border-b px-6 shrink-0">
          <h2 className="text-xl text-black font-normal">Details</h2>

          <button onClick={onClose}>
            <CloseIcon className="w-7 h-7" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 hide-scrollbar">
          {loading && <div>Loading...</div>}

          {data && (
            <>
              {/* STOCK INFO */}
              <InventoryDetailsInfo
                date={formatDateDisplay(data.date)}
                unit={data.unit}
                qty={data.qty}
                cost={data.avg_cost}
                amount={data.total_cost_amount}
                price={data.sale_price}
                status={data.status}
              />

              {/* PRODUCT DETAILS (reuse purchase component) */}
              <PurchaseProductDetailsContent
                data={mapInventoryDetailToProduct(data)}
              />
            </>
          )}
        </div>
      </div>
    </>
  );
}
