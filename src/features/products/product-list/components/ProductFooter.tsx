import IconChevronDown from "../../../../assets/svg/dropdown-arrow.svg?react";

type Props = {
  rowsPerPage: number;
  onChangeRowsPerPage: (n: number) => void;
};

export default function ProductFooter({
  rowsPerPage,
  onChangeRowsPerPage,
}: Props) {
  return (
    <div className="flex items-center justify-end gap-2 px-4 py-3 bg-white">
      <span className="text-[12px] text-[#6B7280]">Rows per page</span>

      <div className="relative">
        <select
          value={rowsPerPage}
          onChange={(e) => onChangeRowsPerPage(Number(e.target.value))}
          className="h-[28px] w-[54px] rounded-[14px] border border-[#D7DDE8] bg-white px-2 pr-7 text-[12px] text-[#111827] outline-none"
        >
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={20}>20</option>
        </select>
        <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-[#6B7280]">
          <IconChevronDown />
        </span>
      </div>
    </div>
  );
}
