import React from "react";

type Props = {
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (p: number) => void;
  onPageSizeChange: (s: number) => void;
};

const CustomerTablePagination: React.FC<Props> = ({
  page,
  pageSize,
  total,
  onPageChange,
  onPageSizeChange,
}) => {
  const totalPages = Math.ceil(total / pageSize);

  const start = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, total);

  return (
    <div className="flex items-center justify-end gap-6 text-sm text-gray-600">
      <div className="flex items-center gap-2">
        <span>Rows per page</span>
        <select
          value={pageSize}
          onChange={(e) => onPageSizeChange(Number(e.target.value))}
          className="h-8 rounded-md border border-gray-300 bg-white px-2"
        >
          {[10, 20, 50].map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      <div>
        {start}-{end} of {total}
      </div>

      <div className="flex items-center gap-3 text-lg">
        <button
          disabled={page === 1}
          onClick={() => onPageChange(page - 1)}
          className="disabled:opacity-40"
        >
          ‹
        </button>

        <button
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
          className="disabled:opacity-40"
        >
          ›
        </button>
      </div>
    </div>
  );
};

export default CustomerTablePagination;
