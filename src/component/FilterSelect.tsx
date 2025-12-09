import DropdownArrow2 from "../assets/icons/dropdown-arrow2.svg?react";

type FilterSelectProps = {
  label?: string;
  options: { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
};

export default function FilterSelect({
  label,
  options,
  value,
  onChange,
}: FilterSelectProps) {
  return (
    <div className="flex flex-col gap-1">
      {label && <span className="text-xs text-gray-500">{label}</span>}

      <div className="relative inline-block">
        {/* ตัว select จริง */}
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="
            w-40
            rounded-md
            border border-gray-300
            bg-white
            py-2 pl-3 pr-8
            text-sm text-gray-800
            appearance-none
            focus:outline-none
            focus:ring-2 focus:ring-blue-500 focus:border-blue-500
          "
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        {/* ไอคอนลูกศร (filter arrow) */}
        <DropdownArrow2
          className="
            pointer-events-none
            absolute
            right-3
            top-1/2 -translate-y-1/2
            w-3 h-3
            text-gray-500
          "
        />
      </div>
    </div>
  );
}
