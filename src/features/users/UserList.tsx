import React from "react";
import type { UserListItem } from "../../types/user";
import plusIcon from "../../assets/svg/plus.svg";
import EditIcon from "../../assets/svg/edit.svg?react";
import ResetIcon from "../../assets/svg/reset.svg?react";

interface Props {
  users: UserListItem[];
  onCreateUser: () => void;
  onEditUser: (user: UserListItem) => void;
  onResetPassword: (user: UserListItem) => void;
  onToggleStatus: (u: UserListItem, isActive: boolean) => void;
  maxUsers?: number;
}

const UserList: React.FC<Props> = ({
  users,
  onCreateUser,
  onEditUser,
  onResetPassword,
  onToggleStatus,
  maxUsers = 3,
}) => {
  const activeUsers = users.filter((u) => u.status === "active").length;
  const canCreateUser = activeUsers < maxUsers;

  return (
    <div className="w-full bg-gray">
      <div className="flex items-center justify-between mb-[9px]">
        <div className="flex items-center gap-2">
          <h2 className="text-2xl font-regular text-[#06284B]">
            User &amp; Permission
          </h2>
          <span className="px-2.5 py-1.5 rounded-md bg-[#FFCC00] text-[12px] text-white font-regular">
            {activeUsers}/{maxUsers}
          </span>
        </div>

        <span className="text-sm"></span>
        <button
          onClick={onCreateUser}
          disabled={!canCreateUser}
          className={`flex items-center gap-2 px-4 py-2 rounded-md text-xs font-regular text-white ${
            canCreateUser
              ? "bg-[#0088FF] hover:bg-[#0574D6]"
              : "bg-gray-400 cursor-not-allowed"
          }`}
        >
          <img src={plusIcon} alt="" className="w-[16px]" />
          Add User
        </button>
      </div>

      {/* ตาราง */}
      <div className="border shadow-sm rounded-md overflow-hidden">
        <div className="grid grid-cols-[1fr,1fr,1fr,1fr,1fr] text-sm font-regular border-b bg-[#F7F7F7] text-black items-center px-6">
          <div className="px-4 py-4">Name</div>
          <div className="px-4 py-4">Email</div>
          <div className="px-4 py-4">Phone</div>
          <div className="px-3 py-4">Status</div>
          <div className="px-24 py-4">Action</div>
        </div>

        {users.map((u) => (
          <div
            key={u.id}
            className="grid grid-cols-[1fr,1fr,1fr,1fr,1fr] text-xs bg-white text-gray-800 h-10 items-center px-10 border-b"
          >
            <div>{u.name}</div>
            <div className="px-1.5">{u.email}</div>
            <div className="px-3">{u.phone}</div>

            <div>
              <button
                onClick={() => onToggleStatus(u, u.status === "inactive")}
                className={`inline-flex items-center px-3 py-1 rounded-full border text-[11px] cursor-pointer hover:opacity-80 ${
                  u.status === "active"
                    ? "border-green-500 text-black"
                    : "border-gray-400 text-gray-500"
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full mr-1 ${
                    u.status === "active" ? "bg-green-500" : "bg-gray-400"
                  }`}
                />
                {u.status === "active" ? "Active" : "Inactive"}
              </button>
            </div>

            {/* ปุ่ม Edit + Reset Password */}
            <div className="flex justify-end gap-2 pr-14">
              <button
                className="group px-2 py-1 rounded-md bg-[#FDFCDB] hover:bg-[#FFCC00]"
                onClick={() => onEditUser(u)}
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
                onClick={() => onResetPassword?.(u)}
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
