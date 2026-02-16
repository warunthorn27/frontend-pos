import PlusIcon from "../../../assets/svg/plus.svg?react";
import SearchIcon from "../../../assets/svg/search.svg?react";
import PrintIcon from "../../../assets/svg/print.svg?react";
import FileExcel from "../../../assets/svg/file-x.svg?react";
import DropdownArrowIcon from "../../../assets/svg/dropdown-arrow2.svg?react";

type Props = {
  onAdd: () => void;
  onPrint: () => void;
  onExportExcel: () => void;
};

const CustomerListToolbar: React.FC<Props> = ({
  onAdd,
  onPrint,
  onExportExcel,
}) => {
  return (
    <div className="flex items-center justify-between mb-7">
      {/* Left */}
      <div className="flex gap-3">
        {/* Search */}
        <div className="flex items-center border border-[#CFCFCF] bg-white rounded-md px-3 h-[40px] w-[400px]">
          <input
            className="flex-1 bg-transparent text-sm outline-none"
            placeholder="Search"
          />
          <SearchIcon className="w-4 h-4 text-gray-400" />
        </div>

        {/* Business Type */}
        <div className="relative w-[180px]">
          <select className="h-[40px] w-full appearance-none rounded-md border border-[#CFCFCF] bg-white px-3 pr-9 text-sm font-light outline-none">
            <option>Business Type</option>
            <option>Individual</option>
            <option>Corporation</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
            <DropdownArrowIcon className="w-3 h-3 text-gray-500" />
          </div>
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-3">
        <button onClick={onPrint} title="Print">
          <PrintIcon className="w-7 h-7" />
        </button>

        <button onClick={onExportExcel} title="Export Excel">
          <FileExcel className="w-7 h-7" />
        </button>

        <button
          onClick={onAdd}
          className="px-3 py-2 rounded-md text-white flex items-center gap-2 bg-[#0088FF] hover:bg-[#0574D6]"
        >
          <PlusIcon className="w-5 h-5" />
          Add Customer
        </button>
      </div>
    </div>
  );
};

export default CustomerListToolbar;
