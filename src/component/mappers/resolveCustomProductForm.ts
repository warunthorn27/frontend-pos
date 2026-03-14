import type { CustomSpec } from "../../types/pos/custom";
import type {
  BaseProductForm,
  StoneDiamondForm,
  AccessoriesForm,
  OthersForm,
  ProductCategory,
} from "../../types/product/form";
import {
  mapCustomSpecToAccessoryForm,
  mapCustomSpecToBaseProductForm,
  mapCustomSpecToOthersForm,
  mapCustomSpecToStoneForm,
} from "./mapCustomSpecToBaseProductForm";

type CustomFormByCategory = {
  productmaster: BaseProductForm;
  semimount: BaseProductForm;
  stone: StoneDiamondForm;
  accessory: AccessoriesForm;
  others: OthersForm;
};

export function resolveCustomFormByCategory<C extends ProductCategory>(
  category: C,
  spec: CustomSpec,
): CustomFormByCategory[C] {
  switch (category) {
    case "productmaster":
    case "semimount":
      return mapCustomSpecToBaseProductForm(spec) as CustomFormByCategory[C];

    case "stone":
      return mapCustomSpecToStoneForm(spec) as CustomFormByCategory[C];

    case "accessory":
      return mapCustomSpecToAccessoryForm(spec) as CustomFormByCategory[C];

    case "others":
      return mapCustomSpecToOthersForm(spec) as CustomFormByCategory[C];
  }
}
