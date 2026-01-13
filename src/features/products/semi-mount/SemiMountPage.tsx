import React, { useMemo, useState } from "react";

import type {
  BaseProductForm,
  SelectOption,
  PrimaryStoneForm,
  AdditionalStoneForm,
  AccessoriesForm,
} from "../../../types/product";
import ProductImagesCard from "../../products/product-master/components/ProductImagesCard";
import ProductInfoCard from "../../products/product-master/components/ProductInfoCard";
import PrimaryStoneCard from "./components/PrimaryStoneCard";
import AccessoriesCard from "./components/AccessoriesCard";

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

const emptyAccessories = (): AccessoriesForm => ({
  active: true,
  code: "",
  productName: "",
  weight: "",
  productSize: "",
  metal: "",
  description: "",
  weightUnit: "cts",
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
  const [form, setForm] = useState<BaseProductForm>(emptyForm);
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

  // const addAdditionalStone = () => {
  //   setForm((s) => ({
  //     ...s,
  //     additionalStones: [...s.additionalStones, emptyAdditionalStone()],
  //   }));
  // };

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
  const patchForm = (patch: Partial<BaseProductForm>) => {
    setForm((s) => ({ ...s, ...patch }));
  };

  const patchPrimaryStone = (patch: Partial<PrimaryStoneForm>) => {
    setForm((s) => ({
      ...s,
      primaryStone: { ...s.primaryStone, ...patch },
    }));
  };

  return (
    <div className="w-full h-full flex flex-col min-h-0">
      <div className="w-full max-w-[1690px] mx-auto flex flex-col min-h-0">
        <h2 className="text-2xl font-normal text-[#06284B] mb-[15px]">
          Semi-Mount
        </h2>
        {/* MAIN CANVAS */}
        <div className="flex-1 min-h-0 rounded-md bg-[#FAFAFA] shadow-md flex flex-col overflow-hidden">
          {/* CONTENT */}
          <div className="flex-1 overflow-y-auto px-10 py-8 hide-scrollbar">
            <div className="grid grid-cols-[minmax(320px,30%)_1fr] gap-6 items-start">
              {/* LEFT : Image */}
              <div className="rounded-2xl border border-[#E6E6E6] bg-white px-6 py-5">
                <ProductImagesCard
                  max={9}
                  value={images}
                  onChange={setImages}
                />
              </div>

              {/* RIGHT : Form (scroll) */}
              <div className="h-full min-h-0">
                <div className="flex flex-col gap-6">
                  <ProductInfoCard
                    value={form}
                    onChange={patchForm}
                    itemTypeOptions={itemTypeOptions}
                    metalOptions={metalOptions}
                  />

                  {/* <div className="grid grid-cols-[minmax(0,2fr),minmax(0,1.2fr)] gap-6"> */}
                  <PrimaryStoneCard
                    value={form.primaryStone}
                    additionalStones={form.additionalStones}
                    onChangePrimary={patchPrimaryStone}
                    onAddStone={() =>
                      setForm((s) => ({
                        ...s,
                        additionalStones: [
                          ...s.additionalStones,
                          {
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
                          },
                        ],
                      }))
                    }
                    onChangeStone={updateAdditionalStone}
                    onRemoveStone={removeAdditionalStone}
                    stoneNameOptions={stoneNameOptions}
                    shapeOptions={shapeOptions}
                    cuttingOptions={cuttingOptions}
                    qualityOptions={qualityOptions}
                    clarityOptions={clarityOptions}
                  />

                  <AccessoriesCard
                    value={form.accessories}
                    onChange={(patch) =>
                      patchForm({
                        accessories: { ...form.accessories, ...patch },
                      })
                    }
                    options={accessoriesOptions}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* FOOTER */}
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

export default SemiMountPage;
