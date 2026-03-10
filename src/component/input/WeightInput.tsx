import DropdownArrowIcon from "../../assets/svg/dropdown-arrow2.svg?react";
import type { SelectOption } from "../../types/shared/select";
import type { WeightUnit } from "../../types/shared/unit";

type Props = {
  value: string;
  unit: WeightUnit;
  unitOptions: ReadonlyArray<SelectOption>;
  onChangeValue: (v: string) => void;
  onChangeUnit: (u: WeightUnit) => void;
  disabledUnit?: boolean;
  selectClassName?: string;
};

const WeightInput: React.FC<Props> = ({
  value,
  unit,
  unitOptions,
  onChangeValue,
  onChangeUnit,
  disabledUnit = false,
  selectClassName,
}) => {
  return (
    <div className="relative">
      <input
        value={value === "0.00" ? "" : value}
        inputMode="decimal"
        onChange={(e) => {
          const val = e.target.value;

          if (/^\d*(\.\d{0,2})?$/.test(val)) {
            onChangeValue(val);
          }
        }}
        onBlur={(e) => {
          const num = Number(e.target.value || 0);
          const rounded = Math.ceil(num * 100) / 100;
          onChangeValue(rounded.toFixed(2));
        }}
        className="w-full h-[38px] rounded-md border border-[#CFCFCF] bg-white pl-3 pr-16 text-sm outline-none text-left focus:outline-none focus:border-[#005AA7]"
      />

      <div className="absolute right-0 top-0 h-full pr-1">
        <select
          value={unit}
          disabled={disabledUnit}
          onChange={(e) => onChangeUnit(e.target.value as WeightUnit)}
          className={`h-full bg-transparent pl-3 pr-7 appearance-none ${selectClassName}`}
        >
          {unitOptions.map((u) => (
            <option key={u.value} value={u.value}>
              {u.label}
            </option>
          ))}
        </select>

        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
          <DropdownArrowIcon className="w-3 h-3" />
        </span>
      </div>
    </div>
  );
};

export default WeightInput;
