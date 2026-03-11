import type { CatalogueTab } from "../../../types/pos/navigation";

interface Props {
  activeTab: CatalogueTab;
  onChange: (tab: CatalogueTab) => void;
}

const subMenus: { key: CatalogueTab; label: string }[] = [
  { key: "product-master", label: "Product Master" },
  { key: "stone-diamond", label: "Stone/Diamond" },
  { key: "semi-mount", label: "Semi-Mount" },
  { key: "accessories", label: "Accessories" },
  { key: "others", label: "Others" },
];

const PosSubNav: React.FC<Props> = ({ activeTab, onChange }) => {
  return (
    <div className="h-12 flex items-end px-10 text-base gap-6">
      {subMenus.map((menu) => {
        const isActive = activeTab === menu.key;

        return (
          <div
            key={menu.key}
            onClick={() => onChange(menu.key)}
            className={`cursor-pointer pb-2 ${
              isActive
                ? "text-[#06284B] border-b-2 border-[#06284B] font-normal"
                : "text-[#838383] font-light"
            }`}
          >
            {menu.label}
          </div>
        );
      })}
    </div>
  );
};

export default PosSubNav;
