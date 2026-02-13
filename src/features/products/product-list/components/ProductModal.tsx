import Modal from "@mui/material/Modal";
import type {
  AccessoriesForm,
  BaseProductForm,
  OthersForm,
  ProductCategory,
  StoneDiamondForm,
} from "../../../../types/product/form";
import ProductImagesCard from "../../../../component/template/media/ProductImagesCard";
import { useEffect, useState } from "react";
import ProductMasterFormTemplate from "../../../../component/template/forms/ProductMasterFormTemplate";
import AccessoriesFormTemplate from "../../../../component/template/forms/AccessoriesFormTemplate";
import StoneFormTemplate from "../../../../component/template/forms/StoneFormTemplate";
import OthersFormTemplate from "../../../../component/template/forms/OthersFormTemplate";
import {
  fetchProductById,
  updateAccessory,
  updateOthers,
  updateProduct,
  updateProductStatus,
  updateStoneDiamond,
} from "../../../../services/product";
import {
  mapFormToUpdatePayload,
  mapToAccessoriesForm,
  mapToBaseProductForm,
  mapToOthersForm,
  mapToStoneDiamondForm,
  normalizeCategoryFromDetail,
} from "../../../../component/mappers/resolveProductForm";
import RemoteImagesPreview from "../../../../component/template/media/RemoteImagesPreview";
import ProductImage from "./ProductImage";
import RemoveIcon from "../../../../assets/svg/remove.svg?react";
import EditIcon from "../../../../assets/svg/edit.svg?react";
import { useProductMasters } from "../../hooks/useProductMasters";
import { isObjectId } from "../../../../utils/isObjectId";
import { createMaster } from "../../../../services/master";

type Props = {
  open: boolean;
  productId: string;
  mode: "view" | "edit";
  onClose: () => void;
  onSaved?: () => void;
};

