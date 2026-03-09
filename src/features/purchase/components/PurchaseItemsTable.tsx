import { useMemo, useState } from "react";
import ImportIcon from "../../../assets/svg/import.svg?react";
import PlusIcon from "../../../assets/svg/plus.svg?react";
import RemoveIcon from "../../../assets/svg/trash.svg?react";
import SelectProductModal from "./SelectProductModal";
import ProductImage from "../../products/product-list/components/ProductImage";
import type { Product, PurchaseItemRow } from "../../../types/purchase";
import WeightInput from "../../../component/input/WeightInput";
import { WEIGHT_UNIT_OPTIONS } from "../../../types/shared/unit";
import PurchaseProductDetailsDrawer from "./PurchaseProductDetailsDrawer";
import DecimalWeightInput from "../../../component/input/DecimalWeightInput";
import UnitDropdown from "../../../component/input/UnitDropdown";

interface Props {
  items: PurchaseItemRow[];
  setItems: React.Dispatch<React.SetStateAction<PurchaseItemRow[]>>;
}

/* ================= TYPES ================= */

type EditableField =
  | "stoneWeight"
  | "netWeight"
  | "grossWeight"
  | "quantity"
  | "cost"
  | "price";

/* ================= COMPONENT ================= */

export default function PurchaseItemsTable({ items, setItems }: Props) {
  const [open, setOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(
    null,
  );
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const UNIT_OPTIONS = [
    { label: "pcs", value: "pcs" },
    { label: "g", value: "g" },
  ] as const;

  /* ================= MAP PRODUCT ================= */

  const mapProductsToRows = (selectedProducts: Product[]): PurchaseItemRow[] =>
    selectedProducts.map((p) => {
      return {
        productId: p.id,
        code: p.code,
        name: p.productName,
        imageUrl: p.imageUrl,

        category: p.category,

        hasStoneWeight: p.hasStoneWeight,
        hasNetWeight: p.hasNetWeight,

        stoneWeight: "0",
        stoneUnit: "g",

        netWeight: "0",
        grossWeight: "0",

        quantity: 0,
        unit: "pcs",

        cost: 0,
        amount: 0,
        price: 0,
      };
    });

  const handleConfirmProducts = (selectedProducts: Product[]) => {
    setItems((prev) => {
      const existingIds = new Set(prev.map((i) => i.productId));

      const newProducts = selectedProducts.filter(
        (p) => !existingIds.has(p.id),
      );

      return [...prev, ...mapProductsToRows(newProducts)];
    });

    setOpen(false);
  };

  /* ================= UPDATE ================= */

  const updateItem = (index: number, field: EditableField, value: number) => {
    setItems((prev) => {
      const updated = [...prev];
      const row = { ...updated[index], [field]: value };

      const qty = Number(row.quantity || 0);
      const gwt = Number(row.grossWeight || 0);
      const cost = Number(row.cost || 0);

      const unit = row.unit?.toLowerCase();

      if (unit === "g") {
        row.amount = gwt * cost;
      } else {
        row.amount = qty * cost;
      }

      updated[index] = row;
      return updated;
    });
  };

  const removeItem = (index: number) => {
    setItems((prev) => {
      const itemToRemove = prev[index];

      setSelectedIds((ids) =>
        ids.filter((id) => id !== itemToRemove.productId),
      );

      return prev.filter((_, i) => i !== index);
    });
  };

  /* ================= GRAND TOTAL ================= */

  const grandTotal = useMemo(() => {
    return items.reduce(
      (acc, item) => {
        acc.grossWeight += Number(item.grossWeight || 0);
        acc.quantity += item.quantity;
        acc.amount += item.amount;
        return acc;
      },
      { grossWeight: 0, quantity: 0, amount: 0 },
    );
  }, [items]);

  /* ================= REUSABLE INPUT ================= */

  const renderNumberInput = (
    value: number,
    onChange: (val: number) => void,
  ) => (
    <input
      type="number"
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      className="
        w-full
        h-[38px]
        px-3
        rounded-md
        border border-[#CFCFCF]
        bg-white
        text-right
        text-sm
        focus:outline-none focus:border-[#005AA7]
        appearance-none
        [&::-webkit-outer-spin-button]:appearance-none
        [&::-webkit-inner-spin-button]:appearance-none
      "
    />
  );

  const renderReadonlyInput = (value: number) => (
    <input
      type="text"
      value={value.toLocaleString(undefined, {
        minimumFractionDigits: 2,
      })}
      readOnly
      className="
      w-full
      h-[38px]
      px-2
      rounded-md
      border border-[#CFCFCF]
      bg-[#F1F1F1]
      text-right
      text-sm
      font-normal
      cursor-default
      focus:outline-none focus:border-[#005AA7]
    "
    />
  );

  /* ================= RENDER ================= */

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-lg font-normal text-[#06284B]">Items</h2>

          <button
            onClick={() => setOpen(true)}
            className="bg-[#024C8A] hover:bg-[#084072] rounded-md text-white px-3 py-2 gap-2 flex items-center"
          >
            <PlusIcon className="w-5 h-5" />
            Select Product
          </button>

          <SelectProductModal
            open={open}
            selectIds={selectedIds}
            onSelectionChange={setSelectedIds}
            onClose={() => setOpen(false)}
            onConfirm={handleConfirmProducts}
          />
        </div>

        <button className="px-4 py-2 gap-3 rounded-md bg-[#0088FF] hover:bg-[#0071CE] text-base text-white flex items-center">
          <ImportIcon className="w-6 h-6 text-center" />
          Import
        </button>
      </div>

      {/* TABLE */}
      <div className="border rounded-lg bg-white overflow-hidden">
        <div className="max-h-[380px] overflow-y-auto hide-scrollbar">
          <table className="w-full border-collapse table-fixed text-lg">
            <thead className="sticky top-0 bg-[#F7F7F7] z-30 border-b border-[#E6E6E6]">
              <tr className="text-left">
                <th className="px-4 py-3 w-[60px]" />
                <th className="px-4 py-3 w-[70px] font-normal">#</th>
                <th className="px-4 py-3 border-r w-[240px] font-normal">
                  Items
                </th>
                <th className="px-4 py-3 font-normal w-[160px] text-right">
                  S.Weight
                </th>
                <th className="px-4 py-3 font-normal text-right">Nwt</th>
                <th className="px-4 py-3 font-normal text-right">Gwt</th>
                <th className="px-4 py-3 font-normal text-right">Qty</th>
                <th className="px-4 py-3 font-normal w-[110px]">Unit</th>
                <th className="px-4 py-3 font-normal text-right">
                  Cost / Unit
                </th>
                <th className="px-4 py-3 font-normal text-right">Amount</th>
                <th className="px-4 py-3 font-normal text-right">Sale Price</th>
              </tr>
            </thead>

            <tbody>
              {items.length === 0 && (
                <tr>
                  <td
                    colSpan={11}
                    className="text-center py-6 text-gray-400 text-sm font-light"
                  >
                    No items selected
                  </td>
                </tr>
              )}

              {items.map((row, index) => {
                return (
                  <tr
                    key={`${row.productId}-${index}`}
                    className="border-b last:border-b-0"
                  >
                    <td className="px-4 text-center">
                      <button onClick={() => removeItem(index)}>
                        <RemoveIcon className="w-5 h-5 text-red-500" />
                      </button>
                    </td>

                    <td className="px-4 text-sm">{index + 1}</td>

                    <td
                      className="px-4 py-3 border-r cursor-pointer hover:bg-[#eff8ff] transition-colors"
                      onClick={() => {
                        setSelectedProductId(row.productId);
                        setIsDrawerOpen(true);
                      }}
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0">
                          <ProductImage
                            imageUrl={row.imageUrl ?? null}
                            alt={row.name}
                          />
                        </div>

                        <div className="min-w-0">
                          <div className="font-normal text-black text-sm break-words">
                            {row.name}
                          </div>
                          <div className="font-light text-sm text-[#545454] break-words">
                            {row.code}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="px-4">
                      <WeightInput
                        value={row.stoneWeight}
                        unit={row.stoneUnit}
                        unitOptions={WEIGHT_UNIT_OPTIONS}
                        selectClassName="text-sm"
                        onChangeValue={(val) => {
                          setItems((prev) => {
                            const updated = [...prev];
                            const r = { ...updated[index] };

                            r.stoneWeight = val;

                            if (r.stoneUnit === "g") {
                              const swt = Number(val || 0);
                              const nwt = Number(r.netWeight || 0);

                              const gwt = swt + nwt;

                              r.grossWeight = gwt.toFixed(2);
                            }

                            updated[index] = r;
                            return updated;
                          });
                        }}
                        onChangeUnit={(unit) => {
                          setItems((prev) => {
                            const updated = [...prev];
                            const r = { ...updated[index] };

                            r.stoneUnit = unit;

                            if (unit === "cts") {
                              r.netWeight = "0";
                              r.grossWeight = "0";
                            }

                            updated[index] = r;
                            return updated;
                          });
                        }}
                      />
                    </td>

                    <td className="px-4">
                      <div className="relative">
                        <DecimalWeightInput
                          value={row.netWeight || "0.00"}
                          onChange={(val) => {
                            setItems((prev) => {
                              const updated = [...prev];
                              const r = { ...updated[index] };

                              r.netWeight = val;

                              if (r.stoneUnit === "g") {
                                const swt = Number(r.stoneWeight || 0);
                                const nwt = Number(val || 0);

                                const gwt = swt + nwt;

                                r.grossWeight = gwt.toFixed(2);
                              }

                              updated[index] = r;
                              return updated;
                            });
                          }}
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7A7A7A] text-sm">
                          g
                        </span>
                      </div>
                    </td>

                    <td className="px-4">
                      <div className="relative">
                        <DecimalWeightInput
                          value={row.grossWeight || "0.00"}
                          onChange={(val) => {
                            setItems((prev) => {
                              const updated = [...prev];
                              const r = { ...updated[index] };

                              r.grossWeight = val;

                              if (r.stoneUnit === "g") {
                                const gwt = Number(val || 0);
                                const swt = Number(r.stoneWeight || 0);

                                const nwt = gwt - swt;

                                r.netWeight = nwt > 0 ? nwt.toFixed(2) : "0.00";
                              }

                              updated[index] = r;
                              return updated;
                            });
                          }}
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7A7A7A] text-sm">
                          g
                        </span>
                      </div>
                    </td>

                    <td className="px-4">
                      {renderNumberInput(row.quantity, (val) =>
                        updateItem(index, "quantity", val),
                      )}
                    </td>

                    <td className="px-4">
                      <UnitDropdown
                        value={row.unit}
                        options={UNIT_OPTIONS}
                        onChange={(val) => {
                          setItems((prev) => {
                            const updated = [...prev];
                            const r = { ...updated[index] };

                            r.unit = val;

                            const qty = Number(r.quantity || 0);
                            const gwt = Number(r.grossWeight || 0);
                            const cost = Number(r.cost || 0);

                            if (val === "g") {
                              r.amount = gwt * cost;
                            } else {
                              r.amount = qty * cost;
                            }

                            updated[index] = r;
                            return updated;
                          });
                        }}
                      />
                    </td>

                    <td className="px-4">
                      {renderNumberInput(row.cost, (val) =>
                        updateItem(index, "cost", val),
                      )}
                    </td>

                    <td className="px-4">{renderReadonlyInput(row.amount)}</td>

                    <td className="px-4">
                      {renderNumberInput(row.price, (val) =>
                        updateItem(index, "price", val),
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>

            <tfoot className="bg-[#F7F7F7] border-t text-sm">
              <tr>
                <td colSpan={3} className="px-4 py-4 font-normal">
                  Grand Total
                </td>

                <td />
                <td />

                <td className="px-5 py-4 text-right font-normal">
                  {grandTotal.grossWeight.toFixed(2)}
                </td>

                <td className="px-5 py-4 text-right font-normal">
                  {grandTotal.quantity}
                </td>

                <td />

                <td />

                <td className="px-5 py-4 text-right font-normal">
                  {grandTotal.amount.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                  })}
                </td>

                <td />
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      <PurchaseProductDetailsDrawer
        productId={selectedProductId}
        open={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      />
    </div>
  );
}
