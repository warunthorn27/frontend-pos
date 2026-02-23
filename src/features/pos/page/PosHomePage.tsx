import { useNavigate } from "react-router-dom";
import PosIcon from "../../../assets/svg/inventory.svg?react";

const PosHomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="h-full flex flex-col items-center justify-center text-[#06284B]">
      <PosIcon
        className="w-16 h-16 mb-4 cursor-pointer hover:scale-105 transition"
        onClick={() => navigate("/customer")}
      />
      <h1 className="text-2xl font-semibold">POS HOME</h1>
    </div>
  );
};

export default PosHomePage;
