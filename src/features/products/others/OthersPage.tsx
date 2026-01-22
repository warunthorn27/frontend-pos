import React, { useMemo, useState } from "react";
import ProductImagesCard from "../../../component/template/media/ProductImagesCard";
import OthersInfoCard from "./components/OthersInfoCard";
import { useParams } from "react-router-dom";
import { createOthers, updateOthers } from "../../../services/product";
import type { OthersForm } from "../../../types/product/form";

const emptyForm: OthersForm = {
  active: true,
  productName: "",
  code: "",
  productSize: "",
  weight: "0.00",
  weightUnit: "g",
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
      formData.append("product_size", form.productSize);
      formData.append("weight", form.weight);

      if (form.description) formData.append("description", form.description);

      formData.append("unit", form.weightUnit);

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
              <div className="rounded-2xl border bg-white px-6 py-5">
                <ProductImagesCard
                  max={9}
                  value={images}
                  onChange={setImages}
                />
              </div>
            </div>

            {/* RIGHT: การ์ดขาว (สูงเต็มการ์ดเทา) */}
            <div className="flex-1">
              <OthersInfoCard value={form} onChange={patchForm} />
            </div>
          </div>

          {/* Footer */}
          <div className="py-4 border-t border-[#E6E6E6] flex justify-center gap-4">
            <button
              type="button"
              className="px-7 py-2 rounded-md bg-[#FF383C] text-[13px] font-normal hover:bg-[#E71010] text-white"
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

export default OthersPage;
