import React from "react";
import TopBar from "../components/layout/TopBar";
import SideNav from "../components/layout/SideNav";

interface AppLayoutProps {
  title: string;
  tabs: { id: string; label: string; }[];
  activeTab: string;
  onTabChange: (id: string) => void;
  onLogout: () => void;
  children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({
  tabs,
  activeTab,
  onTabChange,
  onLogout,
  children,
}) => {
  return (
    <div className="min-h-screen bg-[#d0d0d0]">
      <TopBar onLogout={onLogout} />
      <div className="flex">
        <SideNav tabs={tabs} activeTab={activeTab} onTabChange={onTabChange} />
        <main className="flex-1 p-12">
          <div className="rounded-3xl bg-white shadow-md px-12 py-10">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
