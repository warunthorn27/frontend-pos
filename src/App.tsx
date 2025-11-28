// App.tsx
import React, { useState } from "react";
import LoginPage from "./features/login/LoginPage";
import DashboardLayout from "./layouts/DashboardLayout";
import FirstChangePasswordPage from "./features/login/FirstChangePassword";
import CompanyForm from "./features/company/CompanyForm";
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
          setAuth(data);
        }}
      />
    );
  }

  const { user, token, forceChangePassword } = auth;

  // 2. ถ้าเป็น User และต้องเปลี่ยนรหัสครั้งแรก
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

  // 3. ถ้าเป็น Admin และยังไม่มี companyId >> ส่งไปหน้า create company
  if (user.role === "Admin" && !user.companyId) {
    return (
      <CompanyForm
        mode="create"
        initialValues={null} // ตอนแรกยังไม่มีข้อมูลบริษัท
        onCancel={handleLogout} // ถ้ากด Cancel ก็กลับไป login (หรือเปลี่ยนเป็นอย่างอื่นได้)
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        onSubmit={(values) => {
          // TODO: ตรงนี้อนาคตค่อยเรียก API สร้าง Company จริง ๆ
          // const newCompanyId = await createCompanyApi(values, token);

          const newCompanyId = "TEMP_ID"; // สมมติ id ที่ backend ส่งกลับมา

          // อัปเดต state auth ให้ user มี companyId แล้ว
          setAuth((prev) =>
            prev
              ? {
                  ...prev,
                  user: { ...prev.user, companyId: newCompanyId },
                }
              : prev
          );
        }}
      />
    );
  }

  // 4. เคสปกติ: login แล้ว ผ่านทุกเงื่อนไข >> เข้า dashboard
  return <DashboardLayout onLogout={handleLogout} currentUser={user} />;
};

export default App;
