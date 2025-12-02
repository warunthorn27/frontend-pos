import React, { useState } from "react";
import LoginPage from "./features/login/LoginPage";
import DashboardLayout from "./layouts/DashboardLayout";
import FirstChangePasswordPage from "./features/login/FirstChangePassword";
import type { LoginResponse } from "./types/auth";

type AuthState = (LoginResponse & {}) | null;

const App: React.FC = () => {
  const [auth, setAuth] = useState<AuthState>(null);

  const handleLogout = () => {
    setAuth(null);
  };

  // 1. ยังไม่ login
  if (!auth) {
    return (
      <LoginPage
        onLoginSuccess={(data) => {
          localStorage.setItem("token", data.token);
          localStorage.setItem("comp_id", data.user.companyId || "");
          setAuth(data);
        }}
      />
    );
  }

  const { user, token, forceChangePassword } = auth;

  // 2. ถ้าเป็น User frist time login ต้องเปลี่ยน password
  if (user.role === "User" && forceChangePassword) {
    return (
      <FirstChangePasswordPage
        token={token}
        userId={user.id}
        onSuccess={() => {
          handleLogout();
        }}
      />
    );
  }

  // 3. login แล้ว ผ่านทุกเงื่อนไข >> เข้า dashboard
  return (
    <DashboardLayout
      onLogout={handleLogout}
      currentUser={user}
      onCompanyCreated={(companyId) => {
        // อัปเดต state auth ให้ user มี companyId แล้ว
        setAuth((prev) =>
          prev
            ? {
                ...prev,
                user: { ...prev.user, companyId },
              }
            : prev
        );

        // Also update localStorage
        localStorage.setItem("comp_id", companyId);
      }}
    />
  );
};

export default App;
