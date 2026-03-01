import type { Column } from "../../types/table";
import type { UserListItem } from "../../types/user";
import EditIcon from "../../assets/svg/edit.svg?react";
import ResetIcon from "../../assets/svg/reset.svg?react";
import PlusIcon from "../../assets/svg/plus.svg?react";
import PrintIcon from "../../assets/svg/print.svg?react";
import FileExcel from "../../assets/svg/file-x.svg?react";
import SearchIcon from "../../assets/svg/search.svg?react";
import { formatPhoneForDisplay } from "../../utils/phone";
import DataTable from "../../component/table/DataTable";

type Props = {
  users: UserListItem[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  setPage: (page: number) => void;
  setPageSize: (size: number) => void;
  onViewUser: (user: UserListItem) => void;
  onEditUser: (user: UserListItem) => void;
  onResetPassword: (user: UserListItem) => void;

  // header actions
  onCreateUser: () => void;
  onPrint: () => void;
  onExportExcel: () => void;
  search: string;
  onChangeSearch: (v: string) => void;
  maxUsers?: number;
};

export default function UserListContainer({
  users,
  page,
  pageSize,
  total,
  totalPages,
  setPage,
  setPageSize,
  onViewUser,
  onEditUser,
  onResetPassword,
  onCreateUser,
  onPrint,
  onExportExcel,
  search,
  onChangeSearch,
  maxUsers = 3,
}: Props) {
  const activeUsers = users.filter((u) => u.status === "active").length;
  const canCreateUser = activeUsers < maxUsers;

  const columns: Column<UserListItem>[] = [
    {
      key: "id",
      header: "#",
      width: "120px",
      render: (_value, _row, index?: number) => index ?? "-",
    },
    {
      key: "name",
      header: "Name",
      width: "300px",
    },
    {
      key: "email",
      header: "Email",
      width: "300px",
      render: (value) =>
        typeof value === "string" && value.trim() !== "" ? value : "-",
    },
    {
      key: "phone",
      header: "Phone",
      render: (value) =>
        typeof value === "string" && value ? formatPhoneForDisplay(value) : "-",
    },
    {
      key: "status",
      header: "Status",
      render: (value) => {
        const isActive = value === "active";

        return (
          <div className="flex justify-start">
            <div
              onClick={(e) => {
                e.stopPropagation();
              }}
              className={` inline-flex items-center px-3 py-1 rounded-full border text-sm
                ${isActive ? "border-[#34C759] text-black" : "border-black"}`}
            >
              <span
                className={`w-2 h-2 rounded-full mr-2 ${
                  isActive ? "bg-[#34C759]" : "bg-black"
                }`}
              />
              {isActive ? "Active" : "Inactive"}
            </div>
          </div>
        );
      },
    },
    {
      key: "permissions",
      header: "Action",
      render: (_value, row) => {
        const isInactive = row.status === "inactive";

        return (
          <div className="flex justify-start gap-3">
            <button
              className="h-8 w-8 rounded-md grid place-items-center bg-[#FDFCDB] text-[#FFCC00] hover:bg-[#FFCC00] hover:text-white"
              onClick={(e) => {
                e.stopPropagation();
                onEditUser(row);
              }}
            >
              <EditIcon className="w-6 h-6" />
            </button>

            <button
              disabled={isInactive}
              className={[
                "h-8 w-8 rounded-md grid place-items-center transition",
                isInactive
                  ? "bg-[#DBDBDB] text-[#3F3F3F] cursor-not-allowed"
                  : "bg-[#FFDFDF] text-[#E71010] hover:bg-[#E71010] hover:text-white",
              ].join(" ")}
              onClick={(e) => {
                e.stopPropagation();
                if (!isInactive) onResetPassword(row);
              }}
            >
              <ResetIcon className="w-6 h-6" />
            </button>
          </div>
        );
      },
    },
  ];

  return (
    <div>
      {/* ================= Header ================= */}
      <div className="mb-6">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-normal text-[#06284B]">
            User &amp; Permission
          </h2>

          <span className="px-2 py-1 rounded-md bg-[#084072] text-sm text-white">
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
              <SearchIcon className="w-5 h-5" />
            </span>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-4">
            <button onClick={onPrint}>
              <PrintIcon className="w-7 h-7" />
            </button>

            <button onClick={onExportExcel}>
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
                }`}
            >
              <PlusIcon className="w-5 h-5" />
              Add User
            </button>
          </div>
        </div>
      </div>

      {/* ================= Table ================= */}
      <DataTable<UserListItem>
        columns={columns}
        data={users}
        page={page}
        pageSize={pageSize}
        total={total}
        totalPages={totalPages}
        startIndex={total === 0 ? 0 : (page - 1) * pageSize + 1}
        endIndex={total === 0 ? 0 : Math.min(page * pageSize, total)}
        onPageChange={setPage}
        onPageSizeChange={(size) => {
          setPageSize(size);
          setPage(1);
        }}
        onRowClick={onViewUser}
      />
    </div>
  );
}
