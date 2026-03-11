import ItemTypeCard from "./ItemTypeCard";
import type { CatalogueCategoryItem } from "../../../types/pos/catalogue";
import Skeleton from "../../../component/ui/animate/Skeleton";

interface Props {
  title: string;
  items: CatalogueCategoryItem[];
  loading?: boolean;
  onSelect: (item: CatalogueCategoryItem) => void;
}

const ItemTypeGrid: React.FC<Props> = ({ title, items, loading, onSelect }) => {
  if (loading) {
    return (
      <div className="px-10">
        <div className="py-8">
          <div className="text-xl text-[#06284B]">{title}</div>
        </div>

        <div className="grid grid-cols-5 gap-7 py-6">
          {Array.from({ length: 10 }).map((_, i) => (
            <Skeleton key={i} className="aspect-square" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="px-10">
      <div className="py-8">
        <div className="text-xl text-[#06284B]">{title}</div>
      </div>

      <div className="py-6">
        <div className="grid grid-cols-5 gap-7">
          {items.map((item) => (
            <ItemTypeCard
              key={item.id}
              label={item.label}
              image={item.image ?? null}
              onClick={() => onSelect(item)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ItemTypeGrid;
