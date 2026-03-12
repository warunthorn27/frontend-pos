import type {
  CatalogueMode,
  CatalogueProductItem,
  PosProductDetail,
} from "../../../types/pos/catalogue";
import ProductGrid from "./ProductGrid";
import PosToolbar from "../components/PosToolbar";
import { useEffect, useState } from "react";
import { getProducts, getProductDetail } from "../../../services/pos/posCatalogue";
import { mapProduct } from "../../../component/mappers/posCatalogueMapper";
import PosBreadcrumb from "../components/PosBreadcrumb";
import type { ProductCategory } from "../../../types/product/form";
import { PRODUCT_CATEGORY_LABEL } from "../../../types/product/transform";
import { useCustomSession } from "../context/CustomSessionContext";
import ProductDetailModal from "./ProductDetailModal";

interface Props {
  title: string;
  category?: ProductCategory;
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
  const { addItem, addSellItem } = useCustomSession();

  /* Detail modal */
  const [selectedDetail, setSelectedDetail] = useState<PosProductDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);

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

  /* Open detail modal */
  const handleOpenDetail = async (id: string) => {
    setDetailLoading(true);
    try {
      const detail = await getProductDetail(id);
      setSelectedDetail(detail);
    } catch (err) {
      console.error("Failed to load product detail", err);
    } finally {
      setDetailLoading(false);
    }
  };

  const handleCustom = async (item: CatalogueProductItem) => {
    await addItem(item.id, {
      name: item.name,
      code: item.code,
      imageUrl: item.imageUrl,
      metal: item.metal,
      metalColor: item.metalColor,
    });
  };

  const handleSell = async (item: CatalogueProductItem) => {
    await addSellItem(item.id, item.price || 0, {
      name: item.name,
      code: item.code,
      imageUrl: item.imageUrl,
    });
  };

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

      {/* Loading overlay for detail fetch */}
      {detailLoading && (
        <div style={{
          position: "fixed", inset: 0,
          background: "rgba(0,0,0,0.15)",
          zIndex: 999,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <div style={{ background: "#fff", borderRadius: "8px", padding: "20px 32px", fontSize: "13px", color: "#6b7280" }}>
            Loading…
          </div>
        </div>
      )}

      <ProductGrid
        title=""
        items={products}
        mode={mode}
        loading={loading}
        onSelect={handleOpenDetail}
        onCustom={handleCustom}
        onSell={handleSell}
      />

      {/* Detail modal */}
      {selectedDetail && (
        <ProductDetailModal
          detail={selectedDetail}
          onClose={() => setSelectedDetail(null)}
        />
      )}
    </div>
  );
};

export default CatalogueCategoryPage;
