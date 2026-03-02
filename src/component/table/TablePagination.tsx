import PreviousIcon from "../../assets/svg/previous-pagination.svg?react";
import NextIcon from "../../assets/svg/next-pagination.svg?react";
import DropdownIcon from "../../assets/svg/select-dropodwn.svg?react";

type Props = {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  startIndex: number;
  endIndex: number;
  leftContent?: React.ReactNode;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
};

export default function TablePagination({
  page,
  pageSize,
  total,
  totalPages,
  startIndex,
  endIndex,
  leftContent,
  onPageChange,
  onPageSizeChange,
}: Props) {
  const isPrevDisabled = page === 1;
  const isNextDisabled = page === totalPages || totalPages === 0;

  return (
    <div className="flex items-center justify-between px-6 py-3 border-t text-sm text-[#545454]">
      {/* LEFT SIDE (optional) */}
      <div className="min-w-[180px]">{leftContent}</div>

      {/* Rows per page */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-4">
          <span>Rows per page:</span>

          <div className="relative">
            <select
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
              className="
              appearance-none
              border
              rounded-md
              px-3
              py-1.5
              pr-7
              text-sm
              bg-white
              focus:outline-none
              border-[#CFCFCF]
              focus-within:border-[#005AA7]
              transition
            "
            >
              <option value={10}>10</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>

            <DropdownIcon
              className="
              pointer-events-none
              absolute
              right-2
              top-1/2
              -translate-y-1/2
              w-4
              h-4
              text-gray-500
            "
            />
          </div>
        </div>

        {/* Showing range */}
        <div>
          {total === 0 ? "0-0 of 0" : `${startIndex}–${endIndex} of ${total}`}
        </div>

        {/* Pagination buttons */}
        <div className="flex gap-2">
          <button
            disabled={isPrevDisabled}
            onClick={() => {
              if (!isPrevDisabled) onPageChange(page - 1);
            }}
            className={`
            transition
            ${isPrevDisabled ? "opacity-40 cursor-not-allowed" : ""}
          `}
          >
            <PreviousIcon className="w-6 h-6" />
          </button>

          <button
            disabled={isNextDisabled}
            onClick={() => {
              if (!isNextDisabled) onPageChange(page + 1);
            }}
            className={`
            transition
            ${isNextDisabled ? "opacity-40 cursor-not-allowed" : ""}
          `}
          >
            <NextIcon className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
}
