import React, { useState } from "react";
import type { TabItem } from "../DashboardLayout";
import { FaChevronRight } from "react-icons/fa";
import logoUrl from "../../images/logo.svg";

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

  return (
    <aside
      className="
        w-56 min-w-[14rem] h-[850px] flex-shrink-0
        bg-[#EFF7FF] border-r border-slate-200
        px-4
      "
    >
      <div className="flex justify-center py-10">
        <img src={logoUrl} alt="Logo" width="127" height="73" />
      </div>

      <nav className="space-y-2 text-sm">
        {visibleTabs.map((tab) => {
          const hasChildren = !!tab.children;
          const isOpen = openDropdown === tab.id;

          // ---------------------------
          // ========== NO CHILD ==========
          // ---------------------------
          if (!hasChildren) {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`w-full text-left px-4 py-2 rounded-md font-semibold flex items-center gap-2 ${
                  isActive
                    ? "bg-[#E5F3FF] text-[#0088FF] font-semibold"
                    : "text-black hover:bg-[#E5F3FF] hover:text-[#0088FF]"
                }`}
              >
                {tab.id === "company" && (
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M18.75 0H5.25C4.65326 0 4.08095 0.237063 3.659 0.659019C3.23704 1.08098 3 1.65326 3 2.25V24H21V2.25C21 1.65326 20.763 1.08098 20.341 0.659019C19.919 0.237063 19.3467 0 18.75 0ZM10.5 22.5V18H13.5V22.5H10.5ZM19.5 22.5H15V17.25C15 17.0511 14.921 16.8603 14.7803 16.7197C14.6397 16.579 14.4489 16.5 14.25 16.5H9.75C9.55109 16.5 9.36033 16.579 9.21968 16.7197C9.07903 16.8603 9 17.0511 9 17.25V22.5H4.5V2.25C4.5 2.05109 4.57903 1.86033 4.71968 1.71968C4.86033 1.57903 5.05109 1.5 5.25 1.5H18.75C18.9489 1.5 19.1397 1.57903 19.2803 1.71968C19.421 1.86033 19.5 2.05109 19.5 2.25V22.5ZM7.5 4.5H10.5V7.5H7.5V4.5ZM13.5 4.5H16.5V7.5H13.5V4.5ZM7.5 10.5H10.5V13.5H7.5V10.5ZM13.5 10.5H16.5V13.5H13.5V10.5Z"
                      fill="currentColor"
                    />
                  </svg>
                )}
                {tab.id === "user" && (
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M12 12C13.6569 12 15 10.6569 15 9C15 7.34315 13.6569 6 12 6C10.3431 6 9 7.34315 9 9C9 10.6569 10.3431 12 12 12Z"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    />
                    <path
                      d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    />
                    <path
                      d="M17.9696 20C17.8105 17.1085 16.9252 15 12.0004 15C7.0757 15 6.1904 17.1085 6.03125 20"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  </svg>
                )}
                {tab.id === "product" && (
                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 22 22"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M20.75 5.75L10.75 0.75L0.75 5.75V15.75L10.75 20.75L20.75 15.75V5.75Z"
                      stroke="currentColor"
                      strokeWidth={1.5}
                      strokeLinejoin="round"
                    />
                    <path
                      d="M0.75 5.75L10.75 10.75"
                      stroke="currentColor"
                      strokeWidth={1.5}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M10.75 20.75V10.75"
                      stroke="currentColor"
                      strokeWidth={1.5}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M20.75 5.75L10.75 10.75"
                      stroke="currentColor"
                      strokeWidth={1.5}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M15.75 3.25L5.75 8.25"
                      stroke="currentColor"
                      strokeWidth={1.5}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
                {tab.label}
              </button>
            );
          }

          // ---------------------------
          // ========== WITH CHILD (dropdown) ==========
          // ---------------------------
          return (
            <div key={tab.id} className="space-y-1">
              {/* Parent Button */}
              <button
                onClick={() => toggleDropdown(tab.id)}
                className={`
                  w-full flex items-center justify-between
                  px-4 py-2 rounded-md font-semibold
                  transition
                  ${
                    isOpen
                      ? "bg-[#E5F3FF] text-[#0088FF] font-semibold"
                      : "text-black hover:bg-[#E5F3FF] hover:text-[#0088FF]"
                  }
                `}
              >
                <span className="flex items-center gap-2">
                  {tab.id === "product" && (
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M22 7L12 2L2 7V17L12 22L22 17V7Z"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M2 7L12 12"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M12 22V12"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M22 7L12 12"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M17 4.5L7 9.5"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
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
                    return (
                      <button
                        key={child.id}
                        onClick={() => onTabChange(child.id)}
                        className={`
                          w-full text-left px-4 py-2 rounded-md text-sm
                          transition
                          ${
                            active
                              ? "text-[#0088FF] font-semibold"
                              : "text-[#2DA9FF] hover:bg-[#E5F3FF] hover:text-[#0088FF]"
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
