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
  weightUnit: "cts",
  nwt: "",
});

const StoneDiamondPage: React.FC = () => {
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
              <div className="rounded-2xl border border-[#E6E6E6] bg-white px-6 py-5">
                <StoneDiamondImagesCard
                  max={9}
                  value={images}
                  onChange={setImages}
                />
              </div>

              <div className="w-full h-full flex flex-col min-h-0">
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
