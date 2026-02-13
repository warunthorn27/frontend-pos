import ProductInfoSection from "../sections/ProductInfoSection";
import PrimaryStoneSection from "../sections/PrimaryStoneSection";
import AccessoriesSection from "../sections/AccessoriesSection";
import type { BaseProductForm } from "../../../types/product/form";
import type {
  AccessoriesOption,
  SelectOption,
} from "../../../types/shared/select";
import {
  EMPTY_ACCESSORIES,
  EMPTY_ADDITIONAL_STONE,
} from "../../../types/product/defaults";
import ProductFormLayout from "../layout/ProductFormLayout";

type Props = {
  value: BaseProductForm;
  mode: "create" | "edit" | "view";
  onChange: (patch: Partial<BaseProductForm>) => void;
  itemTypeOptions: SelectOption[];
  metalOptions: SelectOption[];
  stoneNameOptions: SelectOption[];
  shapeOptions: SelectOption[];
  cuttingOptions: SelectOption[];
  qualityOptions: SelectOption[];
  clarityOptions: SelectOption[];
  accessoriesOptions: AccessoriesOption[];
};

export default function ProductMasterFormTemplate({
  value,
  mode,
  onChange,
  ...options
}: Props) {
  return (
    <ProductFormLayout>
      <ProductInfoSection
        value={value}
        mode={mode}
        itemTypeOptions={options.itemTypeOptions}
        metalOptions={options.metalOptions}
        onChange={onChange}
      />

      <PrimaryStoneSection
        value={value.primaryStone}
        mode={mode}
        additionalStones={value.additionalStones}
        onChangePrimary={(p) =>
          onChange({ primaryStone: { ...value.primaryStone, ...p } })
        }
        onAddStone={() =>
          onChange({
            additionalStones: [
              ...value.additionalStones,
              EMPTY_ADDITIONAL_STONE,
            ],
          })
        }
        onChangeStone={(index, patch) => {
          const stones = [...value.additionalStones];
          stones[index] = { ...stones[index], ...patch };
          onChange({ additionalStones: stones });
        }}
        onRemoveStone={(index) => {
          const stones = value.additionalStones.filter((_, i) => i !== index);
          onChange({ additionalStones: stones });
        }}
        stoneNameOptions={options.stoneNameOptions}
        shapeOptions={options.shapeOptions}
        cuttingOptions={options.cuttingOptions}
        qualityOptions={options.qualityOptions}
        clarityOptions={options.clarityOptions}
      />

      <AccessoriesSection
        value={value.accessories ?? EMPTY_ACCESSORIES}
        options={options.accessoriesOptions}
        mode={mode}
        metalOptions={options.metalOptions}
        onChange={(patch) =>
          onChange({
            accessories: {
              ...(value.accessories ?? EMPTY_ACCESSORIES),
              ...patch,
            },
          })
        }
      />
    </ProductFormLayout>
  );
}
