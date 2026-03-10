import type {
  CatalogueMode,
  CatalogueProductItem,
} from "../../../types/pos/catalogue";
import ProductGrid from "./ProductGrid";
import PosToolbar from "../components/PosToolbar";

interface Props {
  title: string;
  items: CatalogueProductItem[];
  mode: CatalogueMode;
  setMode: (mode: CatalogueMode) => void;
}

const CatalogueCategoryPage: React.FC<Props> = ({
  title,
  items,
  mode,
  setMode,
}) => {
  return (
    <div className="flex-1 bg-[#FBFBFB]">
      <div className="px-10">
        <PosToolbar title={title} mode={mode} setMode={setMode} />
      </div>

      <ProductGrid title="" items={items} mode={mode} />
    </div>
  );
};

export default CatalogueCategoryPage;
