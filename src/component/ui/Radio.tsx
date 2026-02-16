interface RadioProps<T extends string> {
  name: string;
  value: T;
  checked: boolean;
  label: string;
  onChange: (value: T) => void;
}

function Radio<T extends string>({
  name,
  value,
  checked,
  label,
  onChange,
}: RadioProps<T>) {
  return (
    <label className="inline-flex items-center cursor-pointer select-none gap-2">
      <span className="relative flex items-center justify-center">
        <input
          type="radio"
          name={name}
          checked={checked}
          onChange={() => onChange(value)}
          className="peer h-5 w-5 cursor-pointer appearance-none rounded-full border-[1px] border-slate-300 checked:border-[#0690F1] transition-all"
        />
        <span className="absolute w-3 h-3 rounded-full bg-[#0690F1] opacity-0 peer-checked:opacity-100 transition-opacity duration-200" />
      </span>

      <span className="text-sm text-black">{label}</span>
    </label>
  );
}

export default Radio;
