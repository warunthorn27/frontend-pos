import { useEffect, useState } from "react";
import PosTopNav from "../../components/PosTopNav";
import PosSubNav from "../../components/PosSubNav";
import ItemTypeGrid from "../../components/ItemTypeGrid";
import type {
  CatalogueCategoryItem,
  CatalogueMode,
} from "../../../../types/pos/catalogue";
import { getItemTypes } from "../../../../services/pos/posCatalogue";
import type { CatalogueTab } from "../../../../types/pos/navigation";
import {
  mapItemType,
  mapTabToCategoryKey,
} from "../../../../component/mappers/posCatalogueMapper";
import CatalogueCategoryPage from "../../catalogue/CatalogueCategoryPage";
import CatalogueAccessoriesPage from "../../catalogue/CatalogueAccessoriesPage";
import CatalogueOthersPage from "../../catalogue/CatalogueOthersPage";
import type { ProductCategory } from "../../../../types/product/form";

const TAB_TO_PRODUCT_CATEGORY: Record<CatalogueTab, ProductCategory> = {
  "product-master": "productmaster",
  "stone-diamond": "stone",
  "semi-mount": "semimount",
  accessories: "accessory",
  others: "others",
};

const PosHomePage = () => {
  const [activeTab, setActiveTab] = useState<CatalogueTab>("product-master");
  const [mode, setMode] = useState<CatalogueMode>("master");

  const [selectedCategory, setSelectedCategory] =
    useState<CatalogueCategoryItem | null>(null);

  const [itemTypes, setItemTypes] = useState<CatalogueCategoryItem[]>([]);

  const [loading, setLoading] = useState(false);

  /* ===================================================
     LOAD ITEM TYPES
  =================================================== */

  useEffect(() => {
    const load = async () => {
      setLoading(true);

      const start = Date.now();

      try {
        const categoryId = mapTabToCategoryKey(activeTab);
        const res = await getItemTypes(categoryId);

        setItemTypes(res.map(mapItemType));
      } catch (err) {
        console.error(err);
      } finally {
        const elapsed = Date.now() - start;

        const MIN_LOADING_TIME = 400;

        if (elapsed < MIN_LOADING_TIME) {
          await new Promise((resolve) =>
            setTimeout(resolve, MIN_LOADING_TIME - elapsed),
          );
        }

        setLoading(false);
      }
    };

    load();
  }, [activeTab]);

  return (
    <div className="flex flex-col h-full bg-white">
      <PosTopNav onLogout={() => console.log("logout")} />

      <PosSubNav
        activeTab={activeTab}
        onChange={(tab) => {
          setActiveTab(tab);
          setSelectedCategory(null);
        }}
      />

      <div className="flex-1 overflow-auto bg-[#FBFBFB] hide-scrollbar">
        {/* ACCESSORIES */}

        {activeTab === "accessories" && (
          <CatalogueAccessoriesPage
            title="Accessories"
            categoryId={mapTabToCategoryKey(activeTab)}
            mode={mode}
            setMode={setMode}
          />
        )}

        {/* OTHERS */}

        {activeTab === "others" && (
          <CatalogueOthersPage
            title="Others"
            categoryId={mapTabToCategoryKey(activeTab)}
            mode={mode}
            setMode={setMode}
          />
        )}

        {/* LEVEL 1 ITEM TYPE */}

        {!selectedCategory &&
          activeTab !== "accessories" &&
          activeTab !== "others" && (
            <ItemTypeGrid
              title="Item Type"
              items={itemTypes}
              loading={loading}
              onSelect={setSelectedCategory}
            />
          )}

        {/* PRODUCT MASTER */}

        {selectedCategory && activeTab === "product-master" && (
          <CatalogueCategoryPage
            title={selectedCategory.label}
            category={TAB_TO_PRODUCT_CATEGORY[activeTab]}
            categoryId={mapTabToCategoryKey(activeTab)}
            itemTypeId={selectedCategory.id}
            mode={mode}
            setMode={setMode}
            onBack={() => setSelectedCategory(null)}
          />
        )}

        {/* STONE / DIAMOND */}

        {selectedCategory && activeTab === "stone-diamond" && (
          <CatalogueCategoryPage
            title={selectedCategory.label}
            category={TAB_TO_PRODUCT_CATEGORY[activeTab]}
            categoryId={mapTabToCategoryKey(activeTab)}
            itemTypeId={selectedCategory.id}
            mode={mode}
            setMode={setMode}
            onBack={() => setSelectedCategory(null)}
          />
        )}

        {/* SEMI MOUNT */}

        {selectedCategory && activeTab === "semi-mount" && (
          <CatalogueCategoryPage
            title={selectedCategory.label}
            category={TAB_TO_PRODUCT_CATEGORY[activeTab]}
            categoryId={mapTabToCategoryKey(activeTab)}
            itemTypeId={selectedCategory.id}
            mode={mode}
            setMode={setMode}
            onBack={() => setSelectedCategory(null)}
          />
        )}
      </div>
    </div>
  );
};

export default PosHomePage;
