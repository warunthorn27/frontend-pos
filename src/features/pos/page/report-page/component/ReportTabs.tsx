type TabMode = "Sell" | "Custom" | "Repair";

interface Props {
  activeTab: TabMode;
  setActiveTab: (tab: TabMode) => void;
}

const ReportTabs = ({ activeTab, setActiveTab }: Props) => {
  return (
    <div className="h-12 flex items-end px-10 text-base gap-10 border-b bg-white relative z-40 flex-shrink-0">
      {(["Sell", "Custom", "Repair"] as TabMode[]).map((tab) => {
        const active = activeTab === tab;

        return (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`cursor-pointer pb-2 transition-all ${
              active
                ? "text-[#06284B] border-b-2 border-[#06284B] font-normal"
                : "text-[#838383] font-light hover:text-[#06284B]"
            }`}
          >
            {tab}
          </button>
        );
      })}
    </div>
  );
};

export default ReportTabs;
