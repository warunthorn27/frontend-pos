import PosTopNav from "../components/PosTopNav";
import PosSubNav from "../components/PosSubNav";
import ItemTypeGrid from "../components/ItemTypeGrid";

const PosHomePage = () => {
  return (
    <div className="flex flex-col h-full bg-white">
      {/* เมนูบนสุด */}
      <PosTopNav onLogout={() => console.log("logout")} />
      {/* เมนูรอง */}
      <PosSubNav />

      {/* Content */}
      <div className="flex-1 overflow-auto">
        <ItemTypeGrid />
      </div>
    </div>
  );
};

export default PosHomePage;
