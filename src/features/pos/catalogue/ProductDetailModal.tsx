import { useState } from "react";
import type { PosProductDetail } from "../../../types/pos/catalogue";
import { useCustomSession } from "../context/CustomSessionContext";
import PlusIcon from "../../../assets/svg/plus.svg?react";
import MinusIcon from "../../../assets/svg/minus.svg?react";
import CloseIcon from "../../../assets/svg/close.svg?react";
import BlankImageIcon from "../../../assets/svg/upload-image.svg?react";

interface Props {
  detail: PosProductDetail;
  onClose: () => void;
}

const val = (v?: string) => (!v || v === "-" ? "-" : v);

const Row = ({ label, value }: { label: string; value?: string }) => (
  <div className="flex gap-24 py-1 text-sm items-baseline">
    <span className="w-[100px] flex-shrink-0 text-[#2A2A2A]">{label}: </span>
    <span className="text-[#545454] break-words">{val(value)}</span>
  </div>
);

const SectionHeader = ({ label }: { label: string }) => (
  <div className="text-sm font-normal text-[#0071CE] mt-4 mb-1">{label}</div>
);

const ProductDetailModal: React.FC<Props> = ({ detail, onClose }) => {
  const allImages = [
    ...(detail.cover_image ? [detail.cover_image] : []),
    ...(detail.images ?? []).filter((i) => i !== detail.cover_image),
  ];

  const [activeImg, setActiveImg] = useState<string>(allImages[0] ?? "");
  const [detailsOpen, setDetailsOpen] = useState(false);
  const { addItem } = useCustomSession();

  const mainVal = (label: string) =>
    detail.attributes?.main_info?.find(
      (x) => x.label.toLowerCase() === label.toLowerCase(),
    )?.value ?? undefined;

  const chipMetal = mainVal("Metal");
  const chipColor = mainVal("Metal color");
  const chipSize = mainVal("Product size");

  const handleCustom = async () => {
    await addItem(detail._id, {
      name: detail.product_name,
      code: detail.product_code,
      imageUrl: allImages[0],
      metal: chipMetal,
      metalColor: chipColor,
    });
    onClose();
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/35"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative bg-white rounded-md w-[95vw] max-w-[1200px] h-[80vh] flex flex-col overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.2)]"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-6 flex items-center justify-center text-black"
        >
          <CloseIcon className="w-7 h-7" />
        </button>

        <div className="flex-1 bg-white py-10 px-8 overflow-hidden">
          <div className="flex gap-16 h-full">
            {/* IMAGE */}
            <div className="lg:w-[400px] w-full flex-shrink-0 flex flex-col">
              <div className="w-full aspect-square bg-[#F5F5F5] rounded-md overflow-hidden flex items-center justify-center">
                {activeImg ? (
                  <img
                    src={activeImg}
                    alt={detail.product_name}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <BlankImageIcon className="w-16 h-16 text-[#9AA3B2]" />
                )}
              </div>

              {allImages.length > 1 && (
                <div className="flex gap-2 mt-2 flex-wrap">
                  {allImages.map((img, i) => (
                    <div
                      key={i}
                      onClick={() => setActiveImg(img)}
                      className={`w-16 h-16 rounded-md overflow-hidden cursor-pointer border-2 bg-border-[#E6E6E6] ${
                        activeImg === img
                          ? "border-[#0690F1]"
                          : "border-[#E6E6E6]"
                      }`}
                    >
                      <img
                        src={img}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* INFO */}
            {/* <div className="flex-1 overflow-y-auto p-5 pr-4 hide-scrollbar"> */}
            <div className="flex-1 overflow-y-auto hide-scrollbar pr-4">
              <div className="text-2xl font-normal text-[#06284B] mb-1">
                {detail.product_name}
              </div>

              <div className="text-base text-[#2A2A2A] mb-3">
                {detail.product_code}
              </div>

              {detail.description && detail.description !== "-" && (
                <div className="text-sm text-[#545454] leading-relaxed mb-2">
                  {detail.description}
                </div>
              )}

              <div className="text-sm text-[#2A2A2A] font-normal flex flex-wrap gap-4 mb-4">
                {chipMetal && chipMetal !== "-" && (
                  <span>
                    Metal:{" "}
                    <b className="text-[#545454] font-normal">{chipMetal}</b>
                  </span>
                )}
                {chipColor && chipColor !== "-" && (
                  <span>
                    Metal Color:{" "}
                    <b className="text-[#545454] font-normal">{chipColor}</b>
                  </span>
                )}
                {chipSize && chipSize !== "-" && (
                  <span>
                    Size:{" "}
                    <b className="text-[#545454] font-normal">{chipSize}</b>
                  </span>
                )}
              </div>

              {/* DETAILS */}
              <button
                onClick={() => setDetailsOpen((o) => !o)}
                className="flex justify-between items-center w-full py-2"
              >
                <span className="text-sm font-normal text-[#2A2A2A] tracking-wider">
                  DETAILS
                </span>

                <span className="flex items-center justify-center">
                  {detailsOpen ? (
                    <MinusIcon className="w-5 h-5 text-[#2A2A2A]" />
                  ) : (
                    <PlusIcon className="w-5 h-5 text-[#2A2A2A]" />
                  )}
                </span>
              </button>

              <div className="border-t border-gray-200" />

              {detailsOpen && (
                <div className="mt-2">
                  {(detail.attributes?.main_info ?? []).map((item, i) => (
                    <Row key={i} label={item.label} value={item.value} />
                  ))}

                  {(detail.attributes?.stone_info ?? []).length > 0 && (
                    <>
                      <SectionHeader label="Stone" />
                      {detail.attributes.stone_info.map((item, i) => (
                        <Row key={i} label={item.label} value={item.value} />
                      ))}
                    </>
                  )}

                  {(detail.attributes?.additional_stones ?? []).map(
                    (stone, si) => (
                      <div key={si}>
                        <SectionHeader
                          label={`Additional Stone${
                            detail.attributes.additional_stones.length > 1
                              ? ` ${si + 1}`
                              : ""
                          }`}
                        />
                        {stone.map((item, i) => (
                          <Row key={i} label={item.label} value={item.value} />
                        ))}
                      </div>
                    ),
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="px-8 mb-6 flex justify-end">
          <button
            onClick={handleCustom}
            className="w-24 px-4 py-[6px] bg-white border border-[#CFCFCF] text-base hover:bg-[#F1F1F1] text-black rounded-md"
          >
            Custom
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailModal;
