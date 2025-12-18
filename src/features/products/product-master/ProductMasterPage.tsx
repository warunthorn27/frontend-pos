import React, { useMemo, useState } from "react";

import type {
  ProductMasterForm,
  SelectOption,
  PrimaryStoneForm,
  AdditionalStoneForm,
} from "../../../types/product";

import ProductImagesCard from "../../products/product-master/components/ProductImagesCard";
import ProductInfoCard from "../../products/product-master/components/ProductInfoCard";
import PrimaryStoneCard from "../../products/product-master/components/PrimaryStoneCard";
import AccessoriesCard from "../../products/product-master/components/AccessoriesCard";
import AdditionalStoneSection from "../../products/product-master/components/AdditionalStoneSection";

const itemTypeOptions: SelectOption[] = [{ label: "Select", value: "" }];
const metalOptions: SelectOption[] = [{ label: "Select", value: "" }];

const stoneNameOptions: SelectOption[] = [{ label: "Select", value: "" }];
const shapeOptions: SelectOption[] = [{ label: "Select", value: "" }];
const cuttingOptions: SelectOption[] = [{ label: "Select", value: "" }];
const qualityOptions: SelectOption[] = [{ label: "Select", value: "" }];
const clarityOptions: SelectOption[] = [{ label: "Select", value: "" }];

const accessoriesOptions: SelectOption[] = [
  { label: "Choose Code", value: "" },
];

const emptyPrimaryStone = (): PrimaryStoneForm => ({
  stoneName: "",
  shape: "",
  size: "",
  weightCts: "",
  weightUnit: "cts",
  color: "",
  cutting: "",
  quality: "",
  clarity: "",
});

const emptyAdditionalStone = (): AdditionalStoneForm => ({
  stoneName: "",
  shape: "",
  size: "",
  weightCts: "",
  weightUnit: "cts",
  color: "",
  cutting: "",
  quality: "",
  clarity: "",
  qty: "",
});

const emptyForm: ProductMasterForm = {
  productName: "",
  itemType: "",
  productSize: "",

  code: "",
  metal: "",
  metalColor: "",

  description: "",

  gwt: "0.00",
  nwt: "0.00",

  accessoriesCode: "",

  primaryStone: emptyPrimaryStone(),
  additionalStones: [],
};

const ProductMasterPage: React.FC = () => {
  const [form, setForm] = useState<ProductMasterForm>(emptyForm);
  const [images, setImages] = useState<File[]>([]);

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

  const addAdditionalStone = () => {
    setForm((s) => ({
      ...s,
      additionalStones: [...s.additionalStones, emptyAdditionalStone()],
    }));
  };

  const updateAdditionalStone = (
    index: number,
    patch: Partial<AdditionalStoneForm>
  ) => {
    setForm((s) => ({
      ...s,
      additionalStones: s.additionalStones.map((st, i) =>
        i === index ? { ...st, ...patch } : st
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
  const patchForm = (patch: Partial<ProductMasterForm>) => {
    setForm((s) => ({ ...s, ...patch }));
  };

  const patchPrimaryStone = (patch: Partial<PrimaryStoneForm>) => {
    setForm((s) => ({
      ...s,
      primaryStone: { ...s.primaryStone, ...patch },
    }));
  };

  return (
    <div className="w-full">
      <div className="w-[1630px] h-[848px] mx-auto">
        <h2 className="text-2xl font-normal text-[#06284B] mb-[15px]">
          Product Master
        </h2>

        {/* MAIN CANVAS */}
        <div className="w-[1630px] h-[848px] mx-auto rounded-md bg-[#FAFAFA] shadow-md px-10 py-8 overflow-y-auto hide-scrollbar">
          {/* TOP ROW: images + product info */}
          <div className="grid grid-cols-[464px,1fr] gap-6 items-stretch">
            <div className="rounded-2xl border border-[#E6E6E6] bg-white px-6 py-5">
              <ProductImagesCard max={9} value={images} onChange={setImages} />
            </div>

            <ProductInfoCard
              value={form}
              onChange={patchForm}
              itemTypeOptions={itemTypeOptions}
              metalOptions={metalOptions}
            />
          </div>

          {/* BOTTOM */}
          <div className="mt-6">
            {/* ROW 1: Primary Stone + Accessories */}
            <div className="grid grid-cols-[minmax(0,2fr),minmax(0,1.2fr)] gap-6 items-stretch">
              <PrimaryStoneCard
                value={form.primaryStone}
                onChange={patchPrimaryStone}
                stoneNameOptions={stoneNameOptions}
                shapeOptions={shapeOptions}
                cuttingOptions={cuttingOptions}
                qualityOptions={qualityOptions}
                clarityOptions={clarityOptions}
                weightCts={""}
                weightUnit={"cts"}
              />

              <AccessoriesCard
                value={form.accessoriesCode}
                onChange={(v) => patchForm({ accessoriesCode: v })}
                options={accessoriesOptions}
                weightValue={""}
                onWeightChange={() => {}}
              />
            </div>

            {/* ROW 2+: AdditionalStone list + Add button */}
            <AdditionalStoneSection
              stones={form.additionalStones}
              onAdd={addAdditionalStone}
              onChangeStone={updateAdditionalStone}
              onRemoveStone={removeAdditionalStone}
              stoneNameOptions={stoneNameOptions}
              shapeOptions={shapeOptions}
              cuttingOptions={cuttingOptions}
              qualityOptions={qualityOptions}
              clarityOptions={clarityOptions}
              weightCts={""}
              weightUnit={"cts"}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="mt-10 flex justify-center gap-4">
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
