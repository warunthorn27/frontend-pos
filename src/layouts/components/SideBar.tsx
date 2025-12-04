import React, { useState } from "react";
import type { TabItem } from "../DashboardLayout";
import logoUrl from "../../assets/svg/logo.svg";
import CompanyIcon from "../../assets/icons/company";
import ProductIcon from "../../assets/icons/product";
import UserIcon from "../../assets/icons/user";
import { FaChevronRight } from "react-icons/fa";


interface SideBarProps {
  tabs: TabItem[];
  activeTab: string;
  onTabChange: (id: string) => void;
  currentUserRole: "Admin" | "User";
}

const SideBar: React.FC<SideBarProps> = ({
  tabs,
  activeTab,
  onTabChange,
  currentUserRole,
}) => {
  const initialDropdown = activeTab.startsWith("product:") ? "product" : null;

  const [openDropdown, setOpenDropdown] = useState<string | null>(
    initialDropdown
  );

  const isAdmin = currentUserRole === "Admin";

  const visibleTabs = tabs.filter((tab) => {
    if (!isAdmin && tab.id === "user") return false; // user ปกติไม่เห็นเมนูจัดการ user
    if (!isAdmin && tab.id === "company") return false; // company ให้เฉพาะ admin
    return true;
  });

  const toggleDropdown = (id: string) => {
    setOpenDropdown(openDropdown === id ? null : id);
  };

  const handleTabChange = (id: string) => {
    onTabChange(id);
    if (!id.startsWith("product:")) {
      setOpenDropdown(null);
    }
  };

  return (
    <aside
      className="
        w-[230px] h-[1080px] 
        bg-[#EFF7FF] border-slate-200
        px-3
      "
    >
      <div className="flex justify-center py-8">
        <img src={logoUrl} alt="Logo" width="107" height="61" />
      </div>

      <nav className="space-y-2 text-sm">
        {visibleTabs.map((tab) => {
          const hasChildren = !!tab.children;
          const isOpen = openDropdown === tab.id;

          if (!hasChildren) {
            const isActive = activeTab === tab.id;
            const isDisabled = tab.disabled;
            return (
              <button
                key={tab.id}
                onClick={() => !isDisabled && handleTabChange(tab.id)}
                disabled={isDisabled}
                className={`w-full text-left px-4 py-2 rounded-md font-medium flex items-center gap-2 ${
                  isActive
                    ? "bg-[#E5F3FF] text-[#0088FF] font-medium"
                    : isDisabled
                    ? "text-gray-400 cursor-not-allowed"
                    : "text-black hover:text-[#0088FF]"
                }`}
              >
                {tab.id === "company" && <CompanyIcon />}
                {tab.id === "user" && <UserIcon />}
                {tab.label}
              </button>
            );
          }

          // dropdown
          return (
            <div key={tab.id} className="space-y-1">
              {/* Parent Button */}
              <button
                onClick={() => !tab.disabled && toggleDropdown(tab.id)}
                disabled={tab.disabled}
                className={`
                  w-full flex items-center justify-between
                  px-4 py-2 rounded-md font-medium
                  transition
                  ${
                    isOpen
                      ? "bg-[#E5F3FF] text-[#0088FF] font-medium"
                      : tab.disabled
                      ? "text-gray-400 cursor-not-allowed"
                      : "text-black hover:text-[#0088FF]"
                  }
                `}
              >
                <span className="flex items-center gap-2">
                  {tab.id === "product" && <ProductIcon />}
                  {tab.label}
                </span>

                <FaChevronRight
                  className={`transition-transform ${
                    isOpen ? "rotate-90" : ""
                  }`}
                />
              </button>

              {/* Dropdown items */}
              {isOpen && (
                <div className="py-1">
                  {tab.children!.map((child) => {
                    const active = activeTab === child.id;
                    const isChildDisabled = child.disabled;
                    return (
                      <button
                        key={child.id}
                        onClick={() =>
                          !isChildDisabled && handleTabChange(child.id)
                        }
                        disabled={isChildDisabled}
                        className={`
                          w-full text-left px-4 py-2 rounded-md text-sm
                          transition
                          ${
                            active
                              ? "text-[#0088FF] font-medium"
                              : isChildDisabled
                              ? "text-gray-400 cursor-not-allowed"
                              : "text-[#2DA9FF] hover:text-[#0088FF]"
                          }
                        `}
                      >
                        {child.label}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>
    </aside>
  );
};

export default SideBar;
