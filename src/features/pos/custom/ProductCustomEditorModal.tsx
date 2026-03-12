import React, { useEffect, useState } from "react";
import { fetchMasterOptions } from "../../../services/master";
import { MASTER_TYPES } from "../../../types/master";
import type { SelectOption } from "../../../types/shared/select";
import type { CustomSessionItem, CustomSpec } from "../../../types/pos/custom";
import { saveCustomProduct, getCustomSessionDetail } from "../../../services/pos/posCustom";

interface ProductCustomEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: CustomSessionItem;
  customerId: string;
  onSaveSuccess: () => void;
}

/* ── Components outside to prevent re-creation ───────────────── */
const InputField = ({ label, value, onChange, placeholder, type = "text", unit, fullWidth = false }: any) => (
  <div className={`flex items-center gap-4 ${fullWidth ? 'w-full' : 'w-full'}`}>
    <label className="text-[13px] text-[#06284B] w-[140px] flex-shrink-0">{label}</label>
    <div className="relative flex-1">
      <input
        type={type}
        value={value ?? ""}
        onChange={(e) => onChange(type === "number" ? parseFloat(e.target.value) : e.target.value)}
        placeholder={placeholder}
        className={`w-full border border-[#D1D5DB] rounded-md px-3 h-10 text-[13px] focus:border-[#2E5B9A] outline-none transition-all ${unit ? 'pr-8' : ''}`}
      />
      {unit && (
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[13px] text-gray-400">{unit}</span>
      )}
    </div>
  </div>
);

