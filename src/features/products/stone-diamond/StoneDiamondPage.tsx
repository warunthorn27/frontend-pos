import React, { useMemo, useState } from "react";

import type { StoneDiamondForm, SelectOption } from "../../../types/product";

import StoneDiamondInfoCard from "./components/StoneDiamondInfoCard";
import StoneDiamondImagesCard from "./components/StoneDiamondImagesCard";

const stoneNameOptions: SelectOption[] = [{ label: "Select", value: "" }];
const qualityOptions: SelectOption[] = [{ label: "Select", value: "" }];
const shapeOptions: SelectOption[] = [{ label: "Select", value: "" }];
const cuttingOptions: SelectOption[] = [{ label: "Select", value: "" }];
const clarityOptions: SelectOption[] = [{ label: "Select", value: "" }];

// const emptyPrimaryStone = (): PrimaryStoneForm => ({
//   stoneName: "",
//   shape: "",
//   size: "",
//   weightCts: "",
//   weightUnit: "cts",
//   color: "",
//   cutting: "",
//   quality: "",
//   clarity: "",
// });

// const emptyAdditionalStone = (): AdditionalStoneForm => ({
//   stoneName: "",
//   shape: "",
//   size: "",
//   weightCts: "",
//   weightUnit: "cts",
//   color: "",
//   cutting: "",
//   quality: "",
//   clarity: "",
//   qty: "",
// });

const emptyStoneDiamondForm = (): StoneDiamondForm => ({
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
  weightUnit: "cts",
  nwt: "",
});

const ProductMasterPage: React.FC = () => {
  const [form, setForm] = useState<StoneDiamondForm>(emptyStoneDiamondForm);
  const [images, setImages] = useState<File[]>([]);

  const canSave = useMemo(() => {
    return (
      form.productName.trim() !== "" &&
      form.code.trim() !== "" &&
      form.description.trim() !== "" &&
      form.stoneName.trim() !== "" &&
      form.shape.trim() !== "" &&
      form.size.trim() !== "" &&
      form.weight.trim() !== "" &&
      form.color.trim() !== "" &&
      form.cutting.trim() !== "" &&
      form.quality.trim() !== "" &&
      form.clarity.trim() !== ""
    );
  }, [form]);

  // helpers สำหรับ patch state
  const patchForm = (patch: Partial<StoneDiamondForm>) => {
    setForm((s) => ({ ...s, ...patch }));
  };

  return (
    <div className="w-full">
      <div className="w-[1630px] h-[848px] mx-auto">
        <h2 className="text-2xl font-normal text-[#06284B] mb-[15px]">
          Stone / Diamond
        </h2>

        {/* MAIN CANVAS */}
        <div className="w-[1630px] h-[848px] mx-auto rounded-md bg-[#FAFAFA] shadow-md px-10 py-8 overflow-y-auto hide-scrollbar">
          {/* TOP ROW: images + product info */}
          <div className="grid grid-cols-[464px,1fr] gap-6 items-start">
            <div className="rounded-2xl border border-[#E6E6E6] bg-white px-6 py-5">
              <StoneDiamondImagesCard max={9} value={images} onChange={setImages} />
            </div>

            <StoneDiamondInfoCard
              value={form}
              onChange={patchForm}
              stoneNameOptions={stoneNameOptions}
              qualityOptions={qualityOptions}
              shapeOptions={shapeOptions}
              cuttingOptions={cuttingOptions}
              clarityOptions={clarityOptions}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="mt-10 flex justify-center gap-4">
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

export default ProductMasterPage;
