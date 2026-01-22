import { useEffect, useRef, type FC, type MouseEventHandler } from "react";
import CheckIcon from "../../assets/svg/checkbox.svg?react";

type CheckboxProps = {
  checked: boolean;
  indeterminate?: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  onClick?: MouseEventHandler<HTMLLabelElement>;
};

const Checkbox: FC<CheckboxProps> = ({
  checked,
  indeterminate = false,
  onChange,
  disabled,
  onClick,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.indeterminate = indeterminate;
    }
  }, [indeterminate]);

  return (
    <label
      className={`items-center ${
        disabled ? "cursor-not-allowed" : "cursor-pointer"
      }`}
      onClick={onClick}
    >
      <input
        type="checkbox"
        className="sr-only"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        disabled={disabled}
      />

      <span
        className={`
          flex items-center justify-center
          w-5 h-5 rounded-[4px]
         
          ${
            checked || indeterminate
              ? "bg-[#2DA9FF]"
              : "bg-white border-2 border-[#CFCFCF]"
          }
          ${disabled ? "opacity-50" : ""}
        `}
      >
        {checked && <CheckIcon className="w-4 h-4 text-white" />}

        {indeterminate && !checked && (
          <span className="w-2.5 h-0.5 bg-white rounded flex items-center" />
        )}
      </span>
    </label>
  );
};

export default Checkbox;