const ProductModal: React.FC<Props> = ({
  open,
  productId,
  mode,
  onClose,
  onSaved,
}) => {
  // รูปที่มีอยู่แล้วจาก backend
  const [remoteImages, setRemoteImages] = useState<string[]>([]);
  // รูปที่ user จะเพิ่ม (ตอน edit)
  const [localImages, setLocalImages] = useState<File[]>([]);
  // form state
  // const [form, setForm] = useState<FormByCategory[ProductCategory] | null>(
  //   null,
  // );
  const [productMasterForm, setProductMasterForm] =
    useState<BaseProductForm | null>(null);

  const [stoneForm, setStoneForm] = useState<StoneDiamondForm | null>(null);

  const [accessoriesForm, setAccessoriesForm] =
    useState<AccessoriesForm | null>(null);

  const [othersForm, setOthersForm] = useState<OthersForm | null>(null);

  // local mode
  const [currentMode, setCurrentMode] = useState<"view" | "edit">(mode);
  const [realCategory, setRealCategory] = useState<ProductCategory | null>(
    null,
  );

  const {
    loading,
    itemTypeOptions,
    metalOptions,
    stoneNameOptions,
    shapeOptions,
    cuttingOptions,
    qualityOptions,
    clarityOptions,
    accessoriesOptions,
    setStoneNameOptions,
    setShapeOptions,
    setCuttingOptions,
    setQualityOptions,
    setClarityOptions,
    setMetalOptions,
    reloadMasters,
  } = useProductMasters();

  function renderForm() {
    switch (realCategory) {
      case "productmaster":
      case "semimount":
        if (!productMasterForm) return null;
        return (
          <ProductMasterFormTemplate
            value={productMasterForm}
            mode={currentMode}
            onChange={(patch) =>
              setProductMasterForm((prev) =>
                prev ? { ...prev, ...patch } : prev,
              )
            }
            itemTypeOptions={itemTypeOptions}
            metalOptions={metalOptions}
            stoneNameOptions={stoneNameOptions}
            shapeOptions={shapeOptions}
            cuttingOptions={cuttingOptions}
            qualityOptions={qualityOptions}
            clarityOptions={clarityOptions}
            accessoriesOptions={accessoriesOptions}
          />
        );

      case "stone":
        if (!stoneForm) return null;
        return (
          <StoneFormTemplate
            value={stoneForm}
            mode={currentMode}
            onChange={(patch) =>
              setStoneForm((prev) => (prev ? { ...prev, ...patch } : prev))
            }
            stoneNameOptions={stoneNameOptions}
            shapeOptions={shapeOptions}
            cuttingOptions={cuttingOptions}
            qualityOptions={qualityOptions}
            clarityOptions={clarityOptions}
          />
        );

      case "accessory":
        if (!accessoriesForm) return null;
        return (
          <AccessoriesFormTemplate
            value={accessoriesForm}
            mode={currentMode}
            metalOptions={metalOptions}
            onChange={(patch) =>
              setAccessoriesForm((prev) =>
                prev ? { ...prev, ...patch } : prev,
              )
            }
          />
        );

      case "others":
        if (!othersForm) return null;
        return (
          <OthersFormTemplate
            value={othersForm}
            mode={currentMode}
            onChange={(patch) =>
              setOthersForm((prev) => (prev ? { ...prev, ...patch } : prev))
            }
          />
        );
    }
  }

  useEffect(() => {
    if (!open) return;

    fetchProductById(productId).then((res) => {
      const product = res.data;

      // normalize category

      const category = normalizeCategoryFromDetail(product.category);

      setRealCategory(category);

      switch (category) {
        case "productmaster":
        case "semimount":
          setProductMasterForm(mapToBaseProductForm(product));
          break;

        case "stone":
          setStoneForm(mapToStoneDiamondForm(product));
          break;

        case "accessory":
          setAccessoriesForm(mapToAccessoriesForm(product));
          break;

        case "others":
          setOthersForm(mapToOthersForm(product));
          break;
      }

      setRemoteImages(product.file ?? []);
      setLocalImages([]);
    });
  }, [open, productId]);

  async function urlToFile(url: string, filename: string): Promise<File> {
    const res = await fetch(url);
    const blob = await res.blob();
    return new File([blob], filename, { type: blob.type });
  }

  const onEdit = async () => {
    setCurrentMode("edit");

    if (remoteImages.length === 0) return;

    const files = await Promise.all(
      remoteImages.map((url, i) => urlToFile(url, `image-${i}.jpg`)),
    );

    setLocalImages(files);
  };

  useEffect(() => {
    if (!open) return;

    if (mode === "edit" && remoteImages.length > 0) {
      (async () => {
        const files = await Promise.all(
          remoteImages.map((url, i) => urlToFile(url, `image-${i}.jpg`)),
        );
        setLocalImages(files);
        // setCurrentMode("edit");
      })();
    }
  }, [open, mode, remoteImages]);

  const getCurrentForm = () => {
    switch (realCategory) {
      case "productmaster":
      case "semimount":
        return productMasterForm;
      case "stone":
        return stoneForm;
      case "accessory":
        return accessoriesForm;
      case "others":
        return othersForm;
      default:
        return null;
    }
  };

  const buildFormData = () => {
    const formData = new FormData();

    const append = (obj: Record<string, unknown>, parent?: string) => {
      Object.entries(obj).forEach(([key, value]) => {
        const formKey = parent ? `${parent}[${key}]` : key;

        if (value === "") {
          formData.append(formKey, "");
          return;
        }

        if (Array.isArray(value)) {
          value.forEach((item, index) => {
            append(item as Record<string, unknown>, `${formKey}[${index}]`);
          });
        } else if (typeof value === "object" && value !== null) {
          append(value as Record<string, unknown>, formKey);
        } else if (value !== undefined && value !== null) {
          formData.append(formKey, String(value));
        }
      });
    };

    if (!realCategory) return formData;

    const form = getCurrentForm();
    if (!form) return formData;

    const payload = mapFormToUpdatePayload(realCategory, form);
    console.log("UPDATE PAYLOAD", payload);
    append(payload);

    localImages.forEach((file) => {
      formData.append("files", file);
    });

    return formData;
  };

  const onSave = async () => {
    try {
      if (!realCategory) return;

      const form = getCurrentForm();
      if (!form || !realCategory) return;

      // logFormBySection(realCategory, form);

      // const form = getCurrentForm();
      // if (!form) return;

      console.log("REAL CATEGORY:", realCategory);
      console.log("CURRENT FORM:", form);

      // =========================
      // update ตัว product หลัก
      // =========================
      const formData = buildFormData();

      if (realCategory === "stone" && stoneForm) {
        // stone name
        if (stoneForm.stoneName && !isObjectId(stoneForm.stoneName)) {
          const res = await createMaster("stone_name", stoneForm.stoneName);
          const id = res.data._id;

          setStoneNameOptions((prev) => [
            ...prev,
            { value: id, label: stoneForm.stoneName },
          ]);

          formData.set("stone_name", id);
        }

        // shape
        if (stoneForm.shape && !isObjectId(stoneForm.shape)) {
          const res = await createMaster("shape", stoneForm.shape);
          const id = res.data._id;

          setShapeOptions((prev) => [
            ...prev,
            { value: id, label: stoneForm.shape },
          ]);

          formData.set("shape", id);
        }

        // cutting
        if (stoneForm.cutting && !isObjectId(stoneForm.cutting)) {
          const res = await createMaster("cutting", stoneForm.cutting);
          const id = res.data._id;

          setCuttingOptions((prev) => [
            ...prev,
            { value: id, label: stoneForm.cutting },
          ]);

          formData.set("cutting", id);
        }

        // quality
        if (stoneForm.quality && !isObjectId(stoneForm.quality)) {
          const res = await createMaster("quality", stoneForm.quality);
          const id = res.data._id;

          setQualityOptions((prev) => [
            ...prev,
            { value: id, label: stoneForm.quality },
          ]);

          formData.set("quality", id);
        }

        // clarity
        if (stoneForm.clarity && !isObjectId(stoneForm.clarity)) {
          const res = await createMaster("clarity", stoneForm.clarity);
          const id = res.data._id;

          setClarityOptions((prev) => [
            ...prev,
            { value: id, label: stoneForm.clarity },
          ]);

          formData.set("clarity", id);
        }
      }

      if (
        realCategory === "accessory" &&
        accessoriesForm &&
        accessoriesForm.metal &&
        !isObjectId(accessoriesForm.metal)
      ) {
        // user พิมพ์ metal ใหม่
        const res = await createMaster("metal", accessoriesForm.metal);
        const metalId = res.data._id;

        setMetalOptions((prev) => [
          ...prev,
          { value: metalId, label: accessoriesForm.metal },
        ]);

        // formData.set("metal", metalId);
        formData.set("metal", accessoriesForm.metal);
      }

      // update product details
      switch (realCategory) {
        case "productmaster":
          await updateProduct(productId, formData);
          break;

        case "semimount":
          await updateProduct(productId, formData);
          break;

        case "stone":
          await updateStoneDiamond(productId, formData);
          break;

        case "accessory":
          await updateAccessory(productId, formData);
          break;

        case "others":
          await updateOthers(productId, formData);
          break;
      }

      // update status toggle
      if ("active" in form) {
        await updateProductStatus(productId, form.active);
      }

      // =========================
      // fetch ข้อมูลล่าสุด
      // =========================
      const res = await fetchProductById(productId);
      const product = res.data;

      // รีเฟรชรูปสำหรับ view mode
      setRemoteImages(product.file ?? []);
      setLocalImages([]);

      // reset form ก่อน (กัน React reuse object เดิม)
      setProductMasterForm(null);
      setStoneForm(null);
      setAccessoriesForm(null);
      setOthersForm(null);

      const category = normalizeCategoryFromDetail(product.category);
      setRealCategory(category);

      switch (category) {
        case "productmaster":
        case "semimount": {
          const form = mapToBaseProductForm(product);
          setProductMasterForm(form);
          break;
        }

        case "stone": {
          const form = mapToStoneDiamondForm(product);
          setStoneForm(form);
          break;
        }

        case "accessory": {
          const form = mapToAccessoriesForm(product);
          setAccessoriesForm(form);
          break;
        }

        case "others": {
          const form = mapToOthersForm(product);
          setOthersForm(form);
          break;
        }
      }
      await reloadMasters(); // รีเฟรช master list

      // =========================
      // กลับเป็น view mode
      // =========================
      onSaved?.();
      setCurrentMode("view");
    } catch (err) {
      console.error("Save product failed", err);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <div className="fixed inset-0 flex items-center justify-center bg-black/30">
        <div
          className="w-full max-w-[min(1200px,95vw)] max-h-[90vh] bg-white rounded-t-lg shadow-lg 
          grid grid-rows-[auto_1fr_auto]"
        >
          {/* LOADING OVERLAY */}
          {loading && (
            <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/70">
              <div className="animate-pulse text-lg text-gray-600">
                Loading product data...
              </div>
            </div>
          )}

          {/* HEADER */}
          <div className="flex items-center justify-between px-6 py-3 border-b">
            <h2>
              {realCategory === "productmaster" && "Product Master"}
              {realCategory === "semimount" && "Semi-Mount"}
              {realCategory === "stone" && "Stone / Diamond"}
              {realCategory === "accessory" && "Accessories"}
              {realCategory === "others" && "Others"}
            </h2>

            <div className="flex items-center gap-3">
              {currentMode === "view" && (
                <button
                  className="px-3 py-1.5 text-base text-black bg-white border border-[#CFCFCF] 
                  hover:bg-[#F1F1F1] rounded-md flex items-center gap-2"
                  onClick={onEdit}
                >
                  <EditIcon className="w-5 h-5" />
                  <span>Edit</span>
                </button>
              )}

              <button onClick={onClose}>
                <RemoveIcon className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* BODY */}
          <div className="overflow-auto hide-scrollbar bg-[#FAFAFA] p-8">
            <div className="flex gap-6">
              {/* LEFT */}
              <div className="w-[360px] shrink-0 max-sm:w-full">
                {currentMode === "view" ? (
                  <div className=" aspect-square rounded-md border border-[#E6E6E6] bg-white px-6 py-5 flex items-center justify-center">
                    {remoteImages.length > 0 ? (
                      <RemoteImagesPreview images={remoteImages} />
                    ) : (
                      <ProductImage imageUrl={null} />
                    )}
                  </div>
                ) : (
                  <div className="w-full">
                    <div className="rounded-md border bg-white px-6 py-5">
                      <ProductImagesCard
                        value={localImages}
                        onChange={setLocalImages}
                        readonly={false}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* RIGHT */}
              <div className="flex-1 min-w-0">{renderForm()}</div>
            </div>
          </div>

          {/* FOOTER */}
          {currentMode === "edit" && (
            <div className="flex justify-center gap-4 px-6 py-3 border-t">
              <>
                <button
                  className="w-24 px-4 py-[6px] bg-white border border-[#CFCFCF] text-base hover:bg-[#F1F1F1] text-black rounded-md"
                  onClick={onClose}
                >
                  Cancel
                </button>
                <button
                  className="w-24 px-4 py-[6px] bg-[#005AA7] hover:bg-[#084072] text-white text-base rounded-md"
                  onClick={onSave}
                >
                  Save
                </button>
              </>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default ProductModal;
