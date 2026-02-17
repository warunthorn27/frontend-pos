import React from "react";
import IconPencil from "../../../assets/svg/edit.svg?react";
import IconTrash from "../../../assets/svg/trash.svg?react";
import type { CustomerListItem } from "../../../types/customer";

type Props = {
  data: CustomerListItem[];
  page: number;
  pageSize: number;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
};

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
      className={`h-8 w-8 rounded-[6px] grid place-items-center transition ${styles}`}
      aria-label={label}
      title={label}
    >
      {icon}
    </button>
  );
}

const CustomerTable: React.FC<Props> = ({ data }) => {
  return (
    <div className="bg-white">
      <div className="max-h-[500px] overflow-auto">
        <table className="min-w-full text-base text-black">
          <thead className="bg-[#F7F7F7] border-b text-lg">
            <tr>
              <th className="px-4 py-3 font-normal text-left">#</th>
              <th className="px-4 py-3 font-normal text-left">Customer ID</th>
              <th className="px-4 py-3 font-normal text-left">Business Type</th>
              <th className="px-4 py-3 font-normal text-left">Company Name</th>
              <th className="px-4 py-3 font-normal text-left">Name</th>
              <th className="px-4 py-3 font-normal text-left">Email</th>
              <th className="px-4 py-3 font-normal text-left">Phone</th>
              <th className="px-4 py-3 font-normal text-center">Action</th>
            </tr>
          </thead>

          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-10 text-center text-gray-500">
                  No customers found
                </td>
              </tr>
            ) : (
              data.map((c, index) => (
                <tr key={c.id} className="border-b last:border-b-0 font-light">
                  <td className="px-4 py-[14px]">{index + 1}</td>
                  <td className="px-4 py-[14px]">{c.id}</td>
                  <td className="px-4 py-[14px]">{c.businessType}</td>
                  <td className="px-4 py-[14px]">{c.companyName || "-"}</td>
                  <td className="px-4 py-[14px]">{c.name}</td>
                  <td className="px-4 py-[14px]">{c.email || "-"}</td>
                  <td className="px-4 py-[14px]">{c.phone || "-"}</td>

                  <td className="px-4 py-[14px]">
                    <div className="flex justify-center gap-[10px]">
                      <IconButton
                        color="yellow"
                        icon={<IconPencil />}
                        label="Edit"
                        onClick={() => {}}
                      />
                      <IconButton
                        color="red"
                        icon={<IconTrash />}
                        label="Delete"
                        onClick={() => {}}
                      />
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CustomerTable;
