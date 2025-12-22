import React, { useEffect, useMemo, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import AppLayout from "./AppLayout";
import type { AuthUser } from "../types/auth";
import {
  setCompanyId as persistCompanyId,
} from "../utils/authStorage";

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
  "product:accessories": "/dashboard/product/accessories",
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

function getUserCompanyId(u: AuthUser): string | null {
  const raw =
    (u as unknown as { companyId?: string }).companyId ??
    (u as unknown as { comp_id?: string }).comp_id ??
    (u as unknown as { compId?: string }).compId ??
    null;

  return raw ?? null;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  onLogout,
  currentUser,
  onCompanyCreated,
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  // ตัด getCompanyId ออกตอน init
  const [companyIdLocal, setCompanyIdLocal] = useState<string | null>(() => {
    return getUserCompanyId(currentUser);
  });

  useEffect(() => {
    setCompanyIdLocal(getUserCompanyId(currentUser));
  }, [currentUser]);

  const mustCreateCompany = useMemo(() => {
    return currentUser.role === "Admin" && !companyIdLocal;
  }, [currentUser.role, companyIdLocal]);

  const activeTab = useMemo(
    () => getTabIdFromPath(location.pathname),
    [location.pathname]
  );
  const title = useMemo(() => getTitleFromTab(activeTab), [activeTab]);

  const tabs: TabItem[] = useMemo(() => {
    const lock = mustCreateCompany;

    const productChildren = [
      { id: "product:finished", label: "Product Master", disabled: lock },
      { id: "product:stone", label: "Stone/Diamond", disabled: lock },
      { id: "product:semi", label: "Semi-mount", disabled: lock },
      { id: "product:accessories", label: "Accessories", disabled: lock },
      { id: "product:others", label: "Others", disabled: lock },
      { id: "product:list", label: "Product List", disabled: lock },
    ];

    return [
      { id: "company", label: "Company Profile", disabled: false },
      { id: "user", label: "User Management", disabled: lock },
      {
        id: "product",
        label: "Product",
        disabled: lock,
        children: productChildren,
      },
      { id: "customer", label: "Customer", disabled: lock },
    ];
  }, [mustCreateCompany]);

  // ✅ ถ้าต้อง create company → บังคับอยู่หน้า company เท่านั้น
  useEffect(() => {
    if (!mustCreateCompany) return;
    const companyPath = TAB_TO_PATH.company;
    if (location.pathname !== companyPath) {
      navigate(companyPath, { replace: true });
    }
  }, [mustCreateCompany, location.pathname, navigate]);

  const handleTabChange = (tabId: string) => {
    // block ถ้ายังต้อง create company
    if (mustCreateCompany && tabId !== "company") return;

    const path = TAB_TO_PATH[tabId];
    if (path) navigate(path);
  };

  const handleCompanyCreated = (companyId: string) => {
    // ✅ ปลดล็อกทันที
    setCompanyIdLocal(companyId);
    // ✅ persist กัน refresh หลุด
    persistCompanyId(companyId);
    // ✅ ส่งกลับไปให้ parent sync ต่อ (ถ้ามี)
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
