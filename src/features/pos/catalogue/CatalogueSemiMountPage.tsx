import type { CatalogueMode } from "../../../types/pos/catalogue";
import { semiMountProducts } from "../../../types/pos/dataCategory/semiMountData";
import PosBreadcrumb from "../components/PosBreadcrumb";
import PosToolbar from "../components/PosToolbar";
import ProductGrid from "./ProductGrid";

interface Props {
  mode: CatalogueMode;
  setMode: (mode: CatalogueMode) => void;
  categoryLabel: string;
  onBack: () => void;
}

const CatalogueSemiMountPage: React.FC<Props> = ({
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

      <ProductGrid title="" items={semiMountProducts} mode={mode} />
    </>
  );
};

export default CatalogueSemiMountPage;
