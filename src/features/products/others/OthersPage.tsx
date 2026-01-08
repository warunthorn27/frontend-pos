import React, { useMemo, useState } from "react";
import type { OthersForm } from "../../../types/product";
import ProductImagesCard from "./components/OthersImagesCard";
import OthersInfoCard from "./components/OthersInfoCard";

const emptyStoneDiamondForm = (): OthersForm => ({
  productName: "",
  code: "",
  productSize: "",
  weight: "0.00",
  weightUnit: "g",
  description: "",
});

const OthersPage: React.FC = () => {
  const [form, setForm] = useState<OthersForm>(emptyStoneDiamondForm);
  const [images, setImages] = useState<File[]>([]);

  const canSave = useMemo(() => {
    return (
      form.productName.trim() !== "" &&
      form.code.trim() !== "" &&
      form.productSize.trim() !== "" &&
      form.weight.trim() !== "" &&
      form.description.trim() !== ""
    );
  }, [form]);

  // helpers สำหรับ patch state
  const patchForm = (patch: Partial<OthersForm>) => {
    setForm((s) => ({ ...s, ...patch }));
  };

  return (
    <div className="w-full">
      <div className="w-full max-w-[1600px] mx-auto h-full flex flex-col min-h-0">
        <h2 className="text-2xl font-normal text-[#06284B] mb-[15px]">
          Others
        </h2>

        {/* MAIN CANVAS */}
        <div className="flex-1 min-h-[700px] rounded-md bg-[#FAFAFA] shadow-md px-10 py-8 flex">
          {/* TOP ROW: images + product info */}
          <div className="flex-1 min-h-0 grid grid-cols-[464px,1fr] gap-6 items-stretch">
            <div className="rounded-2xl border border-[#E6E6E6] bg-white px-6 py-5 self-start">
              <ProductImagesCard max={9} value={images} onChange={setImages} />
            </div>

            <OthersInfoCard value={form} onChange={patchForm} />
          </div>
        </div>

        {/* Footer */}
        <div className="mt-10 flex justify-center gap-4 shrink-0">
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
  );
};

export default OthersPage;
