import React, { useMemo, useState } from "react";
import ProductImagesCard from "../../../component/template/media/ProductImagesCard";
import OthersInfoCard from "./components/OthersInfoCard";
import { useParams } from "react-router-dom";
import { createOthers, updateOthers } from "../../../services/product";
import type { OthersForm } from "../../../types/product/form";

const emptyForm: OthersForm = {
  active: true,
  productId: "",
  productName: "",
  code: "",
  productSize: "",
  weight: "",
  unit: "g",
  description: "",
};

const OthersPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);
  const [form, setForm] = useState<OthersForm>(emptyForm);
  const [images, setImages] = useState<File[]>([]);

  const canSave = useMemo(() => {
    return (
      form.productName.trim() !== "" &&
      form.code.trim() !== "" &&
      form.productSize.trim() !== "" &&
      form.weight.trim() !== ""
    );
  }, [form]);

  // helpers สำหรับ patch state
  const patchForm = (patch: Partial<OthersForm>) => {
    setForm((s) => ({ ...s, ...patch }));
  };

  const handleSave = async () => {
    try {
      const formData = new FormData();

      formData.append("product_name", form.productName.trim());
      formData.append("code", form.code.trim());
      formData.append("category", "others");
      formData.append("size", form.productSize);
      formData.append("weight", form.weight);

      if (form.description) formData.append("description", form.description);

      formData.append("unit", form.unit);

      images.forEach((img) => formData.append("files", img));

      if (isEdit && id) {
        await updateOthers(id, formData);
      } else {
        await createOthers(formData);
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
          Others
        </h2>

        {/* การ์ดสีเทา ต้องกินพื้นที่ที่เหลือ */}
        <div className="flex-1 rounded-md bg-[#FAFAFA] shadow-md flex flex-col">
          {/* CONTENT */}
          <div className="flex-1 px-10 py-8 flex gap-6">
            {/* LEFT: IMAGE (สูงตาม content) */}
            <div className="w-[30%] min-w-[320px]">
              <div className="rounded-md border bg-white px-6 py-5">
                <ProductImagesCard
                  max={9}
                  value={images}
                  onChange={setImages}
                />
              </div>
            </div>

            {/* RIGHT: การ์ดขาว (สูงเต็มการ์ดเทา) */}
            <div className="flex-1">
              <OthersInfoCard
                value={form}
                onChange={patchForm}
                mode={isEdit ? "edit" : "create"}
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

export default OthersPage;
