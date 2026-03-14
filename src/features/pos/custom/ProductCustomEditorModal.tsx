import React, { useEffect, useState } from "react";
import { fetchMasterOptions } from "../../../services/master";
import { MASTER_TYPES } from "../../../types/master";
import type { SelectOption } from "../../../types/shared/select";
import type { CustomSessionItem } from "../../../types/pos/custom";
import {
  saveCustomProduct,
  getCustomSessionDetail,
} from "../../../services/pos/posCustom";
import CloseIcon from "../../../assets/svg/close.svg?react";
import type { BaseProductForm } from "../../../types/product/form";
import {
  mapBaseProductFormToCustomSpec,
  mapCustomSpecToBaseProductForm,
} from "../../../component/mappers/mapCustomSpecToBaseProductForm";
import { fetchProductById } from "../../../services/product";
import ProductImage from "../../products/product-list/components/ProductImage";

interface ProductCustomEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: CustomSessionItem;
  customerId: string;
  onSaveSuccess: () => void;
}

interface InputFieldProps<T extends string | number> {
  label: string;
  value: T | null | undefined;
  onChange: (value: T) => void;
  placeholder?: string;
  type?: string;
  unit?: string;
  fullWidth?: boolean;
}

interface SelectFieldProps {
  label: string;
  value: string | number | null | undefined;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
}

// interface RawStoneData {
//   name_id?: string;
//   shape_id?: string;
//   cutting_id?: string;
//   quality_id?: string;
//   clarity_id?: string;
//   color?: string;
//   size?: string;
//   weight?: number;
// }

// interface RawAdditionalStone {
//   stone_name_id?: string;
//   stone_shape_id?: string;
//   stone_color?: string;
//   stone_size?: string;
//   s_weight?: number;
//   cutting?: string;
//   quality?: string;
//   clarity?: string;
// }

// interface RawData {
//   stone?: RawStoneData;
//   item_type_id?: string;
//   metal_id?: string;
//   metal_color?: string;
//   description?: string;
//   nwt?: number;
//   gwt?: number;
//   size?: string;
//   additional_stones?: RawAdditionalStone[];
// }

// interface CustomDetailResponse {
//   cover_image?: string;
//   image?: string;
//   product_name?: string;
//   size?: string;
//   metal_color?: string;
//   custom_spec?: CustomSpec;
//   raw_data?: RawData;
// }

/* ── Components outside to prevent re-creation ───────────────── */
const InputField = <T extends string | number>({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  unit,
  fullWidth = false,
}: InputFieldProps<T>) => (
  <div className={`flex items-center gap-4 ${fullWidth ? "w-full" : "w-full"}`}>
    <label className="text-base text-[#2A2A2A] w-[140px] flex-shrink-0">
      {label}
    </label>
    <div className="relative flex-1">
      <input
        type={type}
        value={value ?? ""}
        onChange={(e) => {
          const val =
            type === "number"
              ? parseFloat(e.target.value) || 0
              : e.target.value;
          onChange(val as T);
        }}
        placeholder={placeholder}
        className={`w-full border border-[#CFCFCF] rounded-md px-3 h-10 text-sm focus:border-[#2E5B9A] outline-none transition-all ${unit ? "pr-8" : ""}`}
      />
      {unit && (
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[13px] text-gray-400">
          {unit}
        </span>
      )}
    </div>
  </div>
);

