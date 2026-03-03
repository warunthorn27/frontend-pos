import SearchIcon from "../../assets/svg/search.svg?react";
import PrintIcon from "../../assets/svg/print.svg?react";
import ExportIcon from "../../assets/svg/file-x.svg?react";
import PlusIcon from "../../assets/svg/plus.svg?react";

type Props = {
  search?: string;
  onSearchChange?: (value: string) => void;

  dateRange?: string;
  onDateRangeChange?: (value: string) => void;

  status?: string;
  onStatusChange?: (value: string) => void;

  category?: string;
  onCategoryChange?: (value: string) => void;

  showCategory?: boolean;

  addLabel?: string;
  onAddClick?: () => void;

  showPrint?: boolean;
  showExport?: boolean;
};

export default function ListToolbar({
  search,
  onSearchChange,
  dateRange,
  onDateRangeChange,
  status,
  onStatusChange,
  category,
  onCategoryChange,
  showCategory = false,
  addLabel,
  onAddClick,
  showPrint = true,
  showExport = true,
}: Props) {
  return (
    <div className="flex items-center justify-between mb-6">
      {/* LEFT */}
      <div className="flex gap-3 items-center">
        {/* SEARCH */}
        {onSearchChange && (
          <div className="flex items-center border border-[#CFCFCF] bg-white rounded-md px-3 h-[40px] w-[300px]">
            <input
              value={search || ""}
              onChange={(e) => onSearchChange(e.target.value)}
              className="flex-1 bg-transparent text-sm font-light outline-none"
              placeholder="Search"
            />
            <SearchIcon className="w-5 h-5 text-gray-400" />
          </div>
        )}

        {/* DATE RANGE */}
        {onDateRangeChange && (
          <input
            type="text"
            value={dateRange || ""}
            onChange={(e) => onDateRangeChange(e.target.value)}
            placeholder="MM/DD/YYYY - MM/DD/YYYY"
            className="h-[40px] px-3 border border-[#CFCFCF] rounded-md text-sm font-light w-[250px]"
          />
        )}

        {/* CATEGORY (เฉพาะ All Page) */}
        {showCategory && onCategoryChange && (
          <select
            value={category}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="h-[40px] px-3 border border-[#CFCFCF] rounded-md text-sm font-light w-[180px] bg-white"
          >
            <option value="">Category</option>
            <option value="diamond">Diamond</option>
            <option value="semi-mount">Semi-Mount</option>
            <option value="accessories">Accessories</option>
          </select>
        )}

        {/* STATUS */}
        {onStatusChange && (
          <select
            value={status}
            onChange={(e) => onStatusChange(e.target.value)}
            className="h-[40px] px-3 border border-[#CFCFCF] rounded-md text-sm font-light w-[150px] bg-white"
          >
            <option value="">Status</option>
            <option value="in-stock">In Stock</option>
            <option value="out-of-stock">Out of Stock</option>
          </select>
        )}
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-3">
        {showPrint && (
          <PrintIcon className="w-7 h-7 text-gray-600 cursor-pointer" />
        )}

        {showExport && (
          <ExportIcon className="w-7 h-7 text-gray-600 cursor-pointer" />
        )}

        {addLabel && onAddClick && (
          <button
            onClick={onAddClick}
            className="flex items-center gap-2 px-4 h-[40px] rounded-md text-base font-normal text-white bg-[#0088FF] hover:bg-[#0574D6]"
          >
            <PlusIcon className="w-5 h-5" />
            {addLabel}
          </button>
        )}
      </div>
    </div>
  );
}
