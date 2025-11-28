import React from "react";
import type { UserListItem } from "../../types/user";

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
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <h2 className="text-2xl font-semibold text-[#0053A4]">
            User &amp; Permission
          </h2>
          <span className="px-2 py-1 rounded-md bg-[#FF8D28] text-[12px] text-white font-semibold">
            {activeUsers}/3
          </span>
        </div>

        <span className="text-sm"></span>
        <button
          onClick={onCreateUser}
          disabled={!canCreateUser}
          className={`px-6 py-2 rounded-md text-xs font-normal text-white ${
            canCreateUser
              ? "bg-[#0088FF] hover:bg-blue-500"
              : "bg-gray-400 cursor-not-allowed"
          }`}
        >
          Create User
        </button>
      </div>

      {/* ตาราง */}
      <div className="border shadow-sm rounded-md overflow-hidden text-xs">
        <div className="grid grid-cols-[1fr,1fr,1fr,1fr,1fr] text-xs font-medium  border-b-2 bg-[#F1F1F1] text-black items-center px-6">
          <div className="px-4 py-4">Name</div>
          <div className="px-4 py-4">Email</div>
          <div className="px-4 py-4">Phone</div>
          <div className="px-4 py-4">Status</div>
          <div className="px-4 py-4">Permission</div>
        </div>

        {users.map((u) => (
          <div
            key={u.id}
            className="grid grid-cols-[1fr,1fr,1fr,1fr,1fr] text-xs bg-[#FAFAFA] text-gray-800 h-10 items-center px-6"
          >
            <div>{u.name}</div>
            <div>{u.email}</div>
            <div>{u.phone}</div>

            <div>
              <button
                onClick={() => onToggleStatus(u, u.status === "inactive")}
                className={`inline-flex items-center px-3 py-1 rounded-full border text-[11px] cursor-pointer hover:opacity-80 ${
                  u.status === "active"
                    ? "border-green-500 text-green-600"
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
            <div className="flex justify-end gap-2 pr-4">
              <button
                className="px-3 py-1 rounded-md bg-yellow-400 text-[11px] font-medium text-gray-900 hover:bg-yellow-300"
                onClick={() => onEditUser(u)}
              >
                Edit
              </button>
              <button
                className="px-3 py-1 rounded-md bg-red-500 text-[11px] font-medium text-white hover:bg-red-400"
                onClick={() => onResetPassword?.(u)}
              >
                Reset Password
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
