import React from "react";
import IconPencil from "../../../../assets/svg/edit.svg?react";
import IconTrash from "../../../../assets/svg/trash.svg?react";
import ToggleSwitch from "../../../../component/ui/ToggleSwitch";
import type { ProductRow } from "../../../../types/product/transform";
import ProductImage from "./ProductImage";
import Checkbox from "../../../../component/ui/Checkbox";
import TablePagination from "../../../../component/table/TablePagination";

type Props = {
  rows: ProductRow[];
  loading: boolean;
  selectIds: string[];

  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  startIndex: number;
  endIndex: number;

  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;

  onRowClick?: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onToggleStatus?: (id: string, active: boolean) => void;
  onSelectionChange?: (ids: string[]) => void;
};

function Th({
  children,
  className = "",
  ellipsis = false,
  title,
}: {
  children: React.ReactNode;
  className?: string;
  ellipsis?: boolean;
  title?: string;
}) {
  return (
    <th
      className={`px-6 py-4 text-lg font-normal bg-[#F7F7F7] border-b border-[#E7EDF6] truncate ${className}`}
    >
      {ellipsis ? (
        <span
          className="block overflow-hidden whitespace-nowrap text-ellipsis"
          title={title}
        >
          {children}
        </span>
      ) : (
        children
      )}
    </th>
  );
}

function Td({
  children,
  className = "",
  onClick,
  ellipsis = false,
  title,
}: {
  children: React.ReactNode;
  className?: string;
  onClick?: React.MouseEventHandler<HTMLTableCellElement>;
  ellipsis?: boolean;
  title?: string;
}) {
  return (
    <td
      className={`
        px-6 py-4
        overflow-hidden whitespace-nowrap text-ellipsis
        border-b border-[#EDF2FA]
        ${className}
      `}
      onClick={onClick}
    >
      {ellipsis ? (
        <span
          className="block overflow-hidden whitespace-nowrap text-ellipsis"
          title={title}
        >
          {children}
        </span>
      ) : (
        children
      )}
    </td>
  );
}

function IconButton({
  icon,
  onClick,
  color,
  label,
}: {
  icon: React.ReactNode;
  onClick: () => void;
  color: "yellow" | "red";
  label: string;
}) {
  const styles =
    color === "yellow"
      ? "bg-[#FDFCDB] text-[#FFCC00] hover:bg-[#FFCC00] hover:text-white"
      : "bg-[#FFDFDF] text-[#E71010] hover:bg-[#E71010] hover:text-white";

  return (
    <button
      type="button"
      onClick={onClick}
      className={`h-8 w-8 rounded-[6px] grid place-items-center ${styles}`}
      aria-label={label}
      title={label}
    >
      {icon}
    </button>
  );
}

function Muted({ children }: { children: React.ReactNode }) {
  return <span className="text-[#9AA3B2]">{children}</span>;
}

