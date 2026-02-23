const subMenus = [
  "Product Master",
  "Stone/Diamond",
  "Semi-Mount",
  "Accessories",
  "Others",
];

const PosSubNav = () => {
  return (
    <div className="h-12 flex items-end px-6 text-base gap-6">
      {subMenus.map((menu, i) => (
        <div
          key={menu}
          className={`cursor-pointer pb-2 ${
            i === 0
              ? "text-[#06284B] hover:text-[#06284B] border-b-2 border-[#06284B] font-normal"
              : "text-[#838383] font-light"
          }`}
        >
          {menu}
        </div>
      ))}
    </div>
  );
};

export default PosSubNav;