const SelectField = ({
  label,
  value,
  onChange,
  options,
  placeholder,
}: SelectFieldProps) => (
  <div className="flex items-center gap-4 w-full">
    <label className="text-base text-[#2A2A2A] w-[140px] flex-shrink-0">
      {label}
    </label>
    <select
      value={value ?? ""}
      onChange={(e) => onChange(e.target.value)}
      className="w-full border border-[#CFCFCF] rounded-md px-3 h-10 text-sm focus:border-[#2E5B9A] outline-none transition-all bg-white"
    >
      <option value="">{placeholder || "Select..."}</option>
      {(options || []).map((opt: SelectOption) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  </div>
);

const ProductCustomEditorModal: React.FC<ProductCustomEditorModalProps> = ({
  isOpen,
  onClose,
  item,
  customerId,
  onSaveSuccess,
}) => {
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);

  // Combine master options to reduce multiple state updates
  const [masterOptions, setMasterOptions] = useState({
    itemTypes: [] as SelectOption[],
    metals: [] as SelectOption[],
    metalColors: [] as SelectOption[],
    stoneNames: [] as SelectOption[],
    shapes: [] as SelectOption[],
    cuttings: [] as SelectOption[],
    qualities: [] as SelectOption[],
    clarities: [] as SelectOption[],
  });

  const [displayImage, setDisplayImage] = useState<string | null>(null);
  const [form, setForm] = useState<BaseProductForm | null>(null);
  const [productCategory, setProductCategory] = useState<string>("");

  useEffect(() => {
    if (isOpen) {
      const initData = async () => {
        setFetching(true);
        try {
          // Fetch detail data & master data concurrently
          const [sessionDetail, productRes, it, m, mc, sn, sh, ct, q, cl] =
            await Promise.all([
              getCustomSessionDetail(item.session_id),
              fetchProductById(item.product_id),
              fetchMasterOptions(MASTER_TYPES.itemType),
              fetchMasterOptions(MASTER_TYPES.metal),
              fetchMasterOptions(MASTER_TYPES.metalColor),
              fetchMasterOptions(MASTER_TYPES.stoneName),
              fetchMasterOptions(MASTER_TYPES.shape),
              fetchMasterOptions(MASTER_TYPES.cutting),
              fetchMasterOptions(MASTER_TYPES.quality),
              fetchMasterOptions(MASTER_TYPES.clarity),
            ]);

          setDisplayImage(
            productRes.data?.file?.[0] ??
              sessionDetail.image ??
              item.image ??
              null,
          );

          // Update spec
          // const hasCustomSpec =
          //   freshItem.custom_spec &&
          //   Object.keys(freshItem.custom_spec).length > 0;

          const product = productRes.data;
          setProductCategory(product.product_category);

          const baseForm: BaseProductForm = {
            active: true,
            productId: product._id,
            productName: product.product_name,
            code: product.code,
            description: product.description ?? "",

            itemType: product.item_type?._id ?? "",
            productSize: product.product_size ?? "",

            metal: product.metal?._id ?? "",
            metalColor: product.metal_color?._id ?? "",

            gwt: product.gross_weight ? String(product.gross_weight) : "",
            nwt: product.net_weight ? String(product.net_weight) : "",
            unit: product.unit ?? "g",

            primaryStone: {
              stoneName: product.primary_stone?.stone_name?._id ?? "",
              shape: product.primary_stone?.shape?._id ?? "",
              size: product.primary_stone?.size ?? "",
              weight: product.primary_stone?.weight
                ? String(product.primary_stone.weight)
                : "",
              unit: product.primary_stone?.unit ?? "cts",
              color: product.primary_stone?.color ?? "",
              cutting: product.primary_stone?.cutting?._id ?? "",
              quality: product.primary_stone?.quality?._id ?? "",
              clarity: product.primary_stone?.clarity?._id ?? "",
            },

            additionalStones:
              product.additional_stones?.map((s) => ({
                stoneName: s.stone_name?._id ?? "",
                shape: s.shape?._id ?? "",
                size: s.size ?? "",
                weight: s.weight ? String(s.weight) : "",
                unit: s.unit ?? "cts",
                color: s.color ?? "",
                cutting: s.cutting?._id ?? "",
                quality: s.quality?._id ?? "",
                clarity: s.clarity?._id ?? "",
              })) ?? [],

            accessories: {
              active: true,
              productId: "",
              productName: "",
              code: "",
              productSize: "",
              metal: "",
              weight: "",
              unit: "g",
              description: "",
            },
          };

          let mergedForm = baseForm;

          if (sessionDetail.custom_spec) {
            const customForm = mapCustomSpecToBaseProductForm(
              sessionDetail.custom_spec,
            );

            mergedForm = {
              ...baseForm,
              ...customForm,
            };
          }

          setForm(mergedForm);
          // Single update for all master options
          setMasterOptions({
            itemTypes: it,
            metals: m,
            metalColors: mc,
            stoneNames: sn,
            shapes: sh,
            cuttings: ct,
            qualities: q,
            clarities: cl,
          });
        } catch (err) {
          console.error("Failed to initialize editor data", err);
        } finally {
          setFetching(false);
        }
      };
      initData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, item.session_id, item.product_id]); // Depend only on open state and id

  if (!isOpen) return null;

  const handleSave = async () => {
    if (!customerId) {
      alert("Please select a customer first.");
      return;
    }
    setLoading(true);
    try {
      if (!form) {
        return <div>Loading...</div>;
      }

      await saveCustomProduct({
        session_id: item.session_id,
        customer_id: customerId,
        detail_data: mapBaseProductFormToCustomSpec(form),
      });
      onSaveSuccess();
      onClose();
    } catch (err) {
      console.error("Failed to save custom product", err);
      alert("Save failed");
    } finally {
      setLoading(false);
    }
  };

  const updateForm = <K extends keyof BaseProductForm>(
    field: K,
    value: BaseProductForm[K],
  ) => {
    setForm((prev) => (prev ? { ...prev, [field]: value } : prev));
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div
        className="w-full max-w-[min(1200px,95vw)] max-h-[90vh] bg-white rounded-lg shadow-lg 
           overflow-hidden grid grid-rows-[auto_1fr_auto]"
      >
        <div className="flex items-center justify-center border-b py-4 relative">
          <h2 className="text-[#084072] font-normal text-xl tracking-wide">
            PRODUCT INFORMATION
          </h2>

          <button onClick={onClose} className="absolute right-6 text-gray-900">
            <CloseIcon className="w-8 h-8" />
          </button>
        </div>

        {/* Content */}
        <div
          className="px-10 py-8 flex-1 bg-[#FBFBFB] overflow-y-auto hide-scrollbar"
          style={{ scrollbarWidth: "none" }}
        >
          {fetching && (
            <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] z-50 flex items-center justify-center">
              <div className="text-[#06284B] flex items-center gap-3">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Loading detail...
              </div>
            </div>
          )}

          <div className="flex gap-12 mb-12">
            {/* Left: Images area */}
            <div className="w-[320px] flex-shrink-0">
              <div className="aspect-square bg-white rounded-lg border border-gray-100 overflow-hidden flex items-center justify-center mb-6">
                <ProductImage
                  imageUrl={displayImage}
                  className="w-full h-full"
                />
              </div>
              <div className="flex gap-4">
                <div className="w-20 h-20 bg-white rounded-lg border border-gray-100 flex-shrink-0 overflow-hidden">
                  <ProductImage imageUrl={displayImage} className="w-20 h-20" />
                </div>
                <div className="w-20 h-20 bg-white rounded-lg border border-gray-100 flex-shrink-0 overflow-hidden">
                  <ProductImage imageUrl={displayImage} className="w-20 h-20" />
                </div>
              </div>
            </div>

            {/* Right: General Info Section */}
            <div className="flex-1 flex flex-col gap-6">
              <div className="pb-2">
                <span className="text-[#06284B] text-xl">General</span>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {/* Row 1: Category Label Style */}
                <div className="flex items-center gap-4">
                  <label className="text-base text-[#2A2A2A] w-[140px] flex-shrink-0">
                    Category
                  </label>
                  <span className="text-[13px] text-gray-700">
                    {productCategory}
                  </span>
                </div>

                {/* Row 2: Code (Input) */}
                <InputField
                  label="Code"
                  value={form?.code}
                  onChange={() => {}}
                />

                {/* Row 3: Product Name & Item Type */}
                <div className="grid grid-cols-2 gap-x-12">
                  <InputField
                    label="Product Name"
                    value={form?.productName ?? ""}
                    onChange={(v) => updateForm("productName", v)}
                  />
                  <SelectField
                    label="Item Type"
                    value={form?.itemType ?? ""}
                    onChange={(v) => updateForm("itemType", v)}
                    options={masterOptions.itemTypes}
                    placeholder="Select item type"
                  />
                </div>

                {/* Row 4: Product size & Metal */}
                <div className="grid grid-cols-2 gap-x-12">
                  <InputField
                    label="Product size"
                    value={form?.productSize ?? ""}
                    onChange={(v) => updateForm("productSize", v)}
                  />
                  <SelectField
                    label="Metal"
                    value={form?.metal ?? ""}
                    onChange={(v) => updateForm("metal", v)}
                    options={masterOptions.metals}
                    placeholder="Select metal"
                  />
                </div>

                {/* Row 5: Description & Metal Color, Nwt, Gwt */}
                <div className="grid grid-cols-2 gap-x-12">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-start gap-4 h-full">
                      <label className="text-base text-[#2A2A2A] w-[140px] flex-shrink-0 pt-2">
                        Description
                      </label>

                      <div className="flex-1 flex flex-col h-full">
                        <textarea
                          value={form?.description ?? ""}
                          onChange={(e) =>
                            updateForm("description", e.target.value)
                          }
                          placeholder="Enter description..."
                          className="w-full border border-[#CFCFCF] rounded-md p-3 text-sm focus:border-[#2E5B9A] outline-none transition-all resize-none "
                        />

                        <span className="text-[11px] text-gray-400 mt-2">
                          *Description should not exceed 300 letter
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-4">
                    <SelectField
                      label="Metal Color"
                      value={form?.metalColor ?? ""}
                      onChange={(v) => updateForm("metalColor", v)}
                      options={masterOptions.metalColors}
                      placeholder="Select metal color"
                    />

                    <InputField
                      label="Nwt"
                      value={form?.nwt ?? ""}
                      onChange={(v) => updateForm("nwt", v)}
                      type="number"
                      unit="g"
                    />

                    <InputField
                      label="Gwt"
                      value={form?.gwt ?? ""}
                      onChange={(v) => updateForm("gwt", v)}
                      type="number"
                      unit="g"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stone Section */}
          <div className="mb-12">
            <div className="pb-2 mb-6">
              <span className="text-[#06284B] text-lg">Stone</span>
            </div>

            <div className="grid grid-cols-2 gap-x-12 gap-y-6">
              <div className="flex flex-col gap-4">
                <SelectField
                  label="Stone Name"
                  value={form?.primaryStone.stoneName ?? ""}
                  onChange={(v) =>
                    setForm((prev) =>
                      prev
                        ? {
                            ...prev,
                            primaryStone: {
                              ...prev.primaryStone,
                              stoneName: v,
                            },
                          }
                        : prev,
                    )
                  }
                  options={masterOptions.stoneNames}
                  placeholder="Opal"
                />

                <SelectField
                  label="Shape"
                  value={form?.primaryStone.shape ?? ""}
                  onChange={(v) =>
                    setForm((prev) =>
                      prev
                        ? {
                            ...prev,
                            primaryStone: {
                              ...prev.primaryStone,
                              shape: v,
                            },
                          }
                        : prev,
                    )
                  }
                  options={masterOptions.shapes}
                  placeholder="Round"
                />

                <InputField
                  label="Size"
                  value={form?.primaryStone.size ?? ""}
                  onChange={(v) =>
                    setForm((prev) =>
                      prev
                        ? {
                            ...prev,
                            primaryStone: {
                              ...prev.primaryStone,
                              size: v,
                            },
                          }
                        : prev,
                    )
                  }
                  placeholder="14 mm"
                />

                <InputField
                  label="S.weight"
                  value={form?.primaryStone.weight ?? ""}
                  onChange={(v) =>
                    setForm((prev) =>
                      prev
                        ? {
                            ...prev,
                            primaryStone: {
                              ...prev.primaryStone,
                              weight: v,
                            },
                          }
                        : prev,
                    )
                  }
                  type="number"
                  placeholder="0.32"
                  unit="cts"
                />
              </div>

              <div className="flex flex-col gap-4">
                <InputField
                  label="Color"
                  value={form?.primaryStone.color ?? ""}
                  onChange={(v) =>
                    setForm((prev) =>
                      prev
                        ? {
                            ...prev,
                            primaryStone: {
                              ...prev.primaryStone,
                              color: v,
                            },
                          }
                        : prev,
                    )
                  }
                  placeholder="F"
                />

                <SelectField
                  label="Quality"
                  value={form?.primaryStone.quality ?? ""}
                  onChange={(v) =>
                    setForm((prev) =>
                      prev
                        ? {
                            ...prev,
                            primaryStone: {
                              ...prev.primaryStone,
                              quality: v,
                            },
                          }
                        : prev,
                    )
                  }
                  options={masterOptions.qualities}
                  placeholder="AA"
                />

                <SelectField
                  label="Cutting"
                  value={form?.primaryStone.cutting ?? ""}
                  onChange={(v) =>
                    setForm((prev) =>
                      prev
                        ? {
                            ...prev,
                            primaryStone: {
                              ...prev.primaryStone,
                              cutting: v,
                            },
                          }
                        : prev,
                    )
                  }
                  options={masterOptions.cuttings}
                  placeholder="Excellent"
                />

                <SelectField
                  label="Clarity"
                  value={form?.primaryStone.clarity ?? ""}
                  onChange={(v) =>
                    setForm((prev) =>
                      prev
                        ? {
                            ...prev,
                            primaryStone: {
                              ...prev.primaryStone,
                              clarity: v,
                            },
                          }
                        : prev,
                    )
                  }
                  options={masterOptions.clarities}
                  placeholder="VS1"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer - Centered Buttons */}
        <div className="flex justify-center gap-4 px-6 py-3 border-t">
          <button
            onClick={onClose}
            className="w-24 px-4 py-[6px] bg-white border border-[#CFCFCF] text-base hover:bg-[#F1F1F1] text-black rounded-md"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={loading}
            className="w-24 px-4 py-[6px] bg-[#005AA7] hover:bg-[#084072] text-white text-base rounded-md"
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCustomEditorModal;
