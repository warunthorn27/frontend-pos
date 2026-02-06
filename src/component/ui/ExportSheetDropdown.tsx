import { useEffect, useRef, useState } from "react";
import Checkbox from "./Checkbox";

export type ExportSheetKey =
  | "all"
  | "product_master"
  | "stone"
  | "semi_mount"
  | "accessories"
  | "others";

const EXPORT_SHEET_OPTIONS: {
  key: ExportSheetKey;
  label: string;
}[] = [
  { key: "all", label: "All" },
  { key: "product_master", label: "Product Master" },
  { key: "stone", label: "Stone / Diamond" },
  { key: "semi_mount", label: "Semi-Mount" },
  { key: "accessories", label: "Accessories" },
  { key: "others", label: "Others" },
];

type Props = {
  onExport: (selected: ExportSheetKey[]) => void;
  onClose?: () => void;
};

export default function ExportSheetDropdown({ onExport, onClose }: Props) {
  const [selected, setSelected] = useState<ExportSheetKey[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isAllChecked =
    selected.length > 0 &&
    EXPORT_SHEET_OPTIONS.every((o) => selected.includes(o.key));

  const toggle = (key: ExportSheetKey, checked: boolean) => {
    if (key === "all") {
      setSelected(checked ? EXPORT_SHEET_OPTIONS.map((o) => o.key) : []);
      return;
    }

    setSelected((prev) =>
      checked
        ? [...prev.filter((k) => k !== "all"), key]
        : prev.filter((k) => k !== key),
    );
  };

  // click outside
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
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [onClose]);

  return (
    <div
      ref={dropdownRef}
      className="w-52 rounded-md border bg-white shadow-lg"
    >
      {/* Header */}
      <div className="px-4 py-[10px] text-sm font-normal border-b">
        Select sheet to Export
      </div>

      {/* Options */}
      <div className="px-5 py-4 space-y-3">
        {EXPORT_SHEET_OPTIONS.map((opt) => {
          const checked =
            opt.key === "all" ? isAllChecked : selected.includes(opt.key);

          return (
            <label
              key={opt.key}
              className="flex items-center gap-[10px] cursor-pointer"
            >
              <Checkbox
                checked={checked}
                onChange={(value) => toggle(opt.key, value)}
              />
              <span className="text-sm font-light">{opt.label}</span>
            </label>
          );
        })}
      </div>

      {/* Footer */}
      <div className="px-4 pb-4 pt-2">
        <button
          onClick={() => {
            onExport(selected);
            onClose?.();
          }}
          className="w-full h-9 rounded-md bg-[#34C759] text-white text-sm font-normal hover:bg-[#2EB450] transition"
        >
          Export
        </button>
      </div>
    </div>
  );
}
