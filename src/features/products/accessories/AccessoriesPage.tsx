import React, { useMemo, useState } from "react";
import AccessoriesInfoCard from "./components/AccessoriesInfoCard";
import { useProductMasters } from "../hooks/useProductMasters";
import { createAccessory, updateAccessory } from "../../../services/product";
import { useParams } from "react-router-dom";
import type { AccessoriesForm } from "../../../types/product/form";
import ProductImagesCard from "../../../component/template/media/ProductImagesCard";
import { isObjectId } from "../../../utils/isObjectId";
import { createMaster } from "../../../services/master";
import { useToast } from "../../../component/ui/toast/useToast";

const emptyForm: AccessoriesForm = {
  active: true,
  productId: "",
  productName: "",
  code: "",
  productSize: "",
  weight: "",
  metal: "",
  unit: "g",
  description: "",
};

const AccessoriesPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);
  const [form, setForm] = useState<AccessoriesForm>(emptyForm);
  const [images, setImages] = useState<File[]>([]);
  const { metalOptions } = useProductMasters();

  const toast = useToast();

  const canSave = useMemo(() => {
    return (
      form.productName.trim() !== "" &&
      form.code.trim() !== "" &&
      form.productSize.trim() !== "" &&
      form.weight.trim() !== "" &&
      form.metal.trim() !== ""
    );
  }, [form]);

  // helpers สำหรับ patch state
  const patchForm = (patch: Partial<AccessoriesForm>) => {
    setForm((s) => ({ ...s, ...patch }));
  };

  const handleSave = async () => {
    try {
      const formData = new FormData();

      formData.append("product_name", form.productName.trim());
      formData.append("code", form.code.trim());
      formData.append("category", "accessory");
      formData.append("size", form.productSize);
      let metalId = form.metal;

      if (!isObjectId(form.metal)) {
        const name = form.metal.trim();
        if (name) {
          const res = await createMaster("metal", name);
          metalId = res.data._id;
        }
      }

      formData.append("metal", metalId);

      formData.append("weight", form.weight);

      if (form.description) formData.append("description", form.description);

      formData.append("unit", form.unit);

      images.forEach((img) => formData.append("files", img));

      if (isEdit && id) {
        await updateAccessory(id, formData);
        toast.success("Accessory updated successfully.");
      } else {
        await createAccessory(formData);
        toast.success("Accessory created successfully.");
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
    <div className="w-full h-full flex flex-col min-h-0">
      <div className="w-full h-full flex flex-col">
        <h2 className="text-2xl font-normal text-[#06284B] mb-[15px]">
          Accessories
        </h2>

        {/* MAIN CANVAS */}
        <div className="flex-1 rounded-md bg-[#FAFAFA] shadow-md flex flex-col">
          {/* CONTENT */}
          <div className="flex-1 px-10 py-8 flex gap-6">
            <div className="w-[30%] min-w-[320px]">
              {/* LEFT : Image */}
              <div className="rounded-md border bg-white px-6 py-5">
                <ProductImagesCard
                  max={9}
                  value={images}
                  onChange={setImages}
                />
              </div>
            </div>

            <div className="flex-1">
              <AccessoriesInfoCard
                value={form}
                onChange={patchForm}
                mode={isEdit ? "edit" : "create"}
                metalOptions={metalOptions}
              />
            </div>
          </div>

          {/* Footer */}
          <div className="py-4 border-t border-[#E6E6E6] flex justify-center gap-4">
            <button
              type="button"
              className="w-24 px-4 py-[6px] bg-white border border-[#CFCFCF] text-base hover:bg-[#F1F1F1] text-black rounded-md"
              onClick={() => {
                setForm(emptyForm);
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
                "w-24 h-[38px] px-4 py-[6px] rounded-md text-base font-normal",
                canSave
                  ? "bg-[#005AA7] hover:bg-[#084072] text-white cursor-pointer"
                  : "bg-[#BABABA] text-[#6B6B6B] cursor-not-allowed",
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

export default AccessoriesPage;
