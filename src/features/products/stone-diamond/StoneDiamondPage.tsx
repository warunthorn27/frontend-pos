import React, { useMemo, useState } from "react";
import type { StoneDiamondForm } from "../../../types/product/form";
import StoneDiamondInfoCard from "./components/StoneDiamondInfoCard";
import { useParams } from "react-router-dom";
import { useProductMasters } from "../hooks/useProductMasters";
import {
  createStoneDiamond,
  updateStoneDiamond,
} from "../../../services/product";
import ProductImagesCard from "../../../component/template/media/ProductImagesCard";

const emptyStoneDiamondForm: StoneDiamondForm = {
  active: true,
  productName: "",
  code: "",
  description: "",
  stoneName: "",
  shape: "",
  size: "",
  weight: "",
  color: "",
  cutting: "",
  quality: "",
  clarity: "",
  unit: "g",
};

const StoneDiamondPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);
  const [form, setForm] = useState<StoneDiamondForm>(emptyStoneDiamondForm);
  const [images, setImages] = useState<File[]>([]);

  const {
    stoneNameOptions,
    shapeOptions,
    cuttingOptions,
    qualityOptions,
    clarityOptions,
  } = useProductMasters();

  /* ---------- loadProduct ---------- */

  const patchForm = (patch: Partial<StoneDiamondForm>) => {
    setForm((s) => ({ ...s, ...patch }));
  };

  const canSave = useMemo(() => {
    return (
      form.productName.trim() !== "" &&
      form.code.trim() !== "" &&
      form.description.trim() !== "" &&
      form.stoneName.trim() !== "" &&
      form.shape.trim() !== "" &&
      form.size.trim() !== "" &&
      form.color.trim() !== "" &&
      form.cutting.trim() !== "" &&
      form.quality.trim() !== "" &&
      form.clarity.trim() !== "" &&
      form.weight.trim() !== "" &&
      form.unit.trim() !== ""
    );
  }, [form]);

  const handleSave = async () => {
    try {
      const formData = new FormData();

      formData.append("product_name", form.productName.trim());
      formData.append("code", form.code.trim());
      formData.append("category", "stone");
      formData.append("stone_name", form.stoneName);
      formData.append("shape", form.shape);
      formData.append("size", form.size);

      if (form.color) formData.append("color", form.color);
      if (form.cutting) formData.append("cutting", form.cutting);
      if (form.quality) formData.append("quality", form.quality);
      if (form.clarity) formData.append("clarity", form.clarity);

      if (form.description) {
        formData.append("description", form.description);
      }

      formData.append("weight", form.weight);
      formData.append("unit", form.unit);
      images.forEach((img) => formData.append("files", img));

      if (isEdit && id) {
        await updateStoneDiamond(id, formData);
      } else {
        await createStoneDiamond(formData);
      }

      // reset form
      setForm(emptyStoneDiamondForm);
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
    <div className="w-full h-full flex flex-col min-h-0">
      <div className="w-full max-w-[1690px] mx-auto flex flex-col min-h-0">
        <h2 className="text-2xl font-normal text-[#06284B] mb-[15px]">
          Stone / Diamond
        </h2>

        {/* MAIN CANVAS */}
        <div className="flex-1 min-h-0 rounded-md bg-[#FAFAFA] shadow-md flex flex-col overflow-hidden">
          {/* CONTENT */}
          <div className="flex-1 overflow-y-auto px-10 py-8 hide-scrollbar">
            <div className="grid grid-cols-[minmax(320px,30%)_1fr] gap-6 items-start">
              {/* LEFT : Image */}
              <div className="rounded-md border border-[#E6E6E6] bg-white px-6 py-5">
                <ProductImagesCard
                  max={9}
                  value={images}
                  onChange={setImages}
                />
              </div>

              <div className="w-full h-full flex flex-col min-h-0">
                <StoneDiamondInfoCard
                  value={form}
                  mode={isEdit ? "edit" : "create"}
                  onChange={patchForm}
                  stoneNameOptions={stoneNameOptions}
                  qualityOptions={qualityOptions}
                  shapeOptions={shapeOptions}
                  cuttingOptions={cuttingOptions}
                  clarityOptions={clarityOptions}
                />
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="py-4 border-t border-[#E6E6E6] flex justify-center gap-4">
            <button
              type="button"
              className="px-7 py-2 rounded-md bg-[#FF383C] text-[13px] font-normal hover:bg-[#E71010] text-white"
              onClick={() => {
                setForm(emptyStoneDiamondForm);
                setImages([]);
              }}
            >
              Cancel
            </button>

            <button
              type="button"
              disabled={!canSave}
              onClick={handleSave}
              className={[
                "px-8 py-2 rounded-md text-[13px] font-normal",
                canSave
                  ? "bg-[#34C759] hover:bg-[#24913F] text-white"
                  : "bg-[#CFCFCF] text-white cursor-not-allowed",
              ].join(" ")}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoneDiamondPage;
