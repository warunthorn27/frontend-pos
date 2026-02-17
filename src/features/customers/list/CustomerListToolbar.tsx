import React from "react";
import PlusIcon from "../../../assets/svg/plus.svg?react";
import SearchIcon from "../../../assets/svg/search.svg?react";
import PrintIcon from "../../../assets/svg/print.svg?react";
import ExportIcon from "../../../assets/svg/file-x.svg?react";
import DropdownArrowIcon from "../../../assets/svg/dropdown-arrow2.svg?react";

type Props = {
  onAddCustomerClick: () => void;
};

const CustomerListToolbar: React.FC<Props> = ({ onAddCustomerClick }) => {
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex gap-3">
        <div className="flex items-center border border-[#CFCFCF] bg-white rounded-md px-3 h-[40px] w-[400px]">
          <input
            className="flex-1 bg-transparent text-sm outline-none"
            placeholder="Search"
          />
          <SearchIcon className="w-4 h-4 text-gray-400" />
        </div>

        <div className="relative w-[180px]">
          <select
            className="
              h-[40px] w-full
              appearance-none
              rounded-md border border-[#CFCFCF]
              bg-white
              px-3 pr-9
              text-sm
              outline-none
              focus:border-[#2F80ED]
            "
          >
            <option>Business Type</option>
            <option>Individual</option>
            <option>Corporation</option>
          </select>

          <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
            <DropdownArrowIcon className="w-3 h-3 text-gray-500" />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <PrintIcon className="w-7 h-7 text-gray-600 cursor-pointer" />
        <ExportIcon className="w-7 h-7 text-gray-600 cursor-pointer" />

        <button
          onClick={onAddCustomerClick}
          className="flex items-center gap-2 px-4 h-[40px] rounded-md text-base font-normal text-white bg-[#0088FF] hover:bg-[#0574D6]"
        >
          <PlusIcon className="w-5 h-5" />
          Add Customer
        </button>
      </div>
    </div>
  );
};

export default CustomerListToolbar;
