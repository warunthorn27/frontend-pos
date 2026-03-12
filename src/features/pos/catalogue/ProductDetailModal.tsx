import { useState } from "react";
import type { PosProductDetail } from "../../../types/pos/catalogue";
import { useCustomSession } from "../context/CustomSessionContext";

interface Props {
  detail: PosProductDetail;
  onClose: () => void;
}

const val = (v?: string) => (!v || v === "-" ? "-" : v);

const Row = ({ label, value }: { label: string; value?: string }) => (
  <div style={{ display: "flex", gap: "12px", padding: "4px 0", fontSize: "13px", alignItems: "baseline" }}>
    <span style={{ width: "100px", flexShrink: 0, color: "#6b7280" }}>{label}</span>
    <span style={{ color: "#111827", wordBreak: "break-word" }}>{val(value)}</span>
  </div>
);

const SectionHeader = ({ label }: { label: string }) => (
  <div style={{ fontSize: "12px", fontWeight: 600, color: "#2563eb", margin: "12px 0 2px" }}>
    {label}
  </div>
);

const ProductDetailModal: React.FC<Props> = ({ detail, onClose }) => {
  const allImages = [
    ...(detail.cover_image ? [detail.cover_image] : []),
    ...(detail.images ?? []).filter((i) => i !== detail.cover_image),
  ];

  const [activeImg, setActiveImg] = useState<string>(allImages[0] ?? "");
  const [detailsOpen, setDetailsOpen] = useState(false);
  const { addItem } = useCustomSession();

  /* Helper: get value from main_info by label */
  const mainVal = (label: string) =>
    detail.attributes?.main_info?.find(
      (x) => x.label.toLowerCase() === label.toLowerCase(),
    )?.value ?? undefined;

  /* Quick chips — Metal, Metal Color, Size */
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
      style={{
        position: "fixed", inset: 0,
        background: "rgba(0,0,0,0.35)",
        zIndex: 1000,
        display: "flex", alignItems: "center", justifyContent: "center",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#fff",
          borderRadius: "12px",
          width: "920px",
          height: "580px",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
          position: "relative",
          fontFamily: "inherit",
        }}
      >
        {/* Close */}
        <button
          onClick={onClose}
          style={{
            position: "absolute", top: "14px", right: "14px",
            background: "none", border: "none", cursor: "pointer",
            color: "#9ca3af", fontSize: "16px", zIndex: 10,
            width: "28px", height: "28px",
            display: "flex", alignItems: "center", justifyContent: "center",
            borderRadius: "50%",
          }}
        >
          ✕
        </button>

        {/* Body: image left (fixed) + info right (scrollable) */}
        <style>{`.pos-info-panel::-webkit-scrollbar{display:none}`}</style>
        <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>

          {/* LEFT — fixed image panel */}
          <div style={{
            width: "460px", flexShrink: 0,
            padding: "20px",
            display: "flex", flexDirection: "column",
          }}>
            <div style={{
              flex: 1,
              width: "100%",
              background: "#f9fafb", borderRadius: "8px",
              overflow: "hidden", display: "flex",
              alignItems: "center", justifyContent: "center",
            }}>
              {activeImg ? (
                <img src={activeImg} alt={detail.product_name}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              ) : (
                <div style={{ color: "#d1d5db", fontSize: "12px" }}>No image</div>
              )}
            </div>

            {allImages.length > 1 && (
              <div style={{ display: "flex", gap: "8px", marginTop: "10px", flexWrap: "wrap" }}>
                {allImages.map((img, i) => (
                  <div
                    key={i}
                    onClick={() => setActiveImg(img)}
                    style={{
                      width: "52px", height: "52px",
                      borderRadius: "6px", overflow: "hidden",
                      border: activeImg === img ? "2px solid #2563eb" : "2px solid #e5e7eb",
                      cursor: "pointer", background: "#f3f4f6",
                    }}
                  >
                    <img src={img} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT — scrollable info panel */}
          <div
            className="pos-info-panel"
            style={{
              flex: 1, minWidth: 0,
              overflowY: "auto",
              scrollbarWidth: "none",
              padding: "20px 20px 20px 16px",
            }}
          >
            <div style={{ fontSize: "18px", fontWeight: 600, color: "#111827", marginBottom: "4px" }}>
              {detail.product_name}
            </div>
            <div style={{ fontSize: "13px", color: "#6b7280", marginBottom: "10px" }}>
              {detail.product_code}
            </div>

            {detail.description && detail.description !== "-" && (
              <div style={{ fontSize: "13px", color: "#374151", lineHeight: 1.6, marginBottom: "12px" }}>
                {detail.description}
              </div>
            )}

            {/* Quick chips */}
            <div style={{ fontSize: "12px", color: "#6b7280", display: "flex", flexWrap: "wrap", gap: "16px", marginBottom: "16px" }}>
              {chipMetal && chipMetal !== "-" && (
                <span>Metal : <b style={{ color: "#111827" }}>{chipMetal}</b></span>
              )}
              {chipColor && chipColor !== "-" && (
                <span>Metal Color : <b style={{ color: "#111827" }}>{chipColor}</b></span>
              )}
              {chipSize && chipSize !== "-" && (
                <span>Size : <b style={{ color: "#111827" }}>{chipSize}</b></span>
              )}
            </div>

            {/* DETAILS accordion */}
            <div>
              <style>{`
                @keyframes slideDown {
                  from { opacity: 0; transform: translateY(-6px); }
                  to   { opacity: 1; transform: translateY(0); }
                }
              `}</style>

              {/* Header row */}
              <button
                onClick={() => setDetailsOpen((o) => !o)}
                style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  width: "100%", background: "none", border: "none", cursor: "pointer",
                  padding: "8px 0",
                }}
              >
                <span style={{ fontSize: "13px", fontWeight: 600, color: "#374151", letterSpacing: "0.04em" }}>
                  DETAILS
                </span>
                <span style={{ fontSize: "18px", color: "#6b7280", lineHeight: 1 }}>
                  {detailsOpen ? "−" : "+"}
                </span>
              </button>

              {/* Gray divider below header */}
              <div style={{ borderTop: "1px solid #e5e7eb" }} />

              {/* Animated content */}
              {detailsOpen && (
                <div style={{ animation: "slideDown 0.2s ease", marginTop: "8px" }}>
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

                  {(detail.attributes?.additional_stones ?? []).map((stone, si) => (
                    <div key={si}>
                      <SectionHeader
                        label={`Additional Stone${
                          detail.attributes.additional_stones.length > 1 ? ` ${si + 1}` : ""
                        }`}
                      />
                      {stone.map((item, i) => (
                        <Row key={i} label={item.label} value={item.value} />
                      ))}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            padding: "12px 28px",
            borderTop: "1px solid #e5e7eb",
            display: "flex", justifyContent: "flex-end",
          }}
        >
          <button
            onClick={handleCustom}
            style={{
              padding: "0 28px", height: "38px",
              background: "#fff", border: "1px solid #d1d5db",
              borderRadius: "6px", fontSize: "13px", cursor: "pointer",
              color: "#111827", fontWeight: 500,
            }}
          >
            Custom
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailModal;
