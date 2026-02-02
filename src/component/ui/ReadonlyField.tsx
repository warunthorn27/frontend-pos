import React from "react";

type Props = {
  value?: string | number;
  height?: number; // เผื่อ textarea
  multiline?: boolean;
};

const ReadonlyField: React.FC<Props> = ({
  value,
  height = 38,
  multiline = false,
}) => {
  return (
    <div
      className={`
        w-full
        rounded-md
        border border-[#CFCFCF]
        bg-[#F9FAFB]
        px-3
        text-sm text-black
        ${multiline ? "py-2" : "flex items-center"}
      `}
      style={{
        height: multiline ? undefined : height,
        minHeight: multiline ? height : undefined,
      }}
    >
      {value !== undefined && String(value).trim() !== "" ? value : "-"}
    </div>
  );
};

export default ReadonlyField;
