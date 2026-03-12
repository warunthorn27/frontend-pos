import React from "react";
import LogoutIcon from "../../assets/svg/logout.svg?react";
import UserIcon from "../../assets/svg/user-profile.svg?react";
import { getCurrentUser } from "../../utils/authStorage";

interface TopBarProps {
  onLogout: () => void;
}

const TopBar: React.FC<TopBarProps> = ({ onLogout }) => {
  const user = getCurrentUser();

  return (
    <header className="w-full h-[60px] bg-[#004E92] flex items-center justify-between px-8 text-sm">
      {/* LEFT SPACE */}
      <span></span>

      {/* RIGHT SECTION */}
      <div className="flex items-center gap-6">
        {/* USER INFO */}
        <div className="flex items-center gap-3 text-white">
          <UserIcon className="w-8 h-8" />

          <div className="flex flex-col leading-tight">
            <span className="font-light">{user?.name}</span>

            {user?.email && (
              <span className="text-sm font-light">{user.email}</span>
            )}
          </div>
        </div>

        {/* LOGOUT */}
        <button onClick={onLogout}>
          <LogoutIcon className="w-7 h-7 text-white" />
        </button>
      </div>
    </header>
  );
};

export default TopBar;
