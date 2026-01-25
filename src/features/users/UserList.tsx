import React from "react";
import type { UserListItem } from "../../types/user";
import PlusIcon from "../../assets/svg/plus.svg?react";
import EditIcon from "../../assets/svg/edit.svg?react";
import ResetIcon from "../../assets/svg/reset.svg?react";
import { formatPhoneForDisplay } from "../../utils/phone";
import SearchIcon from "../../assets/svg/search.svg?react";

interface Props {
  users: UserListItem[];
  onCreateUser: () => void;
  onViewUser: (user: UserListItem) => void;
  onEditUser: (user: UserListItem) => void;
  onResetPassword: (user: UserListItem) => void;
  onToggleStatus: (u: UserListItem, isActive: boolean) => void;
  maxUsers?: number;
  search: string;
  onChangeSearch: (v: string) => void;
}

const UserList: React.FC<Props> = ({
  users,
  onCreateUser,
  onViewUser,
  onEditUser,
  onResetPassword,
  maxUsers = 3,
  search,
  onChangeSearch,
}) => {
  const activeUsers = users.filter((u) => u.status === "active").length;
  const canCreateUser = activeUsers < maxUsers;

  return (
    <div className="w-full">
      <div className="mb-4">
        {/* Title */}
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-regular text-[#06284B]">
            User &amp; Permission
          </h2>
          <span className="px-2 py-2 rounded-[5px] bg-[#FFCC00] text-sm text-white font-regular">
            {activeUsers}/{maxUsers}
          </span>
        </div>

        {/* Search (ซ้าย) + Add (ขวา) */}
        <div className="flex items-center justify-between mt-[30px]">
          {/* Search */}
          <div className="relative">
            <input
              value={search}
              onChange={(e) => onChangeSearch(e.target.value)}
              placeholder="Search"
              className="w-[400px] h-[40px] rounded-[10px] border border-[#CFCFCF]
              bg-white px-[20px] text-sm text-black font-light
              placeholder:text-[#BABABA] outline-none"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8B94A3]">
              <SearchIcon className="w-6 h-6" />
            </span>
          </div>

          {/* Add User */}
          <button
            onClick={onCreateUser}
            disabled={!canCreateUser}
            className={`flex items-center w-[123px] h-[44px] gap-[6px] px-[10px] py-[10px]
            rounded-md text-base font-regular text-white ${
              canCreateUser
                ? "bg-[#0088FF] hover:bg-[#0574D6]"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            <PlusIcon className="w-[24px] h-[24px]" />
            Add User
          </button>
        </div>
      </div>

      {/* ตาราง */}
      <div className="rounded-lg border border-[#E5E7EB] bg-white">
        <div className="grid grid-cols-[2fr,3fr,2fr,2fr,1fr] text-lg font-regular border-b bg-[#F7F7F7] text-black items-center px-6 py-3">
          <div>Name</div>
          <div>Email</div>
          <div>Phone</div>
          <div>Status</div>
          <div>Action</div>
        </div>

        {users.map((u) => (
          <div
            key={u.id}
            onClick={() => onViewUser(u)}
            className="grid grid-cols-[2fr,3fr,2fr,2fr,1fr] text-base bg-white hover:bg-[#FAFBFE]
             text-black items-center border-b px-6 py-3"
          >
            <div>{u.name}</div>
            <div className="px-1.5">{u.email?.trim() ? u.email : "-"}</div>

            <div>{formatPhoneForDisplay(u.phone)}</div>

            <div>
              <div
                className={`inline-flex items-center px-3 py-1 rounded-full border text-sm select-none ${
                  u.status === "active"
                    ? "border-green-500 text-black"
                    : "border-gray-900 text-gray-900"
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full mr-1 text-sm ${
                    u.status === "active" ? "bg-green-500" : "bg-gray-900"
                  }`}
                />
                {u.status === "active" ? "Active" : "Inactive"}
              </div>
            </div>

            <div className="flex justify-start gap-3">
              <button
                className="group px-2 py-1 rounded-md bg-[#FDFCDB] hover:bg-[#FFCC00]"
                onClick={(e) => {
                  e.stopPropagation();
                  onEditUser(u);
                }}
              >
                <EditIcon
                  width={20}
                  height={20}
                  color="#FFCC00"
                  className="group-hover:text-white"
                />
              </button>
              <button
                className="group px-2 py-1 rounded-md bg-[#FFDFDF] hover:bg-[#E71010]"
                onClick={(e) => {
                  onResetPassword?.(u);
                  e.stopPropagation();
                }}
              >
                <ResetIcon className="w-[18px] h-[18px] text-[#FF383C] group-hover:text-white" />
              </button>
            </div>
          </div>
        ))}

        {users.length === 0 && (
          <div className="h-96 bg-[#FAFAFA] flex items-center justify-center text-gray-500">
            No user created yet
          </div>
        )}
      </div>
    </div>
  );
};

export default UserList;
