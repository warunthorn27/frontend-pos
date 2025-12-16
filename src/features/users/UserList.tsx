import React from "react";
import type { UserListItem } from "../../types/user";
import plusIcon from "../../assets/svg/plus.svg";
import EditIcon from "../../assets/svg/edit.svg?react";
import ResetIcon from "../../assets/svg/reset.svg?react";

// เพิ่ม helper แปลง +66xxxxxxxxx -> 0xxxxxxxxx
function digitsOnly(s: string) {
  return (s || "").replace(/\D/g, "");
}

function formatThaiPhoneForDisplay(phone?: string) {
  const d = digitsOnly(phone ?? "");
  if (!d) return "-";

  // ถ้าเป็น 66xxxxxxxxx -> 0xxxxxxxxx
  if (d.startsWith("66")) return "0" + d.slice(2);

  // ถ้าเป็น local อยู่แล้ว (0xxxxxxxxx) หรือเลขอื่น ๆ
  return d;
}

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
  maxUsers = 3,
}) => {
  const activeUsers = users.filter((u) => u.status === "active").length;
  const canCreateUser = activeUsers < maxUsers;

  return (
    <div className=" bg-gray mx-6">
      <div className="flex items-center justify-between mb-[33px]">
        <div className="flex items-center gap-[20px]">
          <h2 className="text-2xl font-regular text-[#06284B]">
            User &amp; Permission
          </h2>
          <span className="px-2 py-2 rounded-[5px] bg-[#FFCC00] text-sm text-white font-regular">
            {activeUsers}/{maxUsers}
          </span>
        </div>

        <span className="text-sm"></span>
        <button
          onClick={onCreateUser}
          disabled={!canCreateUser}
          className={`flex items-center w-[123px] h-[44px] gap-[6px] px-[10px] py-[10px] rounded-md text-base font-regular text-white ${
            canCreateUser
              ? "bg-[#0088FF] hover:bg-[#0574D6]"
              : "bg-gray-400 cursor-not-allowed"
          }`}
        >
          <img src={plusIcon} alt="" className="w-[24px]" />
          Add User
        </button>
      </div>

      {/* ตาราง */}
      <div className="border shadow-sm rounded-md overflow-hidden">
        <div className="grid grid-cols-[1fr,1fr,1fr,1fr,1fr] text-lg font-regular border-b bg-[#F7F7F7] text-black items-center px-6 py-3">
          <div>Name</div>
          <div>Email</div>
          <div>Phone</div>
          <div>Status</div>
          <div>Action</div>
        </div>

        {users.map((u) => (
          <div
            key={u.id}
            className="grid grid-cols-[1fr,1fr,1fr,1fr,1fr] text-base bg-white text-black items-center border-b px-6 py-3"
          >
            <div>{u.name}</div>
            <div className="px-1.5">{u.email?.trim() ? u.email : "-"}</div>

            <div className="px-3">{formatThaiPhoneForDisplay(u.phone)}</div>

            <div>
              <div
                className={`inline-flex items-center px-3 py-1 rounded-full border text-sm select-none ${
                  u.status === "active"
                    ? "border-green-500 text-black"
                    : "border-gray-400 text-gray-500"
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full mr-1 text-sm ${
                    u.status === "active" ? "bg-green-500" : "bg-gray-400"
                  }`}
                />
                {u.status === "active" ? "Active" : "Inactive"}
              </div>
            </div>

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
