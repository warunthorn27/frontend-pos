import React, { useEffect, useMemo } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import AppLayout from "./AppLayout";
import type { AuthUser } from "../types/auth";

export interface TabItem {
  id: string;
  label: string;
  children?: { id: string; label: string; disabled?: boolean }[];
  disabled?: boolean;
}

export interface DashboardLayoutProps {
  onLogout: () => void;
  currentUser: AuthUser;
  onCompanyCreated?: (companyId: string) => void;
}

export type DashboardOutletContext = {
  mustCreateCompany: boolean;
  onCompanyCreated?: (companyId: string) => void;
  currentUser: AuthUser;
};

const TAB_TO_PATH: Record<string, string> = {
  company: "/dashboard/company-profile",
  user: "/dashboard/user-management",

  "product:finished": "/dashboard/product/product-master",
  "product:stone": "/dashboard/product/stone-diamond",
  "product:semi": "/dashboard/product/semi-mount",
  "product:others": "/dashboard/product/others",
  "product:list": "/dashboard/product/product-list",

  customer: "/dashboard/customer",
};

function getTabIdFromPath(pathname: string): string {
  const entries = Object.entries(TAB_TO_PATH);

  const exact = entries.find(([, path]) => path === pathname);
  if (exact) return exact[0];

  const start = entries.find(([, path]) => pathname.startsWith(path));
  if (start) return start[0];

  return "product:finished";
}

function getTitleFromTab(tabId: string): string {
  if (tabId === "company") return "Company Profile";
  if (tabId === "user") return "User Management";
  if (tabId === "customer") return "Customer";
  if (tabId.startsWith("product:")) return "Product";
  return "Dashboard";
}

const baseTabs: TabItem[] = [
  { id: "company", label: "Company Profile" },
  { id: "user", label: "User Management" },
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
  { id: "customer", label: "Customer" },
];

const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  onLogout,
  currentUser,
  onCompanyCreated,
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  const hasCompany =
    Boolean(currentUser.companyId) || Boolean(localStorage.getItem("comp_id"));

  const mustCreateCompany = currentUser.role === "Admin" && !hasCompany;

  const activeTab = useMemo(() => {
    return getTabIdFromPath(location.pathname);
  }, [location.pathname]);

  // admin ยังไม่มี company บังคับไปหน้า company
  useEffect(() => {
    if (!mustCreateCompany) return;

    const companyPath = TAB_TO_PATH.company;
    if (location.pathname !== companyPath) {
      navigate(companyPath, { replace: true });
    }
  }, [mustCreateCompany, location.pathname, navigate]);

  const tabs: TabItem[] = useMemo(() => {
    // User ซ่อน company + user management
    const roleFiltered =
      currentUser.role === "Admin"
        ? baseTabs
        : baseTabs.filter((t) => t.id !== "company" && t.id !== "user");

    // admin ยังไม่มี company disable ทุก tab ยกเว้น company
    return roleFiltered.map((tab) => ({
      ...tab,
      disabled: mustCreateCompany && tab.id !== "company",
      children: tab.children?.map((child) => ({
        ...child,
        disabled: mustCreateCompany && tab.id !== "company",
      })),
    }));
  }, [currentUser.role, mustCreateCompany]);

  const title = mustCreateCompany
    ? "Create Company"
    : getTitleFromTab(activeTab);

  const handleTabChange = (nextId: string) => {
    if (mustCreateCompany && nextId !== "company") return;
    if (nextId === "product") return;

    const nextPath = TAB_TO_PATH[nextId];
    if (!nextPath) return;

    navigate(nextPath);
  };

  const handleCompanyCreated = (companyId: string) => {
    localStorage.setItem("comp_id", companyId);
    onCompanyCreated?.(companyId);
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
      <Outlet
        context={
          {
            mustCreateCompany,
            onCompanyCreated: handleCompanyCreated,
            currentUser,
          } satisfies DashboardOutletContext
        }
      />
    </AppLayout>
  );
};

export default DashboardLayout;
