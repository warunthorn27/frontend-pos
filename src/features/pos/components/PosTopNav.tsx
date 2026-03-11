import { useNavigate, useLocation } from "react-router-dom";
import HomeIcon from "../../../assets/svg/home.svg?react";
import LogoutIcon from "../../../assets/svg/logout.svg?react";

interface PosTopNavProps {
  onLogout: () => void;
}

const menus = [
  { name: "Home", path: "/pos" },
  { name: "Sell", path: "/pos/sell" },
  { name: "Custom", path: "/pos/custom" },
  { name: "Repair", path: "/pos/repair" },
  { name: "Inventory", path: "/pos/inventory" },
  { name: "Report", path: "/pos/report" },
];

const PosTopNav: React.FC<PosTopNavProps> = ({ onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="h-14 border-b grid grid-cols-3 items-center px-10">
      {/* LEFT */}
      <div className="flex items-center">
        <HomeIcon
          className="w-7 h-7 text-gray-700 cursor-pointer"
          onClick={() => navigate("/company")}
        />
      </div>

      {/* CENTER */}
      <div className="flex justify-center gap-8 text-lg">
        {menus.map((menu) => {
          const active = location.pathname === menu.path;

          return (
            <div
              key={menu.name}
              onClick={() => navigate(menu.path)}
              className={`cursor-pointer pb-1 font-normal ${
                active
                  ? "text-[#0690F1] border-b-2 border-[#0690F1]"
                  : "text-[#06284B]"
              }`}
            >
              {menu.name}
            </div>
          );
        })}
      </div>

      {/* RIGHT */}
      <div className="flex justify-end items-center gap-4">
        <button
          onClick={() => {
            onLogout();
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
