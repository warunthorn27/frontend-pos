type Props = {
  children: React.ReactNode;
};

export default function ProductFormLayout({ children }: Props) {
  return (
    <div className="w-full h-full flex flex-col min-h-0">
      <div className="w-full max-w-[1690px] mx-auto flex flex-col min-h-0">
        {children}
      </div>
    </div>
  );
}
