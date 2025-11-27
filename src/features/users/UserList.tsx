import React from "react";
import type { UserRow } from "../../types/user";

interface UserListProps {
  users: UserRow[];
  onCreateUser: () => void;
  // เผื่อทีหลังอยากกด Edit / Reset
  onEditUser?: (user: UserRow) => void;
  onResetPassword?: (user: UserRow) => void;
}

const UserList: React.FC<UserListProps> = ({
  users,
  onCreateUser,
  onEditUser,
  onResetPassword,
}) => {
  const total = 3; // mock: quota 3 user
  const used = users.length;

  return (
    <div className="w-full bg-gray">
      {/* หัวข้อ + badge 1/3 + ปุ่ม Create User */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <h2 className="text-2xl font-semibold text-[#0053A4]">
            User &amp; Permission
          </h2>
          <span className="px-2 py-1 rounded-md bg-[#FF8D28] text-[12px] text-white font-semibold">
            {used}/{total}
          </span>
        </div>

        <span className="text-sm"></span>
        <button
          onClick={onCreateUser}
          className="px-6 py-2 rounded-md bg-[#0088FF] text-xs font-normal text-white hover:bg-blue-500"
        >
          Create User
        </button>
      </div>

      {/* ตาราง */}
      <div className="border shadow-sm rounded-md overflow-hidden text-xs">
        {/* header bar สีเทา */}
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

            {/* status pill */}
            <div>
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full border text-[11px] ${
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
              </span>
            </div>

            {/* ปุ่ม Edit + Reset Password */}
            <div className="flex justify-end gap-2 pr-4">
              <button
                className="px-3 py-1 rounded-md bg-yellow-400 text-[11px] font-medium text-gray-900 hover:bg-yellow-300"
                onClick={() => onEditUser?.(u)}
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
