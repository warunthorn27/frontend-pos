import React from "react";
import { Outlet } from "react-router-dom";
import { CustomSessionProvider } from "../features/pos/context/CustomSessionContext";

const PosLayout: React.FC = () => {
  return (
    <CustomSessionProvider>
      <div className="h-screen w-screen bg-white">
        {/* POS ไม่มี sidebar หลังบ้าน */}
        <Outlet />
      </div>
    </CustomSessionProvider>
  );
};

export default PosLayout;
