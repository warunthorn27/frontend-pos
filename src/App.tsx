import { Routes, Route, Navigate, useOutletContext } from "react-router-dom";

import LoginPage from "./features/login/LoginPage";
import FirstChangePasswordPage from "./features/login/FirstChangePassword";

import DashboardLayout from "./layouts/DashboardLayout";
import type { DashboardOutletContext } from "./layouts/DashboardLayout";
import type { AuthUser } from "./types/auth";

import RequireAuth from "./routes/RequireAuth";
import RequireRole from "./routes/RequireRole";

import CompanyProfilePage from "./features/company/CompanyProfilePage";
import UserManagementPage from "./features/users/UserManagemenPaget";

import ProductMasterPage from "./features/products/ProductMasterPage";
import StoneDiamondPage from "./features/products/StoneDiamondPage";
import SemiMountPage from "./features/products/SemiMountPage";
import OthersPage from "./features/products/OthersPage";
import ProductListPage from "./features/products/ProductListPage";
import CustomerListPage from "./features/customers/CustomerListPage";

import {
  getToken,
  getCurrentUser,
  getForceChangePassword,
  saveAuth,
  clearAuthStorage,
  setCompanyId,
  setForceChangePassword,
} from "./utils/authStorage";

// wrapper อ่านจาก Outlet context แล้วส่งให้ CompanyProfilePage
function CompanyPageRoute() {
  const { mustCreateCompany, onCompanyCreated } =
    useOutletContext<DashboardOutletContext>();

  return (
    <CompanyProfilePage
      isFirstTime={mustCreateCompany}
      onCompanyCreated={(companyId: string) => onCompanyCreated?.(companyId)}
    />
  );
}

// index redirect: Admin -> company-profile, User -> product/product-master
function DashboardIndexRedirect({ user }: { user: AuthUser }) {
  if (user.role === "Admin") {
    return <Navigate to="company-profile" replace />;
  }
  return <Navigate to="product/product-master" replace />;
}

export default function App() {
  const token = getToken();
  const currentUser = getCurrentUser();
  const forceChangePassword = getForceChangePassword();

  return (
    <Routes>
      {/* Public */}
      <Route
        path="/login"
        element={
          <LoginPage
            onLoginSuccess={(data) => {
              saveAuth(data);
              window.location.href = "/dashboard";
            }}
          />
        }
      />

      {/* First change password */}
      <Route
        path="/first-change-password"
        element={
          token && currentUser ? (
            <FirstChangePasswordPage
              token={token}
              userId={currentUser.id}
              onSuccess={() => {
                setForceChangePassword(false);
                window.location.href = "/dashboard";
              }}
            />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

      {/* Protected Area */}
      <Route element={<RequireAuth token={token} />}>
        <Route
          path="/dashboard"
          element={
            currentUser ? (
              currentUser.role === "User" && forceChangePassword ? (
                <Navigate to="/first-change-password" replace />
              ) : (
                <DashboardLayout
                  onLogout={() => {
                    clearAuthStorage();
                    window.location.href = "/login";
                  }}
                  currentUser={currentUser}
                  onCompanyCreated={(companyId) => {
                    setCompanyId(companyId);
                  }}
                />
              )
            ) : (
              <Navigate to="/login" replace />
            )
          }
        >
          {/* default แยกตาม role */}
          <Route
            index
            element={
              currentUser ? (
                <DashboardIndexRedirect user={currentUser} />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />

          {/* Admin only */}
          <Route
            path="company-profile"
            element={
              <RequireRole user={currentUser}>
                <CompanyPageRoute />
              </RequireRole>
            }
          />

          <Route
            path="user-management"
            element={
              <RequireRole user={currentUser}>
                <UserManagementPage />
              </RequireRole>
            }
          />

          {/* PRODUCT ROUTES */}
          <Route path="product">
            <Route path="product-master" element={<ProductMasterPage />} />
            <Route path="stone-diamond" element={<StoneDiamondPage />} />
            <Route path="semi-mount" element={<SemiMountPage />} />
            <Route path="others" element={<OthersPage />} />
            <Route path="product-list" element={<ProductListPage />} />
          </Route>

          {/* Customer */}
          <Route path="customer" element={<CustomerListPage />} />
        </Route>
      </Route>

      {/* fallback */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
