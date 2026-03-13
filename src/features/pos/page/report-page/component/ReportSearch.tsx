import SearchIcon from "../../../../../assets/svg/search.svg?react";

interface Props {
  searchQuery: string;
  setSearchQuery: (v: string) => void;
}

const ReportSearch = ({ searchQuery, setSearchQuery }: Props) => {
  return (
    <div className="flex items-center border border-[#CFCFCF] bg-white rounded-md px-3 h-[40px] w-[300px] focus:outline-none ">
      <input
        type="text"
        placeholder="ID / Customer / Key info"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="flex-1 bg-transparent text-sm font-light outline-none"
      />

      <SearchIcon className="w-5 h-5 text-gray-400" />
    </div>
  );
};

export default ReportSearch;
