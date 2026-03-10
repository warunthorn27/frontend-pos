import { useState } from "react";
import PosTopNav from "../../components/PosTopNav";
import PosSubNav from "../../components/PosSubNav";
import ItemTypeGrid from "../../components/ItemTypeGrid";
import { productMasterData } from "../../../../types/pos/dataCategory/productMasterData";
import { stoneDiamondData } from "../../../../types/pos/dataCategory/stoneDiamondData";
import { semiMountData } from "../../../../types/pos/dataCategory/semiMountData";
import type {
  CatalogueCategoryItem,
  CatalogueMode,
} from "../../../../types/pos/catalogue";
import AccessoriesPage from "../../catalogue/CatalogueAccessoriesPage";
import OthersPage from "../../catalogue/CatalogueOthersPage";
import CatalogueProductMasterPage from "../../catalogue/CatalogueProductMasterPage";
import CatalogueStoneDiamondPage from "../../catalogue/CatalogueStoneDiamondPage";
import CatalogueSemiMountPage from "../../catalogue/CatalogueSemiMountPage";

const PosHomePage = () => {
  const [activeTab, setActiveTab] = useState("product-master");
  const [mode, setMode] = useState<CatalogueMode>("master");
  const [selectedCategory, setSelectedCategory] =
    useState<CatalogueCategoryItem | null>(null);

  const resolveData = (): { title: string; items: CatalogueCategoryItem[] } => {
    switch (activeTab) {
      case "product-master":
        return { title: "Item Type", items: productMasterData };

      case "stone-diamond":
        return { title: "Stone", items: stoneDiamondData };

      case "semi-mount":
        return { title: "Item Type", items: semiMountData };

      case "accessories":
      case "others":
        return { title: "", items: [] };

      default:
        return { title: "", items: [] };
    }
  };

  const { title, items } = resolveData();

  return (
    <div className="flex flex-col h-full bg-white">
      <PosTopNav onLogout={() => console.log("logout")} />
      {/* <PosSubNav activeTab={activeTab} onChange={setActiveTab} /> */}
      <PosSubNav
        activeTab={activeTab}
        onChange={(tab) => {
          setActiveTab(tab);
          setSelectedCategory(null); // reset ตรงนี้แทน
        }}
      />

      <div className="flex-1 overflow-auto bg-[#FBFBFB]">
        {/* ACCESSORIES */}
        {activeTab === "accessories" && (
          <AccessoriesPage mode={mode} setMode={setMode} />
        )}

        {/* OTHERS */}
        {activeTab === "others" && <OthersPage mode={mode} setMode={setMode} />}

        {/* LEVEL 1 */}
        {!selectedCategory &&
          activeTab !== "accessories" &&
          activeTab !== "others" && (
            <ItemTypeGrid
              title={title}
              items={items}
              onSelect={setSelectedCategory}
            />
          )}

        {selectedCategory && activeTab === "product-master" && (
          <CatalogueProductMasterPage
            mode={mode}
            setMode={setMode}
            categoryLabel={selectedCategory.label}
            onBack={() => setSelectedCategory(null)}
          />
        )}

        {selectedCategory && activeTab === "stone-diamond" && (
          <CatalogueStoneDiamondPage
            mode={mode}
            setMode={setMode}
            categoryLabel={selectedCategory.label}
            onBack={() => setSelectedCategory(null)}
          />
        )}

        {selectedCategory && activeTab === "semi-mount" && (
          <CatalogueSemiMountPage
            mode={mode}
            setMode={setMode}
            categoryLabel={selectedCategory.label}
            onBack={() => setSelectedCategory(null)}
          />
        )}
      </div>
    </div>
  );
};

export default PosHomePage;
