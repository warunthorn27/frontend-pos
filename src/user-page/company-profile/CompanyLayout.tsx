import React, { useState } from "react";
import UserManagementPage from "../user-management/UserManagement";

interface UserLayoutProps {
  onLogout: () => void;
}

const tabs = [
  { id: "company", label: "Company Profile" },
  { id: "user", label: "User" },
];

const UserLayout: React.FC<UserLayoutProps> = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState<string>("company");

  const renderContent = () => {
    if (activeTab === "user") {
      return <UserManagementPage />;
    }

    return (
      <div className="w-full">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-800">
            Create Company
          </h2>
        </div>
        <hr className="border-gray-200 mb-8" />

        <div className="grid grid-cols-[160px,minmax(0,1fr)] gap-y-10 gap-x-10 text-sm text-gray-800">
          {/* General */}
          <div className="font-semibold flex items-start pt-1">General</div>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block mb-1 text-xs font-medium">
                Company Name <span className="text-red-500">*</span>
              </label>
              <input className="w-full h-9 rounded-md bg-gray-200 px-3 text-xs outline-none" />
            </div>
            <div>
              <label className="block mb-1 text-xs font-medium">
                Tax ID <span className="text-red-500">*</span>
              </label>
              <input className="w-full h-9 rounded-md bg-gray-200 px-3 text-xs outline-none" />
            </div>
            <div>
              <label className="block mb-1 text-xs font-medium">
                Email <span className="text-red-500">*</span>
              </label>
              <input className="w-full h-9 rounded-md bg-gray-200 px-3 text-xs outline-none" />
            </div>
            <div>
              <label className="block mb-1 text-xs font-medium">
                Phone <span className="text-red-500">*</span>
              </label>
              <input className="w-full h-9 rounded-md bg-gray-200 px-3 text-xs outline-none" />
            </div>
          </div>

          {/* Address */}
          <div className="font-semibold flex items-start pt-1">Address</div>
          <div className="space-y-5">
            <div>
              <label className="block mb-1 text-xs font-medium">
                Company Address <span className="text-red-500">*</span>
              </label>
              <input
                className="w-full h-9 rounded-md bg-gray-200 px-3 text-xs outline-none"
                // ไม่ใส่ placeholder ให้เป็นช่องว่างเปล่า
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block mb-1 text-xs font-medium">
                  Country <span className="text-red-500">*</span>
                </label>
                <select
                  className="w-full h-9 rounded-md bg-gray-200 px-3 text-xs outline-none"
                  defaultValue=""
                >
                  <option value=""></option>
                </select>
              </div>
              <div>
                <label className="block mb-1 text-xs font-medium">
                  Province <span className="text-red-500">*</span>
                </label>
                <select
                  className="w-full h-9 rounded-md bg-gray-200 px-3 text-xs outline-none"
                  defaultValue=""
                >
                  <option value=""></option>
                </select>
              </div>
              <div>
                <label className="block mb-1 text-xs font-medium">
                  District <span className="text-red-500">*</span>
                </label>
                <select
                  className="w-full h-9 rounded-md bg-gray-200 px-3 text-xs outline-none"
                  defaultValue=""
                >
                  <option value=""></option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block mb-1 text-xs font-medium">
                  Sub-district <span className="text-red-500">*</span>
                </label>
                <select
                  className="w-full h-9 rounded-md bg-gray-200 px-3 text-xs outline-none"
                  defaultValue=""
                >
                  <option value=""></option>
                </select>
              </div>
              <div>
                <label className="block mb-1 text-xs font-medium">
                  Zipcode <span className="text-red-500">*</span>
                </label>
                <input
                  className="w-full h-9 rounded-md bg-gray-200 px-3 text-xs outline-none"
                  // ไม่ใส่ placeholder
                />
              </div>
            </div>
          </div>

          {/* Contact Person */}
          <div className="font-semibold flex items-start pt-1">
            Contact Person
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block mb-1 text-xs font-medium">
                Name <span className="text-red-500">*</span>
              </label>
              <input className="w-full h-9 rounded-md bg-gray-200 px-3 text-xs outline-none" />
            </div>
            <div>
              <label className="block mb-1 text-xs font-medium">
                Phone <span className="text-red-500">*</span>
              </label>
              <input className="w-full h-9 rounded-md bg-gray-200 px-3 text-xs outline-none" />
            </div>
            <div className="col-span-2">
              <label className="block mb-1 text-xs font-medium">
                Email <span className="text-red-500">*</span>
              </label>
              <input className="w-full h-9 rounded-md bg-gray-200 px-3 text-xs outline-none" />
            </div>
          </div>
        </div>

        {/* cancel/confirm */}
        <div className="mt-12 flex justify-center gap-4">
          <button className="px-8 py-2 rounded-full bg-gray-200 text-xs font-medium text-gray-700">
            Cancel
          </button>
          <button className="px-8 py-2 rounded-full bg-gray-800 text-xs font-medium text-white">
            Confirm
          </button>
        </div>
      </div>
    );
  };

  const title = activeTab === "company" ? "Create Company" : "User Management";

  return (
    <div className="min-h-screen bg-[#d0d0d0]">
      {/* Top gray bar */}
      <header className="h-14 bg-[#b3b3b3] flex items-center justify-between px-8 text-sm">
        <span className="font-medium text-gray-900">{title}</span>
        <button
          onClick={onLogout}
          className="text-xs text-gray-900 hover:underline"
        >
          Logout
        </button>
      </header>

      <div className="flex">
        {/* Left side tab bar */}
        <aside className="w-48 bg-[#c4c4c4] pt-24">
          <nav className="flex flex-col">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full text-left px-6 py-3 text-xs ${
                  activeTab === tab.id
                    ? "bg-white text-gray-900 font-semibold"
                    : "text-gray-700 hover:bg-gray-200"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </aside>

        {/* Main content area */}
        <main className="flex-1 p-12">
          <div className="rounded-3xl bg-white shadow-md px-12 py-10">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default UserLayout;
