type InventoryTab =
  | "all"
  | "product-master"
  | "stone-diamond"
  | "semi-mount"
  | "accessories"
  | "others";

type Props = {
  activeTab: InventoryTab;
  onChange: (tab: InventoryTab) => void;
};

const tabs: { id: InventoryTab; label: string }[] = [
  { id: "all", label: "All" },
  { id: "product-master", label: "Product Master" },
  { id: "stone-diamond", label: "Stone/Diamond" },
  { id: "semi-mount", label: "Semi-Mount" },
  { id: "accessories", label: "Accessories" },
  { id: "others", label: "Others" },
];

export default function InventoryTabs({ activeTab, onChange }: Props) {
  return (
    <div className="h-12 flex items-end px-10 text-base gap-6">
      {tabs.map((tab) => {
        const active = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`cursor-pointer pb-2 ${
              active
                ? "text-[#06284B] border-b-2 border-[#06284B] font-normal"
                : "text-[#838383] font-light"
            }`}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
