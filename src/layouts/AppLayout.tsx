import React from "react";
import TopBar from "./components/TopBar";
import type { TabItem } from "./DashboardLayout";
import SideBar from "./components/SideBar";

interface AppLayoutProps {
  title: string;
  tabs: TabItem[];
  activeTab: string;
  onTabChange: (id: string) => void;
  onLogout: () => void;
  currentUserRole: "Admin" | "User";
  companyLogo?: string;
  children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({
  tabs,
  activeTab,
  onTabChange,
  onLogout,
  currentUserRole,
  companyLogo,
  children,
}) => {
  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {/* Topbar */}
      <TopBar onLogout={onLogout} />

      {/* Body */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <SideBar
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={onTabChange}
          currentUserRole={currentUserRole}
          lockApp={false}
          allowedTabId=""
          companyLogo={companyLogo}
        />

        {/* Content */}
        <main className="flex-1 overflow-hidden p-10 bg-white">{children}</main>
      </div>
    </div>
  );
};

export default AppLayout;
