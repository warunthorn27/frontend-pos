import React, { useState } from "react";
import LoginPage from "./login-page/LoginPage";
import UserLayout from "./user-page/company-profile/CompanyLayout";

const App: React.FC = () => {
  const [isLogin, setIsLogin] = useState(false);

  if (!isLogin) {
    return <LoginPage onLoginSuccess={() => setIsLogin(true)} />;
  }
  return <UserLayout onLogout={() => setIsLogin(false)} />;
};

export default App;
