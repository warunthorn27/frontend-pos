export const useDragScroll = () => {
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = e.currentTarget;

    const startX = e.pageX - el.offsetLeft;
    const scrollLeft = el.scrollLeft;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const x = moveEvent.pageX - el.offsetLeft;
      const walk = (x - startX) * 1.5;

      el.scrollLeft = scrollLeft - walk;
    };

    const handleMouseUp = () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  };

  return { handleMouseDown };
};
