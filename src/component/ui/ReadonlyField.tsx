import React from "react";

type Props = {
  value?: string | number;
  height?: number; // เผื่อ textarea
};

const ReadonlyField: React.FC<Props> = ({ value, height = 38 }) => {
  return (
    <div
      className="
        w-full
        flex items-center
        rounded-md
        border border-[#CFCFCF]
        bg-[#F9FAFB]
        px-3
        text-sm text-black
      "
      style={{ height }}
    >
      {value !== undefined && String(value).trim() !== "" ? value : "-"}
    </div>
  );
};

export const ReadonlyTextarea = ({ value }: { value?: string }) => (
  <div className="min-h-[120px] rounded-md border bg-[#F9FAFB] px-3 py-2 text-sm">
    {value || "-"}
  </div>
);

export default ReadonlyField;
