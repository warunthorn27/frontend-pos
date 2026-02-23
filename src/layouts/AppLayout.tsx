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
    <div className="h-screen grid grid-rows-[auto_1fr] overflow-hidden">
      {/* Topbar */}
      <TopBar onLogout={onLogout} />

      {/* Body */}
      {/* <div className="grid grid-cols-[auto_1fr] overflow-hidden"> */}
      <div className="flex overflow-hidden">
        <SideBar
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={onTabChange}
          currentUserRole={currentUserRole}
          lockApp={false}
          allowedTabId=""
          companyLogo={companyLogo}
        />

        {/* CONTENT AREA = พื้นที่ที่เหลือของจอ */}
        {/* <main className="overflow-hidden bg-white p-8"> */}
        <main className="flex-1 ml-[240px] overflow-auto bg-white p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
