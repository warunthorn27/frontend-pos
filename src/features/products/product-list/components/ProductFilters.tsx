import DropdownArrow2 from "../../../../assets/svg/dropdown-arrow2.svg?react";
import PrintIcon from "../../../../assets/svg/print.svg?react";
import FileExcel from "../../../../assets/svg/file-x.svg?react";
import ExportIcon from "../../../../assets/svg/export.svg?react";
import SearchIcon from "../../../../assets/svg/search.svg?react";

type Props = {
  category: string;
  itemType: string;
  search: string;
  onChangeCategory: (v: string) => void;
  onChangeItemType: (v: string) => void;
  onChangeSearch: (v: string) => void;
  onPrint: () => void;
  onExportExcel: () => void;
};

const categories = [
  "Product Master",
  "Stone / Diamond",
  "Semi-Mount",
  "Others",
  "Accessories",
];
const itemTypes = ["Pendant", "Diamond", "Ring"];

export default function ProductFilters({
  category,
  itemType,
  search,
  onChangeCategory,
  onChangeItemType,
  onChangeSearch,
  onPrint,
  onExportExcel,
}: Props) {
  return (
    <div className="flex items-center gap-4">
      {/* left filters */}
      <div className="flex items-center gap-4">
        <div className="relative">
          <input
            value={search}
            onChange={(e) => onChangeSearch(e.target.value)}
            placeholder="Search"
            className="w-[400px] h-[40px] rounded-[10px] border border-[#CFCFCF] bg-white px-[20px] text-sm text-black font-light placeholder:text-[#BABABA] outline-none"
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8B94A3]">
            <SearchIcon className="w-6 h-6" />
          </span>
        </div>

        <div className="relative">
          <select
            value={category}
            onChange={(e) => onChangeCategory(e.target.value)}
            className="w-[200px] h-[40px] rounded-md border border-[#E6E6E6] bg-white px-3 pr-9 text-sm text-[#545454] font-light outline-none appearance-none"
          >
            <option value="">Category</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-[#6B7280]">
            <DropdownArrow2 className="w-3 h-2" />
          </span>
        </div>

        <div className="relative">
          <select
            value={itemType}
            onChange={(e) => onChangeItemType(e.target.value)}
            className="w-[200px] h-[40px] rounded-md border border-[#E6E6E6] bg-white px-3 pr-9 text-sm text-[#545454] font-light outline-none appearance-none"
          >
            <option value="">Item Type</option>
            {itemTypes.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
          <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-[#6B7280]">
            <DropdownArrow2 className="w-3 h-2" />
          </span>
        </div>
      </div>

      {/* right search + icons */}
      <div className="ml-auto flex items-center gap-3">
        <button
          type="button"
          onClick={onPrint}
          aria-label="Print"
          title="Print"
        >
          <PrintIcon className="w-7 h-7" />
        </button>

        <button
          type="button"
          onClick={onExportExcel}
          aria-label="Export Excel"
          title="Export Excel"
        >
          <FileExcel className="w-7 h-7" />
        </button>

        <button
          onClick={onExportExcel}
          className="px-[10px] py-[6px] gap-2 rounded-md bg-[#43A047] text-base font-normal text-white hover:bg-[#39813C] flex items-center"
        >
          <ExportIcon className="w-6 h-6" />
          Export
        </button>
      </div>
    </div>
  );
}
