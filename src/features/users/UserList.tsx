import React from "react";
import type { UserListItem } from "../../types/user";
import PlusIcon from "../../assets/svg/plus.svg?react";
import EditIcon from "../../assets/svg/edit.svg?react";
import ResetIcon from "../../assets/svg/reset.svg?react";
import { formatPhoneForDisplay } from "../../utils/phone";
import SearchIcon from "../../assets/svg/search.svg?react";
import PrintIcon from "../../assets/svg/print.svg?react";
import FileExcel from "../../assets/svg/file-x.svg?react";

//  Table Header Cell
type TableHeaderCellProps = {
  align?: "left" | "center" | "right";
  className?: string;
  children: React.ReactNode;
};

export function TableHeaderCell({
  align = "left",
  className = "",
  children,
}: TableHeaderCellProps) {
  return (
    <th
      className={`
        px-4 py-3 text-lg font-normal text-black
        ${align === "center" ? "text-center" : "text-left"}
        ${className}
      `}
    >
      {children}
    </th>
  );
}

//  UserList Props
interface UserListProps {
  users: UserListItem[];
  onCreateUser: () => void;
  onViewUser: (user: UserListItem) => void;
  onEditUser: (user: UserListItem) => void;
  onResetPassword: (user: UserListItem) => void;
  onToggleStatus: (u: UserListItem, isActive: boolean) => void;
  maxUsers?: number;
  search: string;
  onChangeSearch: (v: string) => void;
  onPrint: () => void;
  onExportExcel: () => void;
}

//  Component
const UserList: React.FC<UserListProps> = ({
  users,
  onCreateUser,
  onViewUser,
  onEditUser,
  onResetPassword,
  maxUsers = 3,
  search,
  onChangeSearch,
  onPrint,
  onExportExcel,
}) => {
  const activeUsers = users.filter((u) => u.status === "active").length;
  const canCreateUser = activeUsers < maxUsers;

  return (
    <div className="w-full">
      {/* ================= Header ================= */}
      <div className="mb-7">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-normal text-[#06284B]">
            User &amp; Permission
          </h2>
          <span className="px-1.5 py-1.5 rounded-lg bg-[#F1F1F1] text-sm text-[#024C8A]">
            {activeUsers}/{maxUsers}
          </span>
        </div>

        {/* Search + Actions */}
        <div className="flex items-center justify-between mt-6">
          {/* Search */}
          <div className="relative">
            <input
              value={search}
              onChange={(e) => onChangeSearch(e.target.value)}
              placeholder="Search"
              className="w-[400px] h-[40px] rounded-md border border-[#CFCFCF]
              bg-white px-5 text-sm outline-none placeholder:text-[#BABABA]"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8B94A3]">
              <SearchIcon className="w-6 h-6" />
            </span>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-4">
            <button onClick={onPrint} title="Print">
              <PrintIcon className="w-7 h-7" />
            </button>

            <button onClick={onExportExcel} title="Export Excel">
              <FileExcel className="w-7 h-7" />
            </button>

            <button
              onClick={onCreateUser}
              disabled={!canCreateUser}
              className={`px-3 py-2 rounded-md text-white flex items-center gap-2
                ${
                  canCreateUser
                    ? "bg-[#0088FF] hover:bg-[#0574D6]"
                    : "bg-gray-400 cursor-not-allowed"
                }
              `}
            >
              <PlusIcon className="w-5 h-5" />
              Add User
            </button>
          </div>
        </div>
      </div>

      {/* ================= Table ================= */}
      <div className="rounded-lg border border-[#E5E7EB] bg-white overflow-hidden">
        <table className="w-full border-collapse">
          <thead className="bg-[#F7F7F7]">
            <tr className="border-b">
              <TableHeaderCell align="center" className="w-[60px]">
                #
              </TableHeaderCell>
              <TableHeaderCell>Name</TableHeaderCell>
              <TableHeaderCell>Email</TableHeaderCell>
              <TableHeaderCell>Phone</TableHeaderCell>
              <TableHeaderCell align="center">Status</TableHeaderCell>
              <TableHeaderCell align="center">Action</TableHeaderCell>
            </tr>
          </thead>

          <tbody className="text-base text-black">
            {users.map((u, index) => {
              const isInactive = u.status === "inactive";

              return (
                <tr
                  key={u.id}
                  onClick={() => onViewUser(u)}
                  className="border-b hover:bg-[#FAFBFE] cursor-pointer"
                >
                  {/* # */}
                  <td className="px-4 py-3 text-center">{index + 1}</td>

                  {/* Name */}
                  <td className="px-4 py-3 text-left">{u.name || "-"}</td>

                  {/* Email */}
                  <td className="px-4 py-3 text-left">
                    {u.email?.trim() || "-"}
                  </td>

                  {/* Phone */}
                  <td className="px-4 py-3 text-left">
                    {u.phone ? formatPhoneForDisplay(u.phone) : "-"}
                  </td>

                  {/* Status */}
                  <td className="px-4 py-3">
                    <div className="flex justify-center">
                      <div
                        className={`inline-flex items-center px-3 py-1 rounded-full border text-sm select-none
                        ${
                          u.status === "active"
                            ? "border-[#34C759] text-black"
                            : "border-black text-black"
                        }
                      `}
                      >
                        <span
                          className={`w-2 h-2 rounded-full mr-1.5 text-sm ${
                            u.status === "active" ? "bg-green-500" : "bg-black"
                          }`}
                        />
                        {u.status === "active" ? "Active" : "Inactive"}
                      </div>
                    </div>
                  </td>

                  {/* Action */}
                  <td className="px-4 py-3">
                    <div className="flex justify-center gap-3">
                      <div className="relative group">
                        <button
                          className="px-2 py-1 rounded-md bg-[#FDFCDB] text-[#FFCC00] hover:bg-[#FFCC00] hover:text-white"
                          onClick={(e) => {
                            e.stopPropagation();
                            onEditUser(u);
                          }}
                        >
                          <EditIcon className="w-5 h-5" />

                          {/* Tooltip */}
                          <div
                            className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2
                            hidden group-hover:block whitespace-nowrap bg-black text-white text-xs px-2 py-1 rounded"
                          >
                            Edit
                          </div>
                        </button>
                      </div>

                      <div className="relative group">
                        <button
                          disabled={isInactive}
                          className={[
                            "px-2 py-1 rounded-md transition",
                            isInactive
                              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                              : "bg-[#FFDFDF] text-[#E71010] hover:bg-[#E71010] hover:text-white",
                          ].join(" ")}
                          onClick={(e) => {
                            e.stopPropagation();
                            if (isInactive) return;
                            onResetPassword(u);
                          }}
                        >
                          <ResetIcon className="w-5 h-5" />
                        </button>

                        {/* Tooltip */}
                        <div
                          className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2
                          hidden group-hover:block whitespace-nowrap bg-black text-white text-xs px-2 py-1 rounded"
                        >
                          {isInactive
                            ? "User cannot receive emails"
                            : "Reset password"}
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
              );
            })}

            {users.length === 0 && (
              <tr>
                <td colSpan={6} className="h-96 text-center text-gray-500">
                  No user created yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserList;
