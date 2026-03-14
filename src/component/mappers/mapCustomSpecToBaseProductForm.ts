import type {
  AccessoriesForm,
  BaseProductForm,
  OthersForm,
  StoneDiamondForm,
} from "../../types/product/form";
import type { CustomSpec } from "../../types/pos/custom";

export function mapCustomSpecToBaseProductForm(
  spec: CustomSpec,
): BaseProductForm {
  return {
    active: true,
    productId: "",
    productName: spec.product_name ?? "",
    code: "",
    description: spec.description ?? "",

    itemType: spec.item_type_id ?? "",
    productSize: spec.product_size ?? "",

    metal: spec.metal_id ?? "",
    metalColor: spec.metal_color ?? "",

    gwt: spec.gwt ? String(spec.gwt) : "",
    nwt: spec.nwt ? String(spec.nwt) : "",
    unit: "g",

    primaryStone: {
      stoneName: spec.stone_name_id ?? "",
      shape: spec.stone_shape_id ?? "",
      size: spec.size ?? "",
      weight: spec.s_weight ? String(spec.s_weight) : "",
      unit: "cts",
      color: spec.color ?? "",
      cutting: spec.cutting ?? "",
      quality: spec.quality ?? "",
      clarity: spec.clarity ?? "",
    },

    additionalStones:
      spec.additional_stones?.map((s) => ({
        stoneName: s.stone_name_id ?? "",
        shape: s.stone_shape_id ?? "",
        size: s.size ?? "",
        weight: s.s_weight ? String(s.s_weight) : "",
        unit: "cts",
        color: s.color ?? "",
        cutting: s.cutting ?? "",
        quality: s.quality ?? "",
        clarity: s.clarity ?? "",
      })) ?? [],

    accessories: {
      active: true,
      productId: "",
      productName: "",
      code: "",
      productSize: "",
      metal: "",
      weight: "",
      unit: "g",
      description: "",
    },
  };
}

export function mapBaseProductFormToCustomSpec(
  form: BaseProductForm,
): CustomSpec {
  return {
    product_name: form.productName,
    product_size: form.productSize,
    item_type_id: form.itemType,
    metal_id: form.metal,
    metal_color: form.metalColor,
    description: form.description,

    gwt: form.gwt ? Number(form.gwt) : undefined,
    nwt: form.nwt ? Number(form.nwt) : undefined,

    stone_name_id: form.primaryStone.stoneName,
    stone_shape_id: form.primaryStone.shape,
    size: form.primaryStone.size,
    s_weight: form.primaryStone.weight
      ? Number(form.primaryStone.weight)
      : undefined,
    color: form.primaryStone.color,
    cutting: form.primaryStone.cutting,
    quality: form.primaryStone.quality,
    clarity: form.primaryStone.clarity,

    additional_stones: form.additionalStones.map((s) => ({
      stone_name_id: s.stoneName,
      stone_shape_id: s.shape,
      size: s.size,
      s_weight: s.weight ? Number(s.weight) : undefined,
      color: s.color,
      cutting: s.cutting,
      quality: s.quality,
      clarity: s.clarity,
    })),
  };
}

export function mapCustomSpecToStoneForm(spec: CustomSpec): StoneDiamondForm {
  return {
    active: true,
    productId: "",
    productName: spec.product_name ?? "",
    code: "",
    description: spec.description ?? "",

    stoneName: spec.stone_name_id ?? "",
    shape: spec.stone_shape_id ?? "",
    size: spec.size ?? "",
    weight: spec.s_weight ? String(spec.s_weight) : "",
    unit: "cts",

    color: spec.color ?? "",
    cutting: spec.cutting ?? "",
    quality: spec.quality ?? "",
    clarity: spec.clarity ?? "",
  };
}

export function mapCustomSpecToAccessoryForm(
  spec: CustomSpec,
): AccessoriesForm {
  return {
    active: true,
    productId: "",
    productName: spec.product_name ?? "",
    code: "",

    productSize: spec.product_size ?? "",
    metal: spec.metal_id ?? "",

    weight: spec.gwt ? String(spec.gwt) : "",
    unit: "g",

    description: spec.description ?? "",
  };
}

export function mapCustomSpecToOthersForm(spec: CustomSpec): OthersForm {
  return {
    active: true,
    productId: "",
    productName: spec.product_name ?? "",
    code: "",

    productSize: spec.product_size ?? "",
    weight: spec.gwt ? String(spec.gwt) : "",
    unit: "g",

    description: spec.description ?? "",
  };
}
