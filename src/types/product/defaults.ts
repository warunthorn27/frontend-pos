import type {
  BaseProductForm,
  PrimaryStoneForm,
  AdditionalStoneForm,
  AccessoriesForm,
} from "./form";

export const EMPTY_PRIMARY_STONE: PrimaryStoneForm = {
  stoneName: "",
  shape: "",
  size: "",
  weight: "",
  unit: "g",
  color: "",
  cutting: "",
  quality: "",
  clarity: "",
};

export const EMPTY_ADDITIONAL_STONE: AdditionalStoneForm = {
  stoneName: "",
  shape: "",
  size: "",
  weight: "",
  unit: "g",
  color: "",
  cutting: "",
  quality: "",
  clarity: "",
};

export const EMPTY_ACCESSORIES: AccessoriesForm = {
  active: false,
  productId: "",
  code: "",
  weight: "",
  unit: "g",
  description: "",
  productName: "",
  productSize: "",
  metal: "",
};

export const EMPTY_PRODUCT_FORM: BaseProductForm = {
  active: false,
  productName: "",
  code: "",
  description: "",
  itemType: "",
  metal: "",
  nwt: "",
  gwt: "",
  unit: "g",
  productSize: "",
  metalColor: "",

  primaryStone: EMPTY_PRIMARY_STONE,
  additionalStones: [],
  accessories: EMPTY_ACCESSORIES,
};
