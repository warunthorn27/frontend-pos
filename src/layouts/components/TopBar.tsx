import React from "react";
import LogoutIcon from "../../assets/svg/logout.svg?react";

interface TopBarProps {
  onLogout: () => void;
}

const TopBar: React.FC<TopBarProps> = ({ onLogout }) => (
  <header className="w-full h-[60px] bg-[#004E92] flex items-center justify-between px-8 text-sm">
    <span className="font-medium text-gray-900"></span>
    <button
      onClick={onLogout}
      className="text-xs text-gray-900 hover:underline"
    >
      <LogoutIcon className="w-7 h-7 text-white" />
    </button>
  </header>
);

export default TopBar;
