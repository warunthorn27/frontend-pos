import PosTopNav from "../../components/PosTopNav";

const PosRepairPage = () => {
  return (
    <div className="flex flex-col h-full bg-[#F8F8F8]">
      <PosTopNav onLogout={() => console.log("logout")} />

      <div className="flex flex-1 p-8">
        {/* WHITE CONTAINER */}
        <div className="flex-1 bg-white border rounded-lg flex items-center justify-center">
          <div className="text-[28px] tracking-widest text-gray-400 animate-pulse">
            COMING SOON....
          </div>
        </div>
      </div>
    </div>
  );
};

export default PosRepairPage;
