import PrintIcon from "../../../../assets/svg/print.svg?react";
import FileExcel from "../../../../assets/svg/file-x.svg?react";
import ExportIcon from "../../../../assets/svg/export.svg?react";
import SearchIcon from "../../../../assets/svg/search.svg?react";
import type { SelectOption } from "../../../../types/shared/select";
import MasterSelect from "../../../../component/masterData/MasterSelect";

type Props = {
  categories: string[];
  categoryOptions: SelectOption[];

  search: string;
  onChangeCategories: (v: string[]) => void;
  onChangeSearch: (v: string) => void;

  onPrint: () => void;
  onExportExcel: () => void;
};

export default function ProductFilters({
  categories,
  categoryOptions,
  search,
  onChangeCategories,
  onChangeSearch,
  onPrint,
  onExportExcel,
}: Props) {
  // const handleCategoryChange = (value: string | null | undefined) => {
  //   onChangeCategory(value ?? "");
  // };

  // const handleItemTypeChange = (value: string | null | undefined) => {
  //   onChangeItemType(value ?? "");
  // };

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
          placeholder="Category"
        />

        {/* <MasterSelect
          value={itemType}
          options={itemTypeOptions}
          onChange={handleItemTypeChange}
          placeholder="Item Type"
          // disabled={!category}
        /> */}
      </div>

      {/* right icons */}
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
