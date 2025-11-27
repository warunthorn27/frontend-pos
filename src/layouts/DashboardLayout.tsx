import React, { useState } from "react";
import AppLayout from "./AppLayout";
import CompanyProfilePage from "../features/company/CompanyProfilePage";
import UserManagementPage from "../features/users/UserManagement";
import FinishedGoodsPage from "../features/products/ProductMaster";
import StoneDiamondPage from "../features/products/StoneDiamondPage";
import SemiMountPage from "../features/products/SemiMountPage";
import OthersPage from "../features/products/OthersPage";
import ProductListPage from "../features/products/ProductListPage";
import type { AuthUser } from "../types/auth";

export interface TabItem {
  id: string;
  label: string;
  children?: { id: string; label: string }[];
}

interface DashboardLayoutProps {
  onLogout: () => void;
  currentUser: AuthUser;
}

const tabs: TabItem[] = [
  { id: "company", label: "Company Profile" },
  { id: "user", label: "User" },
  {
    id: "product",
    label: "Product",
    children: [
      { id: "product:finished", label: "Product Master" },
      { id: "product:stone", label: "Stone / Diamond" },
      { id: "product:semi", label: "Semi-Mount" },
      { id: "product:others", label: "Others" },
      { id: "product:list", label: "Product List" },
    ],
  },
];

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ onLogout, currentUser }) => {
  const [activeTab, setActiveTab] = useState<string>("company");

  const title =
    activeTab === "company"
      ? "Company Profile"
      : activeTab === "user"
      ? "User Management"
      : "Product";

  return (
    <AppLayout
      title={title}
      tabs={tabs}
      activeTab={activeTab}
      onTabChange={setActiveTab}
      onLogout={onLogout}
      currentUserRole={currentUser.role}
    >
      {activeTab === "company" && <CompanyProfilePage />}
      {activeTab === "user" && <UserManagementPage />}

      {activeTab === "product:list" && <ProductListPage />}
      {activeTab === "product:finished" && <FinishedGoodsPage />}
      {activeTab === "product:stone" && <StoneDiamondPage />}
      {activeTab === "product:semi" && <SemiMountPage />}
      {activeTab === "product:others" && <OthersPage />}
    </AppLayout>
  );
};

export default DashboardLayout;
