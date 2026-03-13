import { useState, useRef, useEffect } from "react";
import type { PosCustomer } from "../../../services/pos/posCustom";
import DropdownArrow from "../../../assets/svg/dropdown-arrow2.svg?react";
import PlusIcon from "../../../assets/svg/plus.svg?react";

interface Props {
  customers: PosCustomer[];
  value: string;
  onChange: (customerId: string) => void;
  onAddCustomer?: () => void;
  error?: boolean;
}

const CustomerDropdown: React.FC<Props> = ({
  customers,
  value,
  onChange,
  onAddCustomer,
  error,
}) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const containerRef = useRef<HTMLDivElement>(null);

  const selected = customers.find((c) => c._id === value);

  /* close when click outside */
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
        setSearch("");
      }
    };

    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const filtered = customers
    .filter((c) => {
      const q = search.toLowerCase();

      return (
        c.customer_name.toLowerCase().includes(q) ||
        (c.customer_id ?? "").toLowerCase().includes(q) ||
        (c.customer_phone ?? "").includes(q)
      );
    })
    .sort((a, b) => (a.customer_id ?? "").localeCompare(b.customer_id ?? ""));

  const handleSelect = (c: PosCustomer) => {
    onChange(c._id);
    setSearch(c.customer_name);
    setOpen(false);
  };

  return (
    <div ref={containerRef} className="relative">
      {/* Input Trigger */}
      <div>
        <div className="relative">
          <input
            value={open ? search : (selected?.customer_name ?? "")}
            placeholder="Choose a customer"
            onFocus={() => {
              setOpen(true);
              setSearch(selected?.customer_name ?? "");
            }}
            onChange={(e) => {
              const val = e.target.value;

              setSearch(val);
              setOpen(true);

              if (val === "") {
                onChange("");
              }
            }}
            className={`w-full border text-[#2A2A2A] rounded-md font-light px-3 pr-8 h-[40px] focus:outline-none
      ${
        error
          ? "border-[#E71010] focus:border-[#E71010]"
          : "border-[#CFCFCF] focus:border-[#005AA7]"
      }`}
          />

          <DropdownArrow className="absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 pointer-events-none" />
        </div>

        {error && (
          <div className="text-[#E71010] text-sm font-light mt-1">
            Customer is required.
          </div>
        )}
      </div>

      {/* Dropdown */}
      {open && (
        <div className="absolute top-[calc(100%+4px)] left-0 right-0 bg-white border border-[#CFCFCF] rounded-md shadow-xl z-[200] overflow-hidden">
          {/* List */}
          <div className="max-h-[220px] overflow-y-auto hide-scrollbar">
            {filtered.length === 0 ? (
              <div className="p-3 text-center text-gray-400 text-sm font-light">
                No customers found
              </div>
            ) : (
              filtered.map((c) => (
                <div
                  key={c._id}
                  onClick={() => handleSelect(c)}
                  className={`px-4 py-2 cursor-pointer border-b border-gray-200 last:border-b-0 transition-colors
                  ${c._id === value ? "bg-[#F1F1F1]" : "hover:bg-gray-50"}`}
                >
                  <div className="text-sm font-normal text-[#2A2A2A]">
                    {c.customer_name}
                  </div>

                  <div className="text-xs text-gray-500 mt-1">
                    {c.customer_id}
                    {c.customer_phone && (
                      <span className="ml-4">{c.customer_phone}</span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div
            onClick={() => {
              setOpen(false);
              onAddCustomer?.();
            }}
            className="px-3 py-3 border-t border-gray-200 text-[13px] text-[#0690F1] cursor-pointer flex items-center gap-1 font-noemal hover:bg-gray-50"
          >
            <span className="flex items-center mr-1 text-[#0690F1]">
              <PlusIcon className="w-5 h-5" />
            </span>
            Add Customer
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerDropdown;
