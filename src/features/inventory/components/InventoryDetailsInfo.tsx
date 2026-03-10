import { formatStockUnit } from "../../../utils/unit";

type Props = {
  date: string;
  unit: string;
  qty: number;
  cost: number;
  amount: number;
  price: number;
  status: string;
};

export default function InventoryDetailsInfo({
  date,
  unit,
  qty,
  cost,
  amount,
  price,
  status,
}: Props) {
  const formatAmount = (num: number) =>
    num.toLocaleString(undefined, { minimumFractionDigits: 2 });

  const isInStock = status === "In Stock";

  return (
    <section className="pb-3 border-b mb-4">
      <div className="flex py-[2px] text-sm">
        <span className="w-[150px] shrink-0">Date :</span>
        <span className="font-light">{date}</span>
      </div>

      <div className="flex py-[2px] text-sm">
        <span className="w-[150px] shrink-0">Unit :</span>
        <span className="font-light">{formatStockUnit(unit)}</span>
      </div>

      <div className="flex py-[2px] text-sm">
        <span className="w-[150px] shrink-0">Qty :</span>
        <span className="font-light">{qty}</span>
      </div>

      <div className="flex py-[2px] text-sm">
        <span className="w-[150px] shrink-0">Cost :</span>
        <span className="font-light">{formatAmount(cost)}</span>
      </div>

      <div className="flex py-[2px] text-sm">
        <span className="w-[150px] shrink-0">Amount :</span>
        <span className="font-light">{formatAmount(amount)}</span>
      </div>

      <div className="flex py-[2px] text-sm">
        <span className="w-[150px] shrink-0">Sale Price :</span>
        <span className="font-light">{formatAmount(price)}</span>
      </div>

      <div className="flex py-[2px] text-sm items-center">
        <span className="w-[150px] shrink-0">Status :</span>

        <span
          className={`px-2 py-[2px] text-xs rounded-full border flex items-center gap-2
         ${
           isInStock
             ? "text-black border-[#34C759]"
             : "text-black border-[#E71010]"
         }`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              isInStock ? "bg-[#34C759]" : "bg-[#E71010]"
            }`}
          />
          {status}
        </span>
      </div>
    </section>
  );
}
