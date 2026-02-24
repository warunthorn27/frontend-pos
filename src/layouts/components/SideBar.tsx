import React, { useEffect, useMemo, useState } from "react";
import type { TabItem } from "../DashboardLayout";
import CompanyIcon from "../../assets/svg/company.svg?react";
import UserIcon from "../../assets/svg/user.svg?react";
import ProductIcon from "../../assets/svg/product.svg?react";
import DropdownArrowIcon from "../../assets/svg/dropdown-arrow.svg?react";
import CustomerIcon from "../../assets/svg/customer-report.svg?react";
import PurchaseIcon from "../../assets/svg/purchase-box.svg?react";
import InventoryIcon from "../../assets/svg/inventory.svg?react";
import PosIcon from "../../assets/svg/pos.svg?react";

interface SideBarProps {
  tabs: TabItem[];
  activeTab: string;
  onTabChange: (id: string) => void;
  currentUserRole: "Admin" | "User";

  lockApp: boolean; // true = disable ทั้งระบบยกเว้น allowedTabId
  allowedTabId: string; // เช่น "company"
  companyLogo?: string;
}

const iconMap: Record<string, React.ReactNode> = {
  company: <CompanyIcon />,
  user: <UserIcon />,
  product: <ProductIcon />,
  customer: <CustomerIcon />,
  purchase: <PurchaseIcon />,
  inventory: <InventoryIcon />,
  pos: <PosIcon />,
};

const SideBar: React.FC<SideBarProps> = ({
  tabs,
  activeTab,
  onTabChange,
  currentUserRole,
  lockApp,
  allowedTabId,
  companyLogo,
}) => {
  const isAdmin = currentUserRole === "Admin";

  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  useEffect(() => {
    if (activeTab.startsWith("product:")) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setOpenDropdown("product");
      return;
    }

    if (activeTab.startsWith("inventory:")) {
      setOpenDropdown("inventory");
      return;
    }

    // ไม่ใช่ child → ปิด dropdown
    setOpenDropdown(null);
  }, [activeTab]);

  const visibleTabs = useMemo(() => {
    return tabs.filter((tab) => {
      if (!isAdmin && tab.id === "user") return false;
      if (!isAdmin && tab.id === "company") return false;
      return true;
    });
  }, [tabs, isAdmin]);

  const isTabLocked = (tabId: string) => lockApp && tabId !== allowedTabId;

  const toggleDropdown = (id: string) => {
    if (!visibleTabs.some((tab) => tab.id === id)) return;
    if (isTabLocked(id)) return;
    setOpenDropdown((prev) => (prev === id ? null : id));
  };

  const handleTabChange = (id: string) => {
    if (isTabLocked(id)) return;

    onTabChange(id);

    // เปิด dropdown ให้ตรงหมวด
    if (id.startsWith("product:")) {
      setOpenDropdown("product");
      return;
    }

    if (id.startsWith("inventory:")) {
      setOpenDropdown("inventory");
      return;
    }

    // tab ที่ไม่ใช่ child → ปิด dropdown
    setOpenDropdown(null);
  };

  return (
    // <aside className="w-[240px] flex-shrink-0 bg-[#EFF7FF] border-slate-200 px-3">
    <aside className="fixed top-0 left-0 w-[240px] h-screen bg-[#EFF7FF] px-3">
      <div className="flex justify-center py-3">
        {companyLogo ? (
          <img
            src={companyLogo}
            alt="Company Logo"
            className="max-w-[107px] max-h-[107px] object-contain"
          />
        ) : (
          <div className="flex flex-col items-center text-gray-400">
            <CompanyIcon className="w-10 h-10 mb-2" />
            <span className="text-xs">No logo</span>
          </div>
        )}
      </div>

      <nav className="space-y-1 text-sm">
        {visibleTabs.map((tab) => {
          const hasChildren = !!tab.children?.length;
          const isOpen = openDropdown === tab.id;

          const locked = isTabLocked(tab.id);
          const tabDisabled = !!tab.disabled || locked;

          if (!hasChildren) {
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => !tabDisabled && handleTabChange(tab.id)}
                disabled={tabDisabled}
                className={`w-full text-left px-4 py-2 rounded-md font-regular flex items-center gap-2 ${
                  isActive
                    ? "bg-[#E5F3FF] text-[#0088FF]"
                    : tabDisabled
                      ? "text-gray-400 cursor-not-allowed opacity-60"
                      : "text-[#06284B] hover:text-[#0088FF]"
                }`}
              >
                {iconMap[tab.id]}
                {tab.label}
              </button>
            );
          }

          // dropdown
          return (
            <div key={tab.id} className="space-y-1">
              <button
                type="button"
                onClick={() => !tabDisabled && toggleDropdown(tab.id)}
                disabled={tabDisabled}
                className={`
                  w-full flex items-center justify-between
                  px-4 py-2 rounded-md font-regular transition
                  ${
                    isOpen
                      ? "bg-[#E5F3FF] text-[#0088FF]"
                      : tabDisabled
                        ? "text-gray-400 cursor-not-allowed opacity-60"
                        : "text-[#06284B] hover:text-[#0088FF]"
                  }
                `}
              >
                <span className="flex items-center gap-2">
                  {iconMap[tab.id]}
                  {tab.label}
                </span>

                <DropdownArrowIcon
                  className={`transition-transform ${
                    isOpen ? "rotate-90" : ""
                  }`}
                />
              </button>

              {isOpen && (
                <div>
                  {tab.children!.map((child) => {
                    const active = activeTab === child.id;
                    const childDisabled = !!child.disabled || locked;

                    return (
                      <button
                        key={child.id}
                        type="button"
                        onClick={() =>
                          !childDisabled && handleTabChange(child.id)
                        }
                        disabled={childDisabled}
                        className={`
                          w-full text-left pl-12 py-2 rounded-md text-sm transition font-regular
                          ${
                            active
                              ? "text-[#0088FF]"
                              : childDisabled
                                ? "text-gray-400 cursor-not-allowed opacity-60"
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
