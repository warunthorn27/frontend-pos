import SearchIcon from "../../../assets/svg/search.svg?react";
import type { CatalogueMode } from "../../../types/pos/catalogue";
import MasterIcon from "../../../assets/svg/crown.svg?react";
import InventoryIcon from "../../../assets/svg/inventory.svg?react";

interface Props {
  title?: string;
  breadcrumb?: React.ReactNode;
  mode?: CatalogueMode;
  setMode?: (mode: CatalogueMode) => void;
  showModeToggle?: boolean;
  showSearch?: boolean;
}

const PosToolbar: React.FC<Props> = ({
  title,
  breadcrumb,
  mode,
  setMode,
  showModeToggle = true,
  showSearch = true,
}) => {
  return (
    <div className="flex justify-between items-start py-8">
      {/* LEFT SIDE */}
      <div className="flex items-center gap-4">
        {breadcrumb ? (
          <div className="text-sm text-gray-500">{breadcrumb}</div>
        ) : (
          <div className="text-xl text-[#06284B]">{title}</div>
        )}
      </div>

      {/* RIGHT SIDE (SEARCH) */}
      <div className="relative">
        <div className="flex gap-4">
          {showModeToggle && mode && setMode && (
            <div className="flex gap-2">
              <button
                onClick={() => setMode("master")}
                className={`w-[136px] h-10 px-4 rounded-md border flex items-center justify-center gap-2 ${mode === "master"
                    ? "bg-white border-[#0071CE] text-[#0071CE]"
                    : "border-[#CFCFCF] text-[#2A2A2A]"
                  }`}
              >
                <MasterIcon
                  className={`w-5 h-5 ${mode === "master" ? "text-[#0071CE]" : "text-[#2A2A2A]"
                    }`}
                />
                Master
              </button>

              <button
                onClick={() => setMode("inventory")}
                className={`w-[136px] h-10 px-4 rounded-md border flex items-center justify-center gap-2 ${mode === "inventory"
                    ? "bg-white border-[#0071CE] text-[#0071CE]"
                    : "border-[#CFCFCF] text-[#2A2A2A]"
                  }`}
              >
                <InventoryIcon
                  className={`w-5 h-5 ${mode === "inventory" ? "text-[#0071CE]" : "text-[#2A2A2A]"
                    }`}
                />
                Inventory
              </button>
            </div>
          )}

          {showSearch && (
            <div className="relative">
              <input
                placeholder="Enter code"
                className="w-[360px] h-10 rounded-md border border-[#CFCFCF] bg-white px-4 text-sm font-light placeholder:text-[#BABABA] outline-none"
              />
              <SearchIcon className="w-5 h-5 absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PosToolbar;
