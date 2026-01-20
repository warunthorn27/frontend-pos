import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import {
  createSemiMount,
  getProductById,
  updateSemiMount,
} from "../../../services/product";
import { ApiError } from "../../../services/apiClient";
import { useProductMasters } from "../hook/useProductMasters";
import type {
  AccessoriesForm,
  AdditionalStoneForm,
  BaseProductForm,
  PrimaryStoneForm,
} from "../../../types/product/form";
import type {
  BackendAccessory,
  BackendAdditionalStone,
} from "../../../types/product/response";
import ProductFormPageTemplate from "../../../component/template/ProductFormPageTemplate";

const emptyAccessories = (): AccessoriesForm => ({
  active: true,
  code: "",
  productName: "",
  weight: "",
  productSize: "",
  metal: "",
  description: "",
  weightUnit: "g",
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

const emptyForm: BaseProductForm = {
  active: true,
  productName: "",
  itemType: "",
  productSize: "",

  code: "",
  metal: "",
  metalColor: "",

  description: "",

  gwt: "0.00",
  nwt: "0.00",

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
          productName: p.product_name,
          code: p.product_code,
          itemType: p.product_item_type,
          productSize: p.product_detail_id.size ?? "",
          metal: p.attributes?.metal?.name ?? "",
          metalColor: p.attributes?.metal_color?.name ?? "",
          description: p.product_detail_id.description ?? "",
          gwt: String(p.product_detail_id.gross_weight ?? "0"),
          nwt: String(p.product_detail_id.net_weight ?? "0"),

          accessories: (() => {
            const acc = p.product_detail_id.related_accessories?.[0];
            if (!acc) return emptyAccessories();

            const a = acc as BackendAccessory;

            return {
              active: true,
              code: a.product_id?._id ?? "",
              productName: a.product_id?.product_name ?? "",
              weight: String(a.weight ?? ""),
              productSize: a.size ?? "",
              metal: a.metal ?? "",
              description: a.description ?? "",
              weightUnit: "g",
            };
          })(),

          primaryStone: {
            stoneName: p.product_detail_id.primary_stone?.stone_name ?? "",
            shape: p.product_detail_id.primary_stone?.shape ?? "",
            size: p.product_detail_id.primary_stone?.size ?? "",
            weight: String(p.product_detail_id.primary_stone?.weight ?? ""),
            unit: "g",
            color: p.product_detail_id.primary_stone?.color ?? "",
            cutting: p.product_detail_id.primary_stone?.cutting ?? "",
            quality: p.product_detail_id.primary_stone?.quality ?? "",
            clarity: p.product_detail_id.primary_stone?.clarity ?? "",
          },

          additionalStones:
            p.product_detail_id.additional_stones?.map(
              (s: BackendAdditionalStone): AdditionalStoneForm => ({
                stoneName: s.stone_name ?? "",
                shape: s.shape ?? "",
                size: s.size ?? "",
                weight: String(s.weight ?? ""),
                unit: "g",
                color: s.color ?? "",
                cutting: s.cutting ?? "",
                quality: s.quality ?? "",
                clarity: s.clarity ?? "",
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
      additionalStones: [
        ...s.additionalStones,
        {
          stoneName: "",
          shape: "",
          size: "",
          weight: "",
          unit: "g",
          color: "",
          cutting: "",
          quality: "",
          clarity: "",
        },
      ],
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

      formData.append("product_name", form.productName.trim());
      formData.append("code", form.code.trim());
      formData.append("category", "semimount");
      formData.append("item_type", form.itemType);
      formData.append("product_size", form.productSize);
      formData.append("metal", form.metal);

      if (form.metalColor) formData.append("metal_color", form.metalColor);

      if (form.description) formData.append("description", form.description);

      formData.append("gross_weight", form.gwt);
      formData.append("net_weight", form.nwt);
      formData.append("unit", "g");

      if (form.primaryStone.stoneName) {
        formData.append("stone_name", form.primaryStone.stoneName);
        formData.append("shape", form.primaryStone.shape);
        formData.append("size", form.primaryStone.size);
        formData.append("color", form.primaryStone.color);
        formData.append("cutting", form.primaryStone.cutting);
        formData.append("quality", form.primaryStone.quality);
        formData.append("clarity", form.primaryStone.clarity);
        formData.append("weight", form.primaryStone.weight);
      }

      if (form.additionalStones.length > 0) {
        formData.append(
          "stones",
          JSON.stringify(
            form.additionalStones.map((s) => ({
              stone_name: s.stoneName,
              shape: s.shape,
              size: s.size,
              color: s.color,
              cutting: s.cutting,
              quality: s.quality,
              clarity: s.clarity,
              weight: Number(s.weight || 0),
            })),
          ),
        );
      }

      if (form.accessories.code) {
        const accessoriesPayload = [
          {
            product_id: form.accessories.code, // ต้องเป็น ObjectId
            weight: Number(form.accessories.weight || 0),
            size: form.accessories.productSize || "",
            metal: form.accessories.metal || "",
            description: form.accessories.description || "",
          },
        ];

        formData.append(
          "related_accessories",
          JSON.stringify(accessoriesPayload),
        );
      }

      images.forEach((img) => formData.append("files", img));

      if (isEdit && id) {
        await updateSemiMount(id, formData);
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

  return (
    <ProductFormPageTemplate
      title="Semi-Mount"
      form={form}
      images={images}
      onChangeForm={patchForm}
      onChangePrimaryStone={patchPrimaryStone}
      onAddAdditionalStone={addAdditionalStone}
      onChangeAdditionalStone={updateAdditionalStone}
      onRemoveAdditionalStone={removeAdditionalStone}
      onChangeImages={setImages}
      itemTypeOptions={itemTypeOptions}
      metalOptions={metalOptions}
      stoneNameOptions={stoneNameOptions}
      shapeOptions={shapeOptions}
      cuttingOptions={cuttingOptions}
      qualityOptions={qualityOptions}
      clarityOptions={clarityOptions}
      accessoriesOptions={accessoriesOptions}
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
