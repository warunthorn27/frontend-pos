import React from "react";
import type {
  BaseProductForm,
  PrimaryStoneForm,
  AdditionalStoneForm,
//   AccessoriesForm,
} from "../../types/product/form";
import type { SelectOption } from "../../types/shared/select";
import ProductImagesCard from "./media/ProductImagesCard";
import PrimaryStoneSection from "./sections/PrimaryStoneSection";
import AccessoriesSection from "./sections/AccessoriesSection";
import ProductInfoSection from "./sections/ProductInfoSection";

type Props = {
  title: string;

  // state
  form: BaseProductForm;
  images: File[];

  // handlers
  onChangeForm: (patch: Partial<BaseProductForm>) => void;
  onChangePrimaryStone: (patch: Partial<PrimaryStoneForm>) => void;
  onAddAdditionalStone: () => void;
  onChangeAdditionalStone: (
    index: number,
    patch: Partial<AdditionalStoneForm>,
  ) => void;
  onRemoveAdditionalStone: (index: number) => void;

  onChangeImages: (files: File[]) => void;

  // master data
  itemTypeOptions: SelectOption[];
  metalOptions: SelectOption[];
  stoneNameOptions: SelectOption[];
  shapeOptions: SelectOption[];
  cuttingOptions: SelectOption[];
  qualityOptions: SelectOption[];
  clarityOptions: SelectOption[];
  accessoriesOptions: SelectOption[];

  // footer
  canSave: boolean;
  onCancel: () => void;
  onSave: () => void;
};

const ProductFormTemplate: React.FC<Props> = ({
  title,
  form,
  images,
  onChangeForm,
  onChangePrimaryStone,
  onAddAdditionalStone,
  onChangeAdditionalStone,
  onRemoveAdditionalStone,
  onChangeImages,
  itemTypeOptions,
  metalOptions,
  stoneNameOptions,
  shapeOptions,
  cuttingOptions,
  qualityOptions,
  clarityOptions,
  accessoriesOptions,
  canSave,
  onCancel,
  onSave,
}) => {
  return (
    <div className="w-full h-full flex flex-col min-h-0">
      <div className="w-full max-w-[1690px] mx-auto flex flex-col min-h-0">
        <h2 className="text-2xl font-normal text-[#06284B] mb-[15px]">
          {title}
        </h2>

        <div className="flex-1 min-h-0 rounded-md bg-[#FAFAFA] shadow-md flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto px-10 py-8 hide-scrollbar">
            <div className="grid grid-cols-[minmax(320px,30%)_1fr] gap-6 items-start">
              {/* LEFT */}
              <div className="rounded-2xl border border-[#E6E6E6] bg-white px-6 py-5">
                <ProductImagesCard
                  max={9}
                  value={images}
                  onChange={onChangeImages}
                />
              </div>

              {/* RIGHT */}
              <div className="h-full min-h-0">
                <div className="flex flex-col gap-6">
                  <ProductInfoSection
                    value={form}
                    onChange={onChangeForm}
                    itemTypeOptions={itemTypeOptions}
                    metalOptions={metalOptions}
                    readonly={false}
                  />

                  <PrimaryStoneSection
                    value={form.primaryStone}
                    additionalStones={form.additionalStones}
                    onChangePrimary={onChangePrimaryStone}
                    onAddStone={onAddAdditionalStone}
                    onChangeStone={onChangeAdditionalStone}
                    onRemoveStone={onRemoveAdditionalStone}
                    stoneNameOptions={stoneNameOptions}
                    shapeOptions={shapeOptions}
                    cuttingOptions={cuttingOptions}
                    qualityOptions={qualityOptions}
                    clarityOptions={clarityOptions}
                  />

                  <AccessoriesSection
                    value={form.accessories}
                    onChange={(patch) =>
                      onChangeForm({
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
              onClick={onCancel}
            >
              Cancel
            </button>

            <button
              type="button"
              disabled={!canSave}
              onClick={onSave}
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

export default ProductFormTemplate;
