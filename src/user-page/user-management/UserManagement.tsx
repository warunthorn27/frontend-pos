import React from "react";

const UserManagementPage: React.FC = () => {
  return (
    // ตรงนี้พื้นหลังจะเป็นขาวล้วน
    <div className="w-full bg-white">
      {/* หัวข้อ + ปุ่ม Create User ด้านขวา */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-800">
          User &amp; Permission
        </h2>

        <button className="flex items-center gap-2 px-5 py-2 rounded-full bg-gray-200 text-xs font-medium text-gray-800">
          <span className="text-sm">＋</span>
          <span>Create User</span>
        </button>
      </div>

      {/* ตารางส่วนหัวเทา + ตัวตารางพื้นหลังขาว */}
      <div className="mt-6 border border-transparent rounded-xl overflow-hidden">
        {/* header bar สีเทา */}
        <div className="grid grid-cols-4 text-xs font-medium bg-gray-300 text-gray-800 h-9 items-center px-6">
          <div>Name</div>
          <div>Status</div>
          <div>Permission</div>
          <div>Password</div>
        </div>
      </div>
    </div>
  );
};

export default UserManagementPage;
