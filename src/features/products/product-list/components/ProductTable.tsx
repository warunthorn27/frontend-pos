import React from "react";
import IconPencil from "../../../../assets/svg/edit.svg?react";
import IconTrash from "../../../../assets/svg/trash.svg?react";
import ToggleSwitch from "../../../../component/ui/ToggleSwitch";
import type { ProductRow } from "../../../../types/product/transform";
import ProductImage from "./ProductImage";
import Checkbox from "../../../../component/ui/Checkbox";

type Props = {
  rows: ProductRow[];
  loading: boolean;
  onRowClick?: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onToggleStatus?: (id: string, active: boolean) => void;
  // indetermenate?: boolean;
  selectIds?: string[];
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
      className={`px-4 py-3 text-lg font-normal text-left bg-[#F7F7F7] ${className}`}
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
    <td className={`px-4 py-3 ${className}`} onClick={onClick}>
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
  onRowClick,
  onEdit,
  onDelete,
  onToggleStatus,
  selectIds = [],
  onSelectionChange,
}: Props) {
  const allIds = rows.map((r) => r.id);

  const isAllSelected = rows.length > 0 && selectIds.length === rows.length;

  const isIndeterminate =
    selectIds.length > 0 && selectIds.length < rows.length;

  const toggleAll = () => {
    onSelectionChange?.(isAllSelected || isIndeterminate ? [] : allIds);
  };

  const toggleOne = (id: string) => {
    if (selectIds.includes(id)) {
      onSelectionChange?.(selectIds.filter((v) => v !== id));
    } else {
      onSelectionChange?.([...selectIds, id]);
    }
  };

  return (
    <div className="w-full rounded-[6px] border border-[#F0F0F2] bg-white overflow-auto">
      {/* ================= HEADER ================= */}
      <table className="w-full text-base font-light border-collapse table-fixed">
        <thead className="sticky top-0 z-20">
          <tr className="border-b border-[#F0F0F2]">
            <Th className="w-[40px]">
              <Checkbox
                checked={isAllSelected}
                indeterminate={isIndeterminate}
                onChange={toggleAll}
                onClick={(e) => e.stopPropagation()}
              />
            </Th>
            <Th className="w-[50px]">#</Th>
            <Th className="w-[90px]">Image</Th>
            <Th className="w-[120px]">Code</Th>
            <Th className="w-[180px]">Product Name</Th>
            <Th className="w-[160px]">Category</Th>
            <Th className="w-[180px]" ellipsis title="Item Type / Stone Name">
              Item Type / Stone Name
            </Th>
            <Th className="w-[120px]">Size</Th>
            <Th className="w-[120px]">Metal</Th>
            <Th className="w-[140px]">Color</Th>
            <Th className="w-[110px] text-center">Action</Th>
            <Th className="w-[80px] text-center border-l border-[#E7EDF6]">
              Status
            </Th>
          </tr>
        </thead>
      </table>

      {/* ================= BODY (SCROLL) ================= */}
      <div className="max-h-[600px] overflow-auto hide-scrollbar">
        <table className="w-full text-base font-light border-collapse table-fixed">
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
                  className="border-b border-[#EDF2FA] text-[#111827] hover:bg-[#FAFBFE] cursor-pointer"
                >
                  <Td className="w-[40px]" onClick={(e) => e.stopPropagation()}>
                    <Checkbox
                      checked={selectIds.includes(r.id)}
                      onChange={() => toggleOne(r.id)}
                      onClick={(e) => e.stopPropagation()}
                    />
                  </Td>

                  <Td className="w-[50px]">{index + 1}</Td>
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
                    className="w-[110px]"
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
                    className="w-[80px] border-l border-[#EDF2FA]"
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

      {/* ================= FOOTER ================= */}
      <div className="sticky bottom-0 z-20 flex justify-end items-center gap-2 px-4 py-3 text-sm text-[#545454] bg-white border-t border-[#E7EDF6]">
        Rows per page
        <select className="h-7 rounded-md border border-[#D7DDE8] bg-white px-2 text-sm outline-none">
          <option>10</option>
          <option>20</option>
          <option>50</option>
        </select>
      </div>
    </div>
  );
}
