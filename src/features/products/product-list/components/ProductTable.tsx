import React from "react";
import IconPencil from "../../../../assets/svg/edit.svg?react";
import IconTrash from "../../../../assets/svg/trash.svg?react";
import ProductThumb from "../components/ProductThumb";
import ToggleSwitch from "../../../../component/toggle/ToggleSwitch";

export type ProductRow = {
  id: string;
  image: "necklace" | "diamond" | "ring" | "teddy" | "chain";
  code: string;
  productName: string;
  category: string;
  typeOrStone: string;
  size: string;
  metal: string;
  color: string;
  status: "active" | "inactive";
};

type Props = {
  rows: ProductRow[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onToggleStatus?: (id: string, status: boolean) => void;
};

function Th({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <th className={`px-4 py-3 text-lg font-normal text-left ${className}`}>
      {children}
    </th>
  );
}

function Td({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <td className={`px-4 py-3 ${className}`}>{children}</td>;
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
      ? "bg-[#FFF4CC] text-[#F5B301]"
      : "bg-[#FFE4E4] text-[#FF3B30]";

  return (
    <button
      type="button"
      onClick={onClick}
      className={`h-8 w-8 rounded-[6px] grid place-items-center hover:brightness-95 ${styles}`}
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
  onEdit,
  onDelete,
  onToggleStatus,
}: Props) {
  return (
    <div className="w-full overflow-x-auto border border-[#F0F0F2] bg-white">
      <table className="w-full min-w-[1400px] text-base font-light">
        {/* ================= HEADER ================= */}
        <thead className="bg-[#F7F7F7] text-black">
          <tr className="border-b border-[#F0F0F2]">
            <Th className="w-[40px]">
              <input type="checkbox" />
            </Th>
            <Th className="w-[50px]">#</Th>
            <Th className="w-[90px]">Image</Th>
            <Th className="w-[120px]">Code</Th>
            <Th className="w-[180px]">Product Name</Th>
            <Th className="w-[160px]">Category</Th>
            <Th className="w-[180px]">Type / Stone Name</Th>
            <Th className="w-[120px]">Size</Th>
            <Th className="w-[120px]">Metal</Th>
            <Th className="w-[140px]">Color</Th>
            <Th className="w-[110px] text-center">Action</Th>
            <Th className="w-[110px] text-center border-l border-[#E7EDF6]">
              Status
            </Th>
          </tr>
        </thead>

        {/* ================= BODY ================= */}
        <tbody>
          {rows.map((r, index) => (
            <tr
              key={r.id}
              className="border-b border-[#EDF2FA] text-[#111827] hover:bg-[#FAFBFE]"
            >
              {/* checkbox */}
              <Td>
                <input type="checkbox" />
              </Td>

              {/* row number */}
              <Td>{index + 1}</Td>

              {/* image */}
              <Td>
                <ProductThumb kind={r.image} />
              </Td>

              {/* data */}
              <Td>{r.code}</Td>
              <Td>{r.productName}</Td>
              <Td>{r.category}</Td>
              <Td>{r.typeOrStone || <Muted>-</Muted>}</Td>
              <Td>{r.size || <Muted>-</Muted>}</Td>
              <Td>{r.metal || <Muted>-</Muted>}</Td>
              <Td>{r.color || <Muted>-</Muted>}</Td>

              {/* action */}
              <Td>
                <div className="flex items-center justify-center gap-2">
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

              <Td className="border-l border-[#EDF2FA]">
                <div className="flex justify-center">
                  <ToggleSwitch
                    checked={r.status === "active"}
                    onChange={(v) => onToggleStatus?.(r.id, v)}
                  />
                </div>
              </Td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* ================= FOOTER ================= */}
      <div className="flex justify-end items-center gap-2 px-4 py-3 text-sm text-[#545454]">
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
