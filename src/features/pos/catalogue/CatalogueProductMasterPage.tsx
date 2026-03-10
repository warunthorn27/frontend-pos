import PosToolbar from "../components/PosToolbar";
import PosBreadcrumb from "../components/PosBreadcrumb";
import ProductGrid from "./ProductGrid";
import type { CatalogueMode } from "../../../types/pos/catalogue";
import { productMasterProducts } from "../../../types/pos/dataCategory/productMasterData";

interface Props {
  mode: CatalogueMode;
  setMode: (mode: CatalogueMode) => void;
  categoryLabel: string;
  onBack: () => void;
}

const CatalogueProductMasterPage: React.FC<Props> = ({
  mode,
  setMode,
  categoryLabel,
  onBack,
}) => {
  return (
    <>
      <div className="px-10">
        <PosToolbar
          breadcrumb={
            <PosBreadcrumb
              items={[
                {
                  label: "Item Type",
                  onClick: onBack,
                },
                {
                  label: categoryLabel,
                },
              ]}
            />
          }
          mode={mode}
          setMode={setMode}
        />
      </div>

      <ProductGrid title="" items={productMasterProducts} mode={mode} />
    </>
  );
};

export default CatalogueProductMasterPage;
