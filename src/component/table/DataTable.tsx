import type { Column } from "../../types/table";
import TableHeader from "./TableHeader";
import TablePagination from "./TablePagination";

type Props<T> = {
  columns: Column<T>[];
  data: T[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  startIndex: number;
  endIndex: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  onRowClick?: (row: T) => void;
};

export default function DataTable<T>({
  columns,
  data,
  page,
  pageSize,
  total,
  totalPages,
  startIndex,
  endIndex,
  onPageChange,
  onPageSizeChange,
  onRowClick,
}: Props<T>) {
  function displayValue(value: unknown) {
    if (
      value === null ||
      value === undefined ||
      (typeof value === "string" && value.trim() === "")
    ) {
      return "-";
    }
    return String(value);
  }

  return (
    <div className="bg-white rounded-md shadow-sm border overflow-hidden">
      {/* Scroll Container */}
      <div className="max-h-[calc(100vh-300px)] overflow-y-auto hide-scrollbar">
        <table className="w-full border-collapse table-fixed">
          <TableHeader columns={columns} />

          <tbody>
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-6 py-6 text-center text-gray-400"
                >
                  No data available
                </td>
              </tr>
            ) : (
              data.map((row, idx) => (
                <tr
                  key={idx}
                  onClick={() => onRowClick?.(row)}
                  className="border-t hover:bg-gray-50 transition-colors cursor-pointer font-light"
                >
                  {columns.map((col) => (
                    <td
                      key={String(col.key)}
                      style={{ width: col.width }}
                      className="px-6 py-4 overflow-hidden whitespace-nowrap text-ellipsis"
                    >
                      {col.render
                        ? col.render(row[col.key], row, startIndex + idx)
                        : displayValue(row[col.key])}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination (อยู่นอก scroll) */}
      <TablePagination
        page={page}
        pageSize={pageSize}
        total={total}
        totalPages={totalPages}
        startIndex={startIndex}
        endIndex={endIndex}
        onPageChange={onPageChange}
        onPageSizeChange={onPageSizeChange}
      />
    </div>
  );
}
