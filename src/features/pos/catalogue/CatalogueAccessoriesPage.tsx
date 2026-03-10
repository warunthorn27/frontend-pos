import type { CatalogueMode } from "../../../types/pos/catalogue";
import { accessoriesData } from "../../../types/pos/dataCategory/accessoriesData";
import CatalogueCategoryPage from "./CatalogueCategoryPage";

interface Props {
  mode: CatalogueMode;
  setMode: (mode: CatalogueMode) => void;
}

const CatalogueAccessoriesPage: React.FC<Props> = ({ mode, setMode }) => {
  return (
    <CatalogueCategoryPage
      title="Accessories"
      items={accessoriesData}
      mode={mode}
      setMode={setMode}
    />
  );
};

export default CatalogueAccessoriesPage;
