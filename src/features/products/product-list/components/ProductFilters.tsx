import PrintIcon from "../../../../assets/svg/print.svg?react";
import FileExcel from "../../../../assets/svg/file-x.svg?react";
import ExportIcon from "../../../../assets/svg/export.svg?react";
import SearchIcon from "../../../../assets/svg/search.svg?react";
import type { SelectOption } from "../../../../types/shared/select";
import MasterSelect from "../../../../component/masterData/MasterSelect";

type Props = {
  categories: string[];
  categoryOptions: SelectOption[];
  openExport: boolean;
  search: string;
  exportDropdown: React.ReactNode;
  onChangeCategories: (v: string[]) => void;
  onChangeSearch: (v: string) => void;
  onPrint: () => void;
  onToggleExport: () => void;
  onExportAll: () => void;
};

export default function ProductFilters({
  categories,
  categoryOptions,
  search,
  onChangeCategories,
  onChangeSearch,
  onPrint,
  openExport,
  onToggleExport,
  onExportAll,
  exportDropdown,
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

        <MasterSelect
          values={categories}
          options={categoryOptions}
          onChange={onChangeCategories}
        />
      </div>

      {/* right icons */}
      <div className="ml-auto flex items-center gap-4 relative">
        <button type="button" onClick={onPrint}>
          <PrintIcon className="w-7 h-7" />
        </button>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onExportAll();
          }}
        >
          <FileExcel className="w-7 h-7" />
        </button>

        {/* Export Button */}
        <div className="relative">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleExport();
            }}
            className="px-[10px] py-[6px] gap-2 rounded-md bg-[#34C759] hover:bg-[#2EB450] text-base text-white flex items-center"
          >
            <ExportIcon className="w-6 h-6" />
            Export
          </button>

          {/* Dropdown */}
          {openExport && (
            <div className="absolute right-0 mt-2 z-50">{exportDropdown}</div>
          )}
        </div>
      </div>
    </div>
  );
}
