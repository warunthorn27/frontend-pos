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
  children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({
  tabs,
  activeTab,
  onTabChange,
  onLogout,
  currentUserRole,
  children,
}) => {
  return (
    <div className="min-h-screen bg-white relative">
      <TopBar onLogout={onLogout} />
      <div className="flex">
        <div className="absolute left-0 top-0 z-10">
          <SideBar
            tabs={tabs}
            activeTab={activeTab}
            onTabChange={onTabChange}
            currentUserRole={currentUserRole}
          />
        </div>

        <div className="w-[240px] flex-shrink-0" />
        {/* Spacer for sidebar width */}
        <main className="flex-1 p-10">{children}</main>
      </div>
    </div>
  );
};

export default AppLayout;
