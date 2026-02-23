import { useNavigate } from "react-router-dom";
import HomeIcon from "../../../assets/svg/inventory.svg?react";
import LogoutIcon from "../../../assets/svg/logout.svg?react";

interface PosTopNavProps {
  onLogout: () => void;
}

const menus = ["Home", "Sell", "Custom", "Repair", "Inventory", "Report"];

const PosTopNav: React.FC<PosTopNavProps> = ({ onLogout }) => {
  const navigate = useNavigate();

  return (
    <div className="h-14 border-b grid grid-cols-3 items-center px-6">
      {/* LEFT */}
      <div className="flex items-center">
        <HomeIcon
          className="w-7 h-7 text-gray-700 cursor-pointer"
          onClick={() => navigate("/company")}
        />
      </div>

      {/* CENTER */}
      <div className="flex justify-center gap-8 text-lg">
        {menus.map((menu, i) => (
          <div
            key={menu}
            className={`cursor-pointer pb-1 ${
              i === 0
                ? "text-[#0690F1] border-b-2 border-[#0690F1]"
                : "text-[#06284B]"
            }`}
          >
            {menu}
          </div>
        ))}
      </div>

      {/* RIGHT */}
      <div className="flex justify-end items-center gap-4">
        <button
          onClick={() => {
            onLogout(); // clear auth / logic
            navigate("/login");
          }}
        >
          <LogoutIcon className="w-7 h-7 text-[#06284B]" />
        </button>
      </div>
    </div>
  );
};

export default PosTopNav;
