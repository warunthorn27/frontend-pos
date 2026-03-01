import type { Column } from "../../types/table";
import TableFilter from "./TableFilter";
import TableSort from "./TableSort";

type Props<T> = {
  columns: Column<T>[];
};

export default function TableHeader<T>({ columns }: Props<T>) {
  return (
    <thead className="sticky top-0 z-20 bg-gray-50 shadow-[0_0.2px_0_0_rgba(229,231,235,1)]">
      <tr>
        {columns.map((col) => (
          <th
            key={String(col.key)}
            style={{ width: col.width }}
            className="px-6 py-4 text-lg font-normal bg-[#F7F7F7] truncate"
          >
            <div className="flex items-center gap-2">
              <span className="truncate">{col.header}</span>
              {col.sortable && <TableSort />}
              {col.filterable && <TableFilter />}
            </div>
          </th>
        ))}
      </tr>
    </thead>
  );
}
