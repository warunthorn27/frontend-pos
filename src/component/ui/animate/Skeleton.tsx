interface Props {
  className?: string;
}

const Skeleton: React.FC<Props> = ({ className }) => {
  return (
    <div
      className={`
        relative overflow-hidden rounded-md bg-[#e7e4e4]

        before:absolute
        before:inset-0
        before:-translate-x-full
        before:animate-shimmer

        before:bg-gradient-to-r
        before:from-transparent
        before:via-white/70
        before:to-transparent

        ${className}
      `}
    />
  );
};

export default Skeleton;
