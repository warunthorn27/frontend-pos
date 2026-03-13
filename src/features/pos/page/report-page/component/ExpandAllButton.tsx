import ExpandedIcon from "../../../../../assets/svg/expand.svg?react";

interface Props {
  isExpandedAll: boolean;
  setIsExpandedAll: (v: boolean) => void;
}

const ExpandAllButton = ({ isExpandedAll, setIsExpandedAll }: Props) => {
  return (
    <button
      onClick={() => setIsExpandedAll(!isExpandedAll)}
      className={`flex items-center gap-2 px-4 h-10 rounded-md border text-base font-normal transition-all ${
        isExpandedAll
          ? "bg-[#005AA7] hover:bg-[#084072] text-white"
          : "bg-white border-[#CFCFCF] hover:bg-[#F1F1F1] text-black"
      }`}
    >
      <div className="flex flex-col items-center justify-center -space-y-1">
        <ExpandedIcon
          className={`w-5 h-5 ${
            isExpandedAll ? "text-white" : "text-gray-600"
          }`}
        />
      </div>
      Expanded
    </button>
  );
};

export default ExpandAllButton;
