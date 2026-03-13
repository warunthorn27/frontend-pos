import DateRangePicker from "../../../../../component/ui/DateRangePicker";
import PrintIcon from "../../../../../assets/svg/print.svg?react";
import ExportIcon from "../../../../../assets/svg/file-x.svg?react";
import ExpandAllButton from "./ExpandAllButton";
import ReportSearch from "./ReportSearch";

type TabMode = "Sell" | "Custom" | "Repair";

interface Props {
  activeTab: TabMode;
  totalCount: number;
  searchQuery: string;
  setSearchQuery: (v: string) => void;

  startDate: string;
  endDate: string;

  setStartDate: (v: string) => void;
  setEndDate: (v: string) => void;

  isExpandedAll: boolean;
  setIsExpandedAll: (v: boolean) => void;

  handleExportExcel: () => void;
}

const ReportHeader = ({
  activeTab,
  totalCount,
  searchQuery,
  setSearchQuery,
  startDate,
  endDate,
  setStartDate,
  setEndDate,
  isExpandedAll,
  setIsExpandedAll,
  handleExportExcel,
}: Props) => {
  return (
    <div className="flex justify-between items-start mb-8">
      <h2 className="text-xl font-normal text-[#06284B]">
        {activeTab} Report
        {totalCount > 0 && (
          <span className="text-sm text-gray-400 ml-2 font-light">
            ({totalCount} records)
          </span>
        )}
      </h2>

      <div className="flex items-center gap-3">
        <ExpandAllButton
          isExpandedAll={isExpandedAll}
          setIsExpandedAll={setIsExpandedAll}
        />

        <div className="w-[300px]">
          <DateRangePicker
            startDate={startDate}
            endDate={endDate}
            onChange={(s: string, e: string) => {
              setStartDate(s);
              setEndDate(e);
            }}
          />
        </div>

        <ReportSearch
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />

        <div className="flex items-center gap-3 ml-3">
          <PrintIcon className="w-7 h-7" />

          <ExportIcon
            onClick={handleExportExcel}
            className="w-7 h-7 cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
};

export default ReportHeader;
