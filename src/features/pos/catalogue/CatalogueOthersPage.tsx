import type { CatalogueMode } from "../../../types/pos/catalogue";
import CatalogueCategoryPage from "./CatalogueCategoryPage";

interface Props {
  title: string;
  categoryId: string;
  mode: CatalogueMode;
  setMode: (mode: CatalogueMode) => void;
}

const CatalogueOthersPage: React.FC<Props> = ({
  title,
  categoryId,
  mode,
  setMode,
}) => {
  return (
    <CatalogueCategoryPage
      title={title}
      categoryId={categoryId}
      mode={mode}
      setMode={setMode}
    />
  );
};

export default CatalogueOthersPage;
