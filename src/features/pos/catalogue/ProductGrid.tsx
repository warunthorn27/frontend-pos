import type {
  CatalogueMode,
  CatalogueProductItem,
} from "../../../types/pos/catalogue";
import ProductCard from "./ProductCard";

interface Props {
  title: string;
  items: CatalogueProductItem[];
  mode: CatalogueMode;
  loading?: boolean;
  onSelect?: (id: string) => void;
  onCustom?: (item: CatalogueProductItem) => void;
}

const ProductGrid: React.FC<Props> = ({
  title,
  items,
  mode,
  loading,
  onSelect,
  onCustom,
}) => {
  const visibleItems =
    mode === "inventory" ? items.filter((item) => item.inStock) : items;

  if (loading) {
    return <div className="p-10 text-center">Loading...</div>;
  }

  if (visibleItems.length === 0) {
    return (
      <div className="px-10 py-10 text-gray-400 font-light flex justify-center">
        No products found
      </div>
    );
  }

  return (
    <div className="px-10 py-6">
      {title && <div className="text-xl text-[#06284B]">{title}</div>}

      <div className="grid grid-cols-5 gap-7">
        {visibleItems.map((item) => (
          <ProductCard
            key={item.id}
            item={item}
            mode={mode}
            onClick={onSelect}
            onCustom={onCustom}
          />
        ))}
      </div>
    </div>
  );
};

export default ProductGrid;
