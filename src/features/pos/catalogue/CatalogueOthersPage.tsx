import type { CatalogueMode } from "../../../types/pos/catalogue";
import { othersData } from "../../../types/pos/dataCategory/othersData";
import CatalogueCategoryPage from "./CatalogueCategoryPage";

interface Props {
  mode: CatalogueMode;
  setMode: (mode: CatalogueMode) => void;
}

const CatalogueOthersPage: React.FC<Props> = ({ mode, setMode }) => {
  return (
    <CatalogueCategoryPage
      title="Others"
      items={othersData}
      mode={mode}
      setMode={setMode}
    />
  );
};

export default CatalogueOthersPage;
