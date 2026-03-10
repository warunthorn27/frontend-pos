type Props = {
  label: string;
  value?: string | number | null;
};

export default function DetailRow({ label, value }: Props) {
  const display =
    value === null || value === undefined || value === "" ? "-" : value;

  return (
    <div className="flex py-[2px] text-sm">
      {/* LABEL */}
      <span className="w-[150px] text-black shrink-0">{label} :</span>

      {/* VALUE */}
      <span className="flex-1 min-w-0 font-light text-black break-words">
        {display}
      </span>
    </div>
  );
}
