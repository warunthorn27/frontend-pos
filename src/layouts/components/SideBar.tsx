import React, { useMemo, useState } from "react";
import type { TabItem } from "../DashboardLayout";
import logoUrl from "../../assets/svg/logo.svg";
import CompanyIcon from "../../assets/svg/company.svg?react";
import UserIcon from "../../assets/svg/user.svg?react";
import ProductIcon from "../../assets/svg/product.svg?react";
import DropdownArrowIcon from "../../assets/svg/dropdown-arrow.svg?react";
import CustomerIcon from "../../assets/svg/customer-report.svg?react";

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
  const isAdmin = currentUserRole === "Admin";

  const initialDropdown = useMemo<string | null>(() => {
    if (currentUserRole !== "User") return null;
    return activeTab.startsWith("product:") ? "product" : null;
  }, [currentUserRole, activeTab]);

  const [openDropdown, setOpenDropdown] = useState<string | null>(
    initialDropdown
  );

  const visibleTabs = useMemo(() => {
    return tabs.filter((tab) => {
      if (!isAdmin && tab.id === "user") return false;
      if (!isAdmin && tab.id === "company") return false;
      return true;
    });
  }, [tabs, isAdmin]);

  const toggleDropdown = (id: string) => {
    if (!visibleTabs.some((tab) => tab.id === id)) return;
    setOpenDropdown((prev) => (prev === id ? null : id));
  };

  const handleTabChange = (id: string) => {
    onTabChange(id);

    if (currentUserRole === "User" && id.startsWith("product:")) {
      setOpenDropdown("product");
    } else if (!id.startsWith("product:")) {
      setOpenDropdown(null);
    }
  };

  return (
    <aside
      className="
        w-[240px] h-[1080px]
        bg-[#EFF7FF] border-slate-200
        px-3
      "
    >
      <div className="flex justify-center py-8">
        <img src={logoUrl} alt="Logo" width="107" height="61" />
      </div>

      <nav className="space-y-1 text-sm">
        {visibleTabs.map((tab) => {
          const hasChildren = !!tab.children?.length;
          const isOpen = openDropdown === tab.id;

          if (!hasChildren) {
            const isActive = activeTab === tab.id;
            const isDisabled = tab.disabled;

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => !isDisabled && handleTabChange(tab.id)}
                disabled={isDisabled}
                className={`w-full text-left px-4 py-2 rounded-md font-regular flex items-center gap-2 ${
                  isActive
                    ? "bg-[#E5F3FF] text-[#0088FF]"
                    : isDisabled
                    ? "text-gray-400 cursor-not-allowed"
                    : "text-black hover:text-[#0088FF]"
                }`}
              >
                {tab.id === "company" && <CompanyIcon />}
                {tab.id === "user" && <UserIcon />}
                {tab.id === "customer" && <CustomerIcon />}
                {tab.label}
              </button>
            );
          }

          // dropdown
          return (
            <div key={tab.id} className="space-y-1">
              {/* Parent Button */}
              <button
                type="button"
                onClick={() => !tab.disabled && toggleDropdown(tab.id)}
                disabled={tab.disabled}
                className={`
                  w-full flex items-center justify-between
                  px-4 py-2 rounded-md font-regular
                  transition
                  ${
                    isOpen
                      ? "bg-[#E5F3FF] text-[#0088FF]"
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

                <DropdownArrowIcon
                  className={`transition-transform ${
                    isOpen ? "rotate-90" : ""
                  }`}
                />
              </button>

              {/* Dropdown items */}
              {isOpen && (
                <div>
                  {tab.children!.map((child) => {
                    const active = activeTab === child.id;
                    const isChildDisabled = child.disabled;

                    return (
                      <button
                        key={child.id}
                        type="button"
                        onClick={() =>
                          !isChildDisabled && handleTabChange(child.id)
                        }
                        disabled={isChildDisabled}
                        className={`
                          w-full text-left pl-12 py-2 rounded-md text-sm
                          transition font-regular
                          ${
                            active
                              ? "text-[#0088FF]"
                              : isChildDisabled
                              ? "text-gray-400 cursor-not-allowed"
                              : "text-[#76C5FF] hover:text-[#0088FF]"
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
