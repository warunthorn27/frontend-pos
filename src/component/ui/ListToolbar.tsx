import SearchIcon from "../../assets/svg/search.svg?react";
import PrintIcon from "../../assets/svg/print.svg?react";
import ExportIcon from "../../assets/svg/file-x.svg?react";
import PlusIcon from "../../assets/svg/plus.svg?react";
import StatusFilter from "./filter/StatusFilter";
import MasterSelect from "../masterData/MasterSelect";
import type { SelectOption } from "../../types/shared/select";
import DateRangePicker from "./DateRangePicker";

type Props = {
  search?: string;
  onSearchChange?: (value: string) => void;

  startDate?: string;
  endDate?: string;
  onDateRangeChange?: (start: string, end: string) => void;

  status?: string;
  onStatusChange?: (value?: string) => void;

  category?: string[];
  categoryOptions?: SelectOption[];
  onCategoryChange?: (values: string[]) => void;
  showCategory?: boolean;

  addLabel?: string;
  onAddClick?: () => void;

  showPrint?: boolean;
  showExport?: boolean;
  onExportExcel?: () => void;

  align?: "left" | "right";
  searchPosition?: "first" | "last";
};

export default function ListToolbar({
  search,
  onSearchChange,
  startDate,
  endDate,
  onDateRangeChange,
  status,
  onStatusChange,
  category,
  categoryOptions,
  onCategoryChange,
  showCategory = false,
  addLabel,
  onAddClick,
  showPrint = true,
  showExport = true,
  onExportExcel,
  align = "left",
  searchPosition = "first",
}: Props) {
  const SearchBox = onSearchChange && (
    <div className="flex items-center border border-[#CFCFCF] bg-white rounded-md px-3 h-[40px] w-[300px] focus-within:border-[#005AA7]">
      <input
        value={search || ""}
        onChange={(e) => onSearchChange(e.target.value)}
        className="flex-1 bg-transparent text-sm font-light outline-none"
        placeholder="Search"
      />
      <SearchIcon className="w-5 h-5 text-gray-400" />
    </div>
  );

  return (
    <div
      className={`flex items-center mb-6 ${align === "right" ? "justify-end" : "justify-between"
        }`}
    >
      {/* LEFT */}
      <div className="flex gap-3 items-center">
        {/* SEARCH */}
        {searchPosition === "first" && SearchBox}

        {/* CATEGORY */}
        {showCategory && onCategoryChange && categoryOptions && (
          <MasterSelect
            values={category || []}
            options={categoryOptions}
            onChange={onCategoryChange}
            placeholder="Category"
          />
        )}

        {/* STATUS */}
        {onStatusChange && (
          <StatusFilter value={status} onChange={onStatusChange} />
        )}

        {searchPosition === "last" && SearchBox}

        {/* DATE RANGE */}
        {onDateRangeChange && (
          <div className="w-[300px]">
            <DateRangePicker
              startDate={startDate}
              endDate={endDate}
              onChange={onDateRangeChange}
            />
          </div>
        )}
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-3 ml-3">
        {showPrint && (
          <PrintIcon className="w-7 h-7 text-gray-600 cursor-pointer" />
        )}

        {showExport && (
          <ExportIcon
            className="w-7 h-7 text-gray-600 cursor-pointer"
            onClick={onExportExcel}
          />
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