const SelectField = ({ label, value, onChange, options, placeholder }: any) => (
  <div className="flex items-center gap-4 w-full">
    <label className="text-[13px] text-[#06284B] w-[140px] flex-shrink-0">{label}</label>
    <select
      value={value ?? ""}
      onChange={(e) => onChange(e.target.value)}
      className="flex-1 border border-[#D1D5DB] rounded-md px-3 h-10 text-[13px] focus:border-[#2E5B9A] outline-none transition-all bg-white"
    >
      <option value="">{placeholder || "Select..."}</option>
      {(options || []).map((opt: SelectOption) => (
        <option key={opt.value} value={opt.value}>{opt.label}</option>
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
  const [spec, setSpec] = useState<CustomSpec>({});

  useEffect(() => {
    if (isOpen) {
      const initData = async () => {
        setFetching(true);
        try {
          // Fetch detail data & master data concurrently
          const [freshItem, it, m, mc, sn, sh, ct, q, cl] = await Promise.all([
            getCustomSessionDetail(item.session_id) as Promise<any>,
            masterOptions.itemTypes.length ? Promise.resolve(masterOptions.itemTypes) : fetchMasterOptions(MASTER_TYPES.itemType),
            masterOptions.metals.length ? Promise.resolve(masterOptions.metals) : fetchMasterOptions(MASTER_TYPES.metal),
            masterOptions.metalColors.length ? Promise.resolve(masterOptions.metalColors) : fetchMasterOptions(MASTER_TYPES.metalColor),
            masterOptions.stoneNames.length ? Promise.resolve(masterOptions.stoneNames) : fetchMasterOptions(MASTER_TYPES.stoneName),
            masterOptions.shapes.length ? Promise.resolve(masterOptions.shapes) : fetchMasterOptions(MASTER_TYPES.shape),
            masterOptions.cuttings.length ? Promise.resolve(masterOptions.cuttings) : fetchMasterOptions(MASTER_TYPES.cutting),
            masterOptions.qualities.length ? Promise.resolve(masterOptions.qualities) : fetchMasterOptions(MASTER_TYPES.quality),
            masterOptions.clarities.length ? Promise.resolve(masterOptions.clarities) : fetchMasterOptions(MASTER_TYPES.clarity),
          ]);
          
          setDisplayImage(freshItem.cover_image || freshItem.image || item.image);

          // Update spec
          const hasCustomSpec = freshItem.custom_spec && Object.keys(freshItem.custom_spec).length > 0;
          if (hasCustomSpec) {
            setSpec(freshItem.custom_spec);
          } else if (freshItem.raw_data) {
            const rd = freshItem.raw_data;
            const stone = rd.stone || {};
            setSpec({
              product_name: freshItem.product_name,
              product_size: rd.size || freshItem.size,
              item_type_id: rd.item_type_id,
              metal_id: rd.metal_id,
              metal_color: rd.metal_color,
              description: rd.description,
              nwt: rd.nwt,
              gwt: rd.gwt,
              stone_name_id: stone.name_id,
              stone_shape_id: stone.shape_id,
              cutting: stone.cutting_id,
              quality: stone.quality_id,
              clarity: stone.clarity_id,
              color: stone.color,
              size: stone.size,
              s_weight: stone.weight,
              additional_stones: rd.additional_stones?.map((s: any) => ({
                stone_name_id: s.stone_name_id,
                stone_shape_id: s.stone_shape_id,
                color: s.stone_color,
                size: s.stone_size,
                s_weight: s.s_weight,
                cutting: s.cutting,
                quality: s.quality,
                clarity: s.clarity,
              }))
            });
          } else {
            setSpec({
              product_name: freshItem.product_name,
              product_size: freshItem.size,
              metal_color: freshItem.metal_color,
            });
          }

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
  }, [isOpen, item.session_id]); // Depend only on open state and id

  if (!isOpen) return null;

  const handleSave = async () => {
    if (!customerId) {
        alert("Please select a customer first.");
        return;
    }
    setLoading(true);
    try {
      await saveCustomProduct({
        session_id: item.session_id,
        customer_id: customerId,
        detail_data: spec,
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

  const updateSpec = (field: keyof CustomSpec, value: any) => {
    setSpec(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm font-inherit">
      <div className="bg-white w-full max-w-[1000px] max-h-[95vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* Header - Centered Title */}
        <div className="relative flex justify-center items-center px-8 py-6">
          <h2 className="text-xl text-[#06284B]">PRODUCT INFORMATION</h2>
          <button onClick={onClose} className="absolute right-8 text-gray-400 hover:text-gray-600 transition-colors p-1">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-12 pt-0 relative [&::-webkit-scrollbar]:hidden" style={{ scrollbarWidth: 'none' }}>
          
          {fetching && (
            <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] z-50 flex items-center justify-center">
              <div className="text-[#06284B] flex items-center gap-3">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Loading detail...
              </div>
            </div>
          )}
          
          <div className="flex gap-12 mb-12">
            {/* Left: Images area */}
            <div className="w-[320px] flex-shrink-0">
              <div className="aspect-square bg-white rounded-2xl border border-gray-100 overflow-hidden flex items-center justify-center mb-6 shadow-sm">
                {displayImage ? (
                  <img src={displayImage} className="w-full h-full object-cover" />
                ) : (
                  <div className="text-gray-300 text-sm">No Image</div>
                )}
              </div>
              <div className="flex gap-4">
                <div className="w-20 h-20 bg-white rounded-xl border border-gray-100 flex-shrink-0 overflow-hidden shadow-xs">
                    {displayImage && <img src={displayImage} className="w-full h-full object-cover opacity-80" />}
                </div>
                <div className="w-20 h-20 bg-white rounded-xl border border-gray-100 flex-shrink-0 overflow-hidden shadow-xs">
                    {displayImage && <img src={displayImage} className="w-full h-full object-cover opacity-80" />}
                </div>
              </div>
            </div>

            {/* Right: General Info Section */}
            <div className="flex-1 flex flex-col gap-6">
              <div className="pb-2">
                <span className="text-[#2E5B9A] text-lg">General</span>
              </div>
              
              <div className="grid grid-cols-1 gap-4">
                {/* Row 1: Category Label Style */}
                <div className="flex items-center gap-4">
                  <label className="text-[13px] text-[#06284B] w-[140px] flex-shrink-0">Category</label>
                  <span className="text-[13px] text-gray-700">Product Master</span>
                </div>

                {/* Row 2: Code (Input) */}
                <InputField label="Code" value={item.product_code} onChange={() => {}} />

                {/* Row 3: Product Name & Item Type */}
                <div className="grid grid-cols-2 gap-x-12">
                   <InputField label="Product Name" value={spec.product_name} onChange={(v: any) => updateSpec('product_name', v)} />
                   <SelectField label="Item Type" value={spec.item_type_id} onChange={(v: any) => updateSpec('item_type_id', v)} options={masterOptions.itemTypes} placeholder="Ring" />
                </div>

                {/* Row 4: Product size & Metal */}
                <div className="grid grid-cols-2 gap-x-12">
                   <InputField label="Product size" value={spec.product_size} onChange={(v: any) => updateSpec('product_size', v)} />
                   <SelectField label="Metal" value={spec.metal_id} onChange={(v: any) => updateSpec('metal_id', v)} options={masterOptions.metals} placeholder="18K RG" />
                </div>

                {/* Row 5: Description & Metal Color, Nwt, Gwt */}
                <div className="grid grid-cols-2 gap-x-12">
                   <div className="flex flex-col gap-2">
                      <div className="flex items-start gap-4 h-full">
                        <label className="text-[13px] text-[#06284B] w-[140px] flex-shrink-0 pt-2">Description</label>
                        <div className="flex-1 flex flex-col h-full">
                          <textarea 
                            value={spec.description || ""}
                            onChange={(e) => updateSpec('description', e.target.value)}
                            placeholder="Enter description..."
                            className="w-full border border-[#D1D5DB] rounded-md p-3 text-[13px] focus:border-[#2E5B9A] outline-none transition-all resize-none h-[120px]"
                          />
                          <span className="text-[11px] text-gray-400 mt-2">*Description should not exceed 300 letter</span>
                        </div>
                      </div>
                   </div>

                   <div className="flex flex-col gap-4">
                      <SelectField label="Metal Color" value={spec.metal_color} onChange={(v: any) => updateSpec('metal_color', v)} options={masterOptions.metalColors} placeholder="Rose Gold" />
                      <InputField label="Nwt" value={spec.nwt} onChange={(v: any) => updateSpec('nwt', v)} type="number" placeholder="2.20" unit="g" />
                      <InputField label="Gwt" value={spec.gwt} onChange={(v: any) => updateSpec('gwt', v)} type="number" placeholder="2.52" unit="g" />
                   </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stone Section */}
          <div className="mb-12">
            <div className="pb-2 mb-6">
              <span className="text-[#2E5B9A] text-lg">Stone</span>
            </div>
            
            <div className="grid grid-cols-2 gap-x-12 gap-y-6">
              <div className="flex flex-col gap-4">
                <SelectField label="Stone Name" value={spec.stone_name_id} onChange={(v: any) => updateSpec('stone_name_id', v)} options={masterOptions.stoneNames} placeholder="Opal" />
                <SelectField label="Shape" value={spec.stone_shape_id} onChange={(v: any) => updateSpec('stone_shape_id', v)} options={masterOptions.shapes} placeholder="Round" />
                <InputField label="Size" value={spec.size} onChange={(v: any) => updateSpec('size', v)} placeholder="14 mm" />
                <InputField label="S.weight" value={spec.s_weight} onChange={(v: any) => updateSpec('s_weight', v)} type="number" placeholder="0.32" unit="cts" />
              </div>
              
              <div className="flex flex-col gap-4">
                <InputField label="Color" value={spec.color} onChange={(v: any) => updateSpec('color', v)} placeholder="F" />
                <SelectField label="Quality" value={spec.quality} onChange={(v: any) => updateSpec('quality', v)} options={masterOptions.qualities} placeholder="AA" />
                <SelectField label="Cutting" value={spec.cutting} onChange={(v: any) => updateSpec('cutting', v)} options={masterOptions.cuttings} placeholder="Excellent" />
                <SelectField label="Clarity" value={spec.clarity} onChange={(v: any) => updateSpec('clarity', v)} options={masterOptions.clarities} placeholder="VS1" />
              </div>
            </div>
          </div>

        </div>

        {/* Footer - Centered Buttons */}
        <div className="flex gap-6 px-8 py-8 border-t border-gray-100 justify-center">
          <button 
            onClick={onClose}
            className="h-10 px-12 border border-[#D1D5DB] rounded-md text-[14px] text-[#06284B] hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={handleSave}
            disabled={loading}
            className="h-10 px-12 bg-[#005AA7] text-white rounded-md text-[14px] shadow-sm hover:bg-[#004A8A] transition-all disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>

      </div>
    </div>
  );
};

export default ProductCustomEditorModal;
