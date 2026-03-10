import type {
  CatalogueMode,
  CatalogueProductItem,
} from "../../../types/pos/catalogue";
import ProductCard from "./ProductCard";

interface Props {
  title: string;
  items: CatalogueProductItem[];
  mode: CatalogueMode;
}

const ProductGrid: React.FC<Props> = ({ title, items, mode }) => {
  // filter product ที่มี stock เท่านั้น
  const visibleItems =
    mode === "inventory"
      ? items.filter((item) => item.inStock !== false)
      : items;

  return (
    <div className="px-10 py-6">
      <div className="text-xl text-[#06284B]">{title}</div>

      <div className="grid grid-cols-5 gap-7">
        {visibleItems.map((item) => (
          <ProductCard key={item.id} item={item} mode={mode} />
        ))}
      </div>
    </div>
  );
};

export default ProductGrid;
