import React from "react";
import { Outlet } from "react-router-dom";

const PosLayout: React.FC = () => {
  return (
    <div className="h-screen w-screen bg-white">
      {/* POS ไม่มี sidebar หลังบ้าน */}
      <Outlet />
    </div>
  );
};

export default PosLayout;
