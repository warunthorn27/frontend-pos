type Props = {
  kind: "necklace" | "diamond" | "ring" | "teddy" | "chain";
};

export default function ProductThumb({ kind }: Props) {
  return (
    <div className="h-[34px] w-[34px] rounded-[4px] bg-[#F1F3F7] border border-[#E2E8F0] grid place-items-center overflow-hidden">
      <ThumbIcon kind={kind} />
    </div>
  );
}

function ThumbIcon({ kind }: Props) {
  // mock mini picture แบบในรูป (simple line icons)
  const common = "stroke-[#9AA3B2] fill-none";
  switch (kind) {
    case "diamond":
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" className={common}>
          <path d="M7 4h10l4 6-9 10L3 10l4-6Z" strokeWidth="1.6" />
          <path d="M7 4l5 16m5-16-5 16" strokeWidth="1.2" />
        </svg>
      );
    case "ring":
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" className={common}>
          <path
            d="M12 4c3 0 5 2 5 5v2a5 5 0 1 1-10 0V9c0-3 2-5 5-5Z"
            strokeWidth="1.6"
          />
          <path d="M8 9h8" strokeWidth="1.2" />
        </svg>
      );
    case "teddy":
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" className={common}>
          <path
            d="M8 9a2 2 0 1 1-4 0 2 2 0 0 1 4 0Zm16 0a2 2 0 1 1-4 0 2 2 0 0 1 4 0Z"
            strokeWidth="1.4"
          />
          <path
            d="M12 8c3 0 5 2 5 5s-2 7-5 7-5-4-5-7 2-5 5-5Z"
            strokeWidth="1.6"
          />
          <path d="M10 13h4" strokeWidth="1.2" />
        </svg>
      );
    case "chain":
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" className={common}>
          <path d="M8 7a4 4 0 0 1 8 0" strokeWidth="1.6" />
          <path d="M6 7c0 7 3 13 6 13s6-6 6-13" strokeWidth="1.2" />
        </svg>
      );
    default: // necklace
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" className={common}>
          <path d="M7 6c0 6 2 12 5 12s5-6 5-12" strokeWidth="1.4" />
          <path d="M12 18v2" strokeWidth="1.6" />
        </svg>
      );
  }
}
