import React, { useState } from "react";
import AppLayout from "./AppLayout";
import CompanyProfilePage from "../user-page/company-profile/CompanyProfilePage";
import UserManagementPage from "../user-page/user-management/UserManagement";

interface UserLayoutProps {
  onLogout: () => void;
}

const tabs = [
  { id: "company", label: "Company Profile" },
  { id: "user", label: "User" },
];

const UserLayout: React.FC<UserLayoutProps> = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState<string>("company");

  const title = activeTab === "company" ? "Company Profile" : "User Management";

  return (
    <AppLayout
      title={title}
      tabs={tabs}
      activeTab={activeTab}
      onTabChange={setActiveTab}
      onLogout={onLogout}
    >
      {activeTab === "company" ? (
        <CompanyProfilePage />
      ) : (
        <UserManagementPage />
      )}
    </AppLayout>
  );
};

export default UserLayout;
