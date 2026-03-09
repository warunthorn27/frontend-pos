import { useEffect, useState } from "react";
import { getProductById } from "../../../services/product";
import type {
  BackendProductDetail,
  FormattedProductResponse,
} from "../../../types/product/response";
import PurchaseProductDetailsContent from "./PurchaseProductDetailsContent";
import CloseIcon from "../../../assets/svg/close.svg?react";
import { mapProductDetail } from "../../../component/mappers/purchaseMapper";

type Props = {
  productId: string | null;
  open: boolean;
  onClose: () => void;
};

export default function PurchaseProductDetailsDrawer({
  productId,
  open,
  onClose,
}: Props) {
  console.log("FETCH ID:", productId);
  const [data, setData] = useState<FormattedProductResponse | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!productId || !open) return;

    const fetchData = async () => {
      try {
        setLoading(true);

        const res = await getProductById(productId);
        console.log("API RESULT:", res);

        const product = (res?.data ?? res) as BackendProductDetail;
        const mappedProduct = mapProductDetail(product);

        setData(mappedProduct);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [productId, open]);

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
        className={`fixed right-0 top-[36px] h-[calc(100vh-60px)]
            w-[420px] bg-white shadow-xl z-50
            transform transition-transform duration-300 ease-in-out
            ${open ? "translate-x-0" : "translate-x-full"}
        `}
      >
        <div className="flex items-center justify-between py-4 border-b">
          <h2 className="text-xl text-black px-6 font-normal">Details</h2>
          <button onClick={onClose} className="px-4">
            <CloseIcon className="w-7 h-7" />
          </button>
        </div>

        <div className="h-[calc(100%-64px)] overflow-y-auto hide-scrollbar px-6 py-4">
          {loading && <div>Loading...</div>}
          {!loading && data && <PurchaseProductDetailsContent data={data} />}
        </div>
      </div>
    </>
  );
}
