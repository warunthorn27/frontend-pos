import React from "react";

interface SideNavProps {
  tabs: { id: string; label: string }[];
  activeTab: string;
  onTabChange: (id: string) => void;
}

const SideNav: React.FC<SideNavProps> = ({ tabs, activeTab, onTabChange }) => (
  <aside className="w-48 bg-sky-50/70 pt-24">
    <nav className="flex flex-col">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`w-full text-left px-6 py-3 text-xs ${
            activeTab === tab.id
              ? "bg-[#E5F3FF] text-[#0088FF] font-semibold"
              : "text-gray-900 hover:bg-gray-200"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </nav>
  </aside>
);

export default SideNav;
