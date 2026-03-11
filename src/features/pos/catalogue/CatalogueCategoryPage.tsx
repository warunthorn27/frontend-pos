import type {
  CatalogueMode,
  CatalogueProductItem,
} from "../../../types/pos/catalogue";
import ProductGrid from "./ProductGrid";
import PosToolbar from "../components/PosToolbar";
import { useEffect, useState } from "react";
import { getProducts } from "../../../services/pos/posCatalogue";
import { mapProduct } from "../../../component/mappers/posCatalogueMapper";
import PosBreadcrumb from "../components/PosBreadcrumb";
import type { ProductCategory } from "../../../types/product/form";
import { PRODUCT_CATEGORY_LABEL } from "../../../types/product/transform";

interface Props {
  title: string;
  category?: ProductCategory; // optional
  categoryId: string;
  itemTypeId?: string;
  mode: CatalogueMode;
  setMode: (mode: CatalogueMode) => void;
  onBack?: () => void;
}

const CatalogueCategoryPage: React.FC<Props> = ({
  title,
  category,
  categoryId,
  itemTypeId,
  mode,
  setMode,
  onBack,
}) => {
  const [products, setProducts] = useState<CatalogueProductItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);

      const res = await getProducts({
        category: categoryId,
        item_type_id: itemTypeId,
        view_mode: mode,
      });

      setProducts(res.data.map(mapProduct));

      setLoading(false);
    };

    load();
  }, [mode, categoryId, itemTypeId]);

  return (
    <div className="flex-1 bg-[#FBFBFB]">
      <div className="px-10">
        <PosToolbar
          breadcrumb={
            <PosBreadcrumb
              items={
                category
                  ? [
                      {
                        label: PRODUCT_CATEGORY_LABEL[category],
                        onClick: onBack,
                      },
                      {
                        label: title,
                      },
                    ]
                  : [
                      {
                        label: title,
                      },
                    ]
              }
            />
          }
          mode={mode}
          setMode={setMode}
        />
      </div>

      <ProductGrid
        title=""
        items={products}
        mode={mode}
        loading={loading}
        onSelect={(id) => {
          console.log("open product detail", id);
        }}
      />
    </div>
  );
};

export default CatalogueCategoryPage;
