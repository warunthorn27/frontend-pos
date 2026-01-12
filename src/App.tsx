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
import StoneDiamondPage from "./features/products/stone-diamond/StoneDiamondPage";
import SemiMountPage from "./features/products/semi-mount/SemiMountPage";
import OthersPage from "./features/products/others/OthersPage";
import ProductMasterPage from "./features/products/product-master/ProductMasterPage";
import ProductListPage from "./features/products/product-list/ProductListPage";
import CustomerListPage from "./features/customers/CustomerListPage";
import AccessoriesPage from "./features/products/accessories/AccessoriesPage";

import {
  getToken,
  getCurrentUser,
  getForceChangePassword,
  saveAuth,
  setCompanyId,
  setForceChangePassword,
  clearAuth,
} from "./utils/authStorage";

function CompanyPageRoute() {
  const { currentUser, onCompanyCreated } =
    useOutletContext<DashboardOutletContext>();

  if (!currentUser) {
    return <div className="p-6 text-sm text-gray-500">Loading user...</div>;
  }

  return (
    <CompanyProfilePage
      currentUser={currentUser}
      onCompanyCreated={(id, logoUrl) => onCompanyCreated?.(id, logoUrl)}
    />
  );
}

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
      {/* root */}
      <Route path="/" element={<Navigate to="/login" replace />} />

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

      {/* First Change Password */}
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
      <Route element={<RequireAuth />}>
        <Route
          path="/dashboard"
          element={
            currentUser ? (
              currentUser.role === "User" && forceChangePassword ? (
                <Navigate to="/first-change-password" replace />
              ) : (
                <DashboardLayout
                  currentUser={currentUser}
                  onLogout={() => {
                    clearAuth();
                    window.location.href = "/login";
                  }}
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
          {/* default route */}
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

          {/* Product */}
          <Route path="product">
            <Route path="product-master" element={<ProductMasterPage />} />
            <Route path="stone-diamond" element={<StoneDiamondPage />} />
            <Route path="semi-mount" element={<SemiMountPage />} />
            <Route path="accessories" element={<AccessoriesPage />} />
            <Route path="others" element={<OthersPage />} />
            <Route path="product-list" element={<ProductListPage />} />
          </Route>

          {/* Customer */}
          <Route path="customer" element={<CustomerListPage />} />
        </Route>
      </Route>

      {/* fallback */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
