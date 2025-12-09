import React, { useState } from "react";
import AppLayout from "./AppLayout";
import CompanyProfilePage from "../features/company/CompanyProfilePage";
import UserManagementPage from "../features/users/UserManagemenPaget";
import FinishedGoodsPage from "../features/products/ProductMasterPage";
import StoneDiamondPage from "../features/products/StoneDiamondPage";
import SemiMountPage from "../features/products/SemiMountPage";
import OthersPage from "../features/products/OthersPage";
import ProductListPage from "../features/products/ProductListPage";
import type { AuthUser } from "../types/auth";

export interface TabItem {
  id: string;
  label: string;
  children?: { id: string; label: string; disabled?: boolean }[];
  disabled?: boolean;
}

interface DashboardLayoutProps {
  onLogout: () => void;
  currentUser: AuthUser;
  onCompanyCreated?: (companyId: string) => void;
}

const baseTabs: TabItem[] = [
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

const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  onLogout,
  currentUser,
  onCompanyCreated,
}) => {
  // มี company อยู่แล้วหรือยัง (ดูจาก user ตอน login รอบแรก)
  const [hasCompany, setHasCompany] = useState<boolean>(
    !!currentUser.companyId
  );

  // admin ที่ยังไม่มี company ต้องถูกบังคับให้สร้างก่อน
  const mustCreateCompany = currentUser.role === "Admin" && !hasCompany;

  // สร้าง tabs ตามสถานะ
  const tabs = baseTabs.map((tab) => ({
    ...tab,
    disabled: mustCreateCompany && tab.id !== "company",
    children: tab.children?.map((child) => ({
      ...child,
      disabled: mustCreateCompany && child.id !== "company",
    })),
  }));

  // tab เริ่มต้น
  const [activeTab, setActiveTab] = useState<string>(() =>
    mustCreateCompany
      ? "company"
      : currentUser.role === "Admin"
      ? "company"
      : "product:finished"
  );

  const title = mustCreateCompany
    ? "Create Company"
    : activeTab === "company"
    ? "Company Profile"
    : activeTab === "user"
    ? "User Management"
    : "Product";

  const handleTabChange = (nextId: string) => {
    setActiveTab(nextId);
  };

  // callback ตอนสร้าง company เสร็จจาก CompanyProfilePage
  const handleCompanyCreated = (companyId: string) => {
    setHasCompany(true); // ปลดล็อก tab อื่น
    // เก็บลง localStorage ถ้าอยากใช้ต่อใน session อื่น
    localStorage.setItem("companyId", companyId);

    if (onCompanyCreated) {
      onCompanyCreated(companyId);
    }
  };

  return (
    <AppLayout
      title={title}
      tabs={tabs}
      activeTab={activeTab}
      onTabChange={handleTabChange}
      onLogout={onLogout}
      currentUserRole={currentUser.role}
    >
      {activeTab === "company" && (
        <CompanyProfilePage
          isFirstTime={mustCreateCompany}
          onCompanyCreated={handleCompanyCreated}
        />
      )}

      {activeTab === "user" && <UserManagementPage currentUser={currentUser} />}

      {activeTab === "product:list" && <ProductListPage />}
      {activeTab === "product:finished" && <FinishedGoodsPage />}
      {activeTab === "product:stone" && <StoneDiamondPage />}
      {activeTab === "product:semi" && <SemiMountPage />}
      {activeTab === "product:others" && <OthersPage />}
    </AppLayout>
  );
};

export default DashboardLayout;
