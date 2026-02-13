import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import {
  createSemiMount,
  getProductById,
  updateProduct,
} from "../../../services/product";
import { ApiError } from "../../../services/apiClient";
import { useProductMasters } from "../hooks/useProductMasters";
import type {
  AccessoriesForm,
  AdditionalStoneForm,
  BaseProductForm,
  PrimaryStoneForm,
} from "../../../types/product/form";
import ProductFormPageTemplate from "../../../component/template/ProductFormPageTemplate";
import type { SelectOption } from "../../../types/shared/select";

const emptyAccessories = (): AccessoriesForm => ({
  active: true,
  productId: "",
  code: "",
  productName: "",
  weight: "",
  productSize: "",
  metal: "",
  description: "",
  unit: "g",
});

const emptyPrimaryStone = (): PrimaryStoneForm => ({
  stoneName: "",
  shape: "",
  size: "",
  weight: "",
  unit: "g",
  color: "",
  cutting: "",
  quality: "",
  clarity: "",
});

const emptyAdditionalStones = (): AdditionalStoneForm => ({
  stoneName: "",
  shape: "",
  size: "",
  weight: "",
  unit: "g",
  color: "",
  cutting: "",
  quality: "",
  clarity: "",
});

const emptyForm: BaseProductForm = {
  active: true,
  productId: "",
  productName: "",
  itemType: "",
  productSize: "",

  code: "",
  metal: "",
  metalColor: "",

  description: "",

  gwt: "",
  nwt: "",
  unit: "g",

  accessories: emptyAccessories(),
  primaryStone: emptyPrimaryStone(),
  additionalStones: [],
};

const SemiMountPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);
  const [form, setForm] = useState<BaseProductForm>(emptyForm);
  const [images, setImages] = useState<File[]>([]);

  const {
    stoneNameOptions,
    shapeOptions,
    cuttingOptions,
    qualityOptions,
    clarityOptions,
    itemTypeOptions,
    metalOptions,
    accessoriesOptions,
  } = useProductMasters();

  /* ---------- loadProduct ---------- */

  useEffect(() => {
    if (!isEdit || !id) return;

    const loadProduct = async () => {
      try {
        const res = await getProductById(id);
        const p = res.data;

        setForm({
          active: p.is_active,
          productId: p._id ?? "",
          productName: p.product_name,
          code: p.code,
          itemType: p.item_type?._id ?? "",
          productSize: p.product_size ?? "",
          description: p.description ?? "",

          metal: p.metal?._id ?? "",
          metalColor: p.metal_color?.name ?? "",
          gwt: String(p.gross_weight ?? "0"),
          nwt: String(p.net_weight ?? "0"),
          unit: p.unit ?? "g",

          accessories: (() => {
            const acc = p.related_accessories?.[0];
            if (!acc) return emptyAccessories();

            return {
              active: true,
              productId: acc.product_id?._id ?? "",
              code: acc.product_id?.product_code ?? "",
              productName: acc.product_id?.product_name ?? "",
              weight: String(acc.weight ?? ""),
              productSize: String(acc.size ?? ""),
              metal: acc.metal?._id ?? "", // id เท่านั้น
              description: acc.description ?? "",
              unit: acc.unit ?? "g",
            };
          })(),

          primaryStone: {
            stoneName: p.primary_stone?.stone_name?._id ?? "",
            shape: p.primary_stone?.shape?._id ?? "",
            size: p.primary_stone?.size ?? "",
            weight:
              p.primary_stone?.weight !== undefined &&
              p.primary_stone?.weight !== null
                ? String(p.primary_stone.weight)
                : "",
            unit: p.primary_stone?.unit ?? "g",
            color: p.primary_stone?.color ?? "",
            cutting: p.primary_stone?.cutting?._id ?? "",
            quality: p.primary_stone?.quality?._id ?? "",
            clarity: p.primary_stone?.clarity?._id ?? "",
          },

          additionalStones:
            p.additional_stones?.map(
              (s): AdditionalStoneForm => ({
                stoneName: s.stone_name?._id ?? "",
                shape: s.shape?._id ?? "",
                size: s.size ?? "",
                weight:
                  s.weight !== undefined && s.weight !== null
                    ? String(s.weight)
                    : "",
                unit: s.unit ?? "g",
                color: s.color ?? "",
                cutting: s.cutting?._id ?? "",
                quality: s.quality?._id ?? "",
                clarity: s.clarity?._id ?? "",
              }),
            ) ?? [],
        });
      } catch (e) {
        if (e instanceof ApiError && e.status === 401) {
          alert("Session หมดอายุ กรุณา login ใหม่");
          return;
        }

        if (e instanceof Error) {
          alert(e.message);
          return;
        }

        alert("ไม่สามารถโหลดข้อมูลสินค้าได้");
      }
    };

    loadProduct();
  }, [id, isEdit]);

  const addAdditionalStone = () => {
    setForm((s) => ({
      ...s,
      additionalStones: [...s.additionalStones, emptyAdditionalStones()],
    }));
  };

  const updateAdditionalStone = (
    index: number,
    patch: Partial<AdditionalStoneForm>,
  ) => {
    setForm((s) => ({
      ...s,
      additionalStones: s.additionalStones.map((st, i) =>
        i === index ? { ...st, ...patch } : st,
      ),
    }));
  };

  const removeAdditionalStone = (index: number) => {
    setForm((s) => ({
      ...s,
      additionalStones: s.additionalStones.filter((_, i) => i !== index),
    }));
  };

  // helpers สำหรับ patch state
  const patchForm = (patch: Partial<BaseProductForm>) => {
    setForm((s) => ({ ...s, ...patch }));
  };

  const patchPrimaryStone = (patch: Partial<PrimaryStoneForm>) => {
    setForm((s) => ({
      ...s,
      primaryStone: { ...s.primaryStone, ...patch },
    }));
  };

  const canSave = useMemo(() => {
    return (
      form.productName.trim() !== "" &&
      form.code.trim() !== "" &&
      form.itemType.trim() !== "" &&
      form.productSize.trim() !== "" &&
      form.metal.trim() !== "" &&
      form.gwt.trim() !== "" &&
      form.nwt.trim() !== ""
    );
  }, [form]);

  /* ---------- handle Save ---------- */
  const handleSave = async () => {
    try {
      const formData = new FormData();
      // info product
      formData.append("product_name", form.productName.trim());
      formData.append("code", form.code.trim());
      formData.append("category", "semimount");
      formData.append("item_type", form.itemType);
      formData.append("size", form.productSize);
      formData.append("metal", form.metal);

      if (form.metalColor) formData.append("metal_color", form.metalColor);
      if (form.description) formData.append("description", form.description);

      formData.append("gross_weight", form.gwt);
      formData.append("net_weight", form.nwt);
      formData.append("unit", form.unit);

      // primary stone
      const hasPrimaryStone =
        form.primaryStone.stoneName ||
        form.primaryStone.shape ||
        form.primaryStone.weight;

      if (hasPrimaryStone) {
        formData.append(
          "primary_stone",
          JSON.stringify({
            stone_name: form.primaryStone.stoneName || undefined,
            shape: form.primaryStone.shape || undefined,
            size: form.primaryStone.size || undefined,
            weight:
              form.primaryStone.weight === ""
                ? undefined
                : Number(form.primaryStone.weight),
            unit: form.primaryStone.unit,
            color: form.primaryStone.color || undefined,
            cutting: form.primaryStone.cutting || undefined,
            quality: form.primaryStone.quality || undefined,
            clarity: form.primaryStone.clarity || undefined,
          }),
        );
      }

      // additional stone
      if (form.additionalStones.length > 0) {
        formData.append(
          "additional_stones",
          JSON.stringify(
            form.additionalStones.map((s) => ({
              stone_name: s.stoneName,
              shape: s.shape,
              size: s.size,
              color: s.color,
              cutting: s.cutting,
              quality: s.quality,
              clarity: s.clarity,
              weight: s.weight === "" ? undefined : Number(s.weight),
              unit: s.unit,
            })),
          ),
        );
      }

      // accessories
      if (form.accessories.code) {
        const accessoriesPayload = [
          {
            product_id: form.accessories.productId,
            weight:
              form.accessories.weight === ""
                ? undefined
                : Number(form.accessories.weight),
            size: form.accessories.productSize,
            metal: form.accessories.metal,
            unit: form.accessories.unit,
            description: form.accessories.description,
          },
        ];

        formData.append(
          "related_accessories",
          JSON.stringify(accessoriesPayload),
        );
      }

      images.forEach((img) => formData.append("files", img));

      if (isEdit && id) {
        await updateProduct(id, formData);
      } else {
        await createSemiMount(formData);
      }

      // reset form
      setForm(emptyForm);
      setImages([]);
    } catch (e) {
      if (e instanceof Error) {
        alert(e.message);
      } else {
        alert("Save failed");
      }
    }
  };

  const mergedAccessoriesOptions = useMemo(() => {
    const acc = form.accessories;

    // ยังไม่เลือก
    if (!acc.productId) return accessoriesOptions;

    // ถ้ามีอยู่แล้ว ไม่ต้องทำอะไร
    const exists = accessoriesOptions.some((o) => o.value === acc.productId);

    if (exists) return accessoriesOptions;

    // inject option จาก backend
    return [
      {
        value: acc.productId,
        label: acc.productName,
        productCode: acc.code,
        productName: acc.productName,
        productSize: acc.productSize,
        metal: acc.metal,
        defaultWeight: acc.weight,
        unit: acc.unit,
      },
      ...accessoriesOptions,
    ];
  }, [accessoriesOptions, form.accessories]);

  const mergeOption = (
    options: SelectOption[],
    value: string,
    labelFallback?: string,
  ) => {
    if (!value) return options;
    if (options.some((o) => o.value === value)) return options;

    return [{ value, label: labelFallback ?? value }, ...options];
  };

  const mergedStoneNameOptions = mergeOption(
    stoneNameOptions,
    form.primaryStone.stoneName,
  );

  const mergedShapeOptions = mergeOption(shapeOptions, form.primaryStone.shape);

  return (
    <ProductFormPageTemplate
      title="Semi-Mount"
      form={form}
      images={images}
      mode={isEdit ? "edit" : "create"}
      onChangeForm={patchForm}
      onChangePrimaryStone={patchPrimaryStone}
      onAddAdditionalStone={addAdditionalStone}
      onChangeAdditionalStone={updateAdditionalStone}
      onRemoveAdditionalStone={removeAdditionalStone}
      onChangeImages={setImages}
      itemTypeOptions={itemTypeOptions}
      metalOptions={metalOptions}
      stoneNameOptions={mergedStoneNameOptions}
      shapeOptions={mergedShapeOptions}
      cuttingOptions={cuttingOptions}
      qualityOptions={qualityOptions}
      clarityOptions={clarityOptions}
      accessoriesOptions={mergedAccessoriesOptions}
      canSave={canSave}
      onCancel={() => {
        setForm(emptyForm);
        setImages([]);
      }}
      onSave={handleSave}
    />
  );
};

export default SemiMountPage;
