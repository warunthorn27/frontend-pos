import { CATEGORY_OPTIONS } from "../../utils/categoryOptions";
import {
  CATEGORY_KEY_TO_LABEL,
  PRODUCT_EXPORT_OPTIONS,
  type ProductExportSheet,
} from "../mappers/productExport";
import Checkbox from "./Checkbox";
import { useEffect, useRef, useState } from "react";

type Props = {
  onExport: (payload: {
    type: "all" | "category";
    value?: string | string[];
  }) => void;

  onClose?: () => void;
};

export default function ProductExportDropdown({ onExport, onClose }: Props) {
  const [selectedSheets, setSelectedSheets] = useState<ProductExportSheet[]>(
    [],
  );
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isAllChecked =
    selectedSheets.length > 0 &&
    PRODUCT_EXPORT_OPTIONS.every((o) => selectedSheets.includes(o.key));

  const toggleSheet = (key: ProductExportSheet, checked: boolean) => {
    if (key === "all") {
      setSelectedSheets(
        checked ? PRODUCT_EXPORT_OPTIONS.map((o) => o.key) : [],
      );
      return;
    }

    setSelectedSheets((prev) =>
      checked
        ? [...prev.filter((k) => k !== "all"), key]
        : prev.filter((k) => k !== key),
    );
  };

  useEffect(() => {
    if (!onClose) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        onClose();
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [onClose]);

  const handleExportClick = () => {
    if (selectedSheets.length === 0) return;

    if (selectedSheets.includes("all")) {
      onExport({ type: "all" });
      onClose?.();
      return;
    }

    const categoryIds = selectedSheets
      .map((key) => {
        const label = CATEGORY_KEY_TO_LABEL[key];
        return CATEGORY_OPTIONS.find((c) => c.label === label)?.value;
      })
      .filter((v): v is string => Boolean(v));

    // กัน mismatch category
    if (categoryIds.length === 0) {
      console.warn("No category IDs resolved from dropdown", selectedSheets);
      return;
    }

    onExport({
      type: "category",
      value: categoryIds.length === 1 ? categoryIds[0] : categoryIds,
    });

    onClose?.();
  };

  return (
    <div
      ref={dropdownRef}
      className="w-52 rounded-md border bg-white shadow-lg"
    >
      <div className="px-4 py-[10px] text-sm border-b">
        Select sheet to Export
      </div>

      <div className="px-5 py-4 space-y-3">
        {PRODUCT_EXPORT_OPTIONS.map((opt) => {
          const checked =
            opt.key === "all" ? isAllChecked : selectedSheets.includes(opt.key);

          return (
            <label
              key={opt.key}
              className="flex items-center gap-[10px] cursor-pointer"
            >
              <Checkbox
                checked={checked}
                onChange={(value) => toggleSheet(opt.key, value)}
              />
              <span className="text-sm font-light">{opt.label}</span>
            </label>
          );
        })}
      </div>

      <div className="px-4 pb-4 pt-2">
        <button
          onClick={handleExportClick}
          className="w-full h-9 rounded-md bg-[#34C759] text-white text-sm hover:bg-[#2EB450] transition"
        >
          Export
        </button>
      </div>
    </div>
  );
}