export default function ProductTable({
  rows,
  loading,
  page,
  pageSize,
  total,
  totalPages,
  startIndex,
  endIndex,
  onPageChange,
  onPageSizeChange,
  onRowClick,
  onEdit,
  onDelete,
  onToggleStatus,
  selectIds,
  onSelectionChange,
}: Props) {
  const safeSelectIds = selectIds ?? [];

  const currentPageIds = rows.map((r) => r.id);

  const selectedInCurrentPage = safeSelectIds.filter((id) =>
    currentPageIds.includes(id),
  );

  const isAllSelected =
    rows.length > 0 && selectedInCurrentPage.length === rows.length;

  const isIndeterminate =
    selectedInCurrentPage.length > 0 &&
    selectedInCurrentPage.length < rows.length;

  const toggleAll = () => {
    if (isAllSelected) {
      onSelectionChange?.(
        safeSelectIds.filter((id) => !currentPageIds.includes(id)),
      );
    } else {
      const newIds = Array.from(new Set([...safeSelectIds, ...currentPageIds]));
      onSelectionChange?.(newIds);
    }
  };

  const toggleOne = (id: string) => {
    if (safeSelectIds.includes(id)) {
      onSelectionChange?.(safeSelectIds.filter((v) => v !== id));
    } else {
      onSelectionChange?.([...safeSelectIds, id]);
    }
  };

  return (
    <div className="bg-white rounded-md shadow-sm overflow-hidden">
      {/* Scroll Container */}
      <div className="max-h-[calc(100vh-300px)] overflow-y-auto hide-scrollbar">
        <table className="w-full border-separate border-spacing-0 table-fixed text-base font-light">
          <thead className="sticky top-0 z-20 bg-gray-50">
            <tr className="text-left">
              <Th className="w-[40px] text-left">
                <Checkbox
                  checked={isAllSelected}
                  indeterminate={isIndeterminate}
                  onChange={toggleAll}
                  onClick={(e) => e.stopPropagation()}
                />
              </Th>

              <Th className="w-[70px] text-left">#</Th>
              <Th className="w-[100px] text-left">Image</Th>
              <Th className="w-[130px] text-left">Code</Th>
              <Th className="w-[180px] text-left">Product Name</Th>
              <Th className="w-[180px] text-left">Category</Th>
              <Th
                className="w-[180px] text-left"
                ellipsis
                title="Item Type / Stone Name"
              >
                Item Type / Stone Name
              </Th>
              <Th className="w-[120px] text-left">Size</Th>
              <Th className="w-[120px] text-left">Metal</Th>
              <Th className="w-[100px] text-left">Color</Th>
              <Th className="w-[110px] text-center">Action</Th>
              <Th className="w-[100px] text-center border-l border-[#E7EDF6]">
                Status
              </Th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan={12}
                  className="py-10 text-center text-sm text-[#9AA3B2]"
                >
                  Loading...
                </td>
              </tr>
            ) : rows.length === 0 ? (
              <tr>
                <td
                  colSpan={12}
                  className="py-10 text-center text-sm text-[#9AA3B2]"
                >
                  No data found
                </td>
              </tr>
            ) : (
              rows.map((r, index) => (
                <tr
                  key={r.id}
                  onClick={() => onRowClick?.(r.id)}
                  className="hover:bg-gray-50 transition-colors cursor-pointer font-light text-left"
                >
                  <Td className="w-[40px]" onClick={(e) => e.stopPropagation()}>
                    <Checkbox
                      checked={safeSelectIds.includes(r.id)}
                      onChange={() => toggleOne(r.id)}
                      onClick={(e) => e.stopPropagation()}
                    />
                  </Td>

                  <Td className="w-[50px]">{startIndex + index}</Td>

                  <Td className="w-[90px]">
                    <ProductImage imageUrl={r.imageUrl} />
                  </Td>

                  <Td className="w-[120px]" ellipsis title={r.code}>
                    {r.code}
                  </Td>

                  <Td className="w-[180px]" ellipsis title={r.productName}>
                    {r.productName}
                  </Td>

                  <Td className="w-[160px]" ellipsis title={r.categoryLabel}>
                    {r.categoryLabel}
                  </Td>

                  <Td className="w-[180px]" ellipsis title={r.typeOrStone}>
                    {r.typeOrStone || <Muted>-</Muted>}
                  </Td>

                  <Td className="w-[120px]">{r.size || <Muted>-</Muted>}</Td>

                  <Td className="w-[120px]" ellipsis title={r.metal}>
                    {r.metal || <Muted>-</Muted>}
                  </Td>

                  <Td className="w-[140px]" ellipsis title={r.color}>
                    {r.color || <Muted>-</Muted>}
                  </Td>

                  <Td
                    className="w-[110px] text-center"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex items-center justify-center gap-[10px]">
                      <IconButton
                        color="yellow"
                        onClick={() => onEdit(r.id)}
                        icon={<IconPencil />}
                        label="Edit"
                      />
                      <IconButton
                        color="red"
                        onClick={() => onDelete(r.id)}
                        icon={<IconTrash />}
                        label="Delete"
                      />
                    </div>
                  </Td>

                  <Td
                    className="w-[80px] text-center border-l border-[#EDF2FA]"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex justify-center">
                      <ToggleSwitch
                        checked={r.status === "active"}
                        onChange={(value: boolean) =>
                          onToggleStatus?.(r.id, value)
                        }
                      />
                    </div>
                  </Td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <TablePagination
        page={page}
        pageSize={pageSize}
        total={total}
        totalPages={totalPages}
        startIndex={startIndex}
        endIndex={endIndex}
        onPageChange={onPageChange}
        onPageSizeChange={onPageSizeChange}
        leftContent={
          safeSelectIds.length > 0 ? (
            <span className="text-[#545454]">
              {safeSelectIds.length === rows.length
                ? "All items selected"
                : `${safeSelectIds.length} items selected`}
            </span>
          ) : null
        }
      />
    </div>
  );
}
