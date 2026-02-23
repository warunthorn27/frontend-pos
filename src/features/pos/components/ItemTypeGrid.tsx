import SearchIcon from "../../../assets/svg/search.svg?react";
import DropdownArrowIcon from "../../../assets/svg/dropdown-arrow2.svg?react";
import { itemTypes } from "../../../types/pos";
import ItemTypeCard from "./ItemTypeCard";

const ItemTypeGrid = () => {
  return (
    <div className="px-6">
      {/* TOP ROW */}
      <div
        className="flex justify-between items-center py-10
      "
      >
        {/* LEFT → TITLE */}
        <div className="text-xl text-[#06284B] font-normal">Item Type</div>

        {/* RIGHT → CONTROLS */}
        <div className="flex items-center gap-4">
          {/* CUSTOMER */}
          <div className="relative">
            <select
              className="w-72 h-10 rounded-md border border-[#CFCFCF] bg-white px-4 pr-10 text-sm font-light text-[#2A2A2A] appearance-none outline-none cursor-pointer"
              defaultValue=""
            >
              <option value="" disabled>
                Choose a customer
              </option>
            </select>

            {/* RED STAR */}
            <span className="absolute left-[155px] top-1/2 -translate-y-1/2 text-[#E71010]">
              *
            </span>

            <DropdownArrowIcon className="w-3 h-3 absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
          </div>

          {/* SEARCH */}
          <div className="relative">
            <input
              placeholder="Enter code"
              className="w-[360px] h-10 rounded-md border border-[#CFCFCF] bg-white px-4 text-sm font-light placeholder:text-[#BABABA] outline-none"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8B94A3]">
              <SearchIcon className="w-6 h-6" />
            </span>
          </div>
        </div>
      </div>

      {/* GRID */}
      <div className="flex flex-wrap gap-4">
        {itemTypes.map((item) => (
          <ItemTypeCard key={item.id} label={item.label} image={item.image} />
        ))}
      </div>
    </div>
  );
};

export default ItemTypeGrid;
