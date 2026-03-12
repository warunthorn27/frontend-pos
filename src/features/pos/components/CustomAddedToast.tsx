import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface ToastItem {
  id: number;
  productName: string;
  productCode: string;
  imageUrl?: string | null;
  metal?: string;
  metalColor?: string;
}

interface Props {
  toasts: ToastItem[];
  onClose: (id: number) => void;
}

const CustomAddedToast: React.FC<Props> = ({ toasts, onClose }) => {
  const navigate = useNavigate();

  return (
    <div
      style={{
        position: "fixed",
        top: "72px",
        right: "24px",
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        gap: "8px",
      }}
    >
      {toasts.map((toast) => (
        <ToastCard
          key={toast.id}
          toast={toast}
          onClose={() => onClose(toast.id)}
          onViewCustom={() => navigate("/pos/custom")}
        />
      ))}
    </div>
  );
};

/* ===== Individual Toast Card ===== */
interface CardProps {
  toast: ToastItem;
  onClose: () => void;
  onViewCustom: () => void;
}

const ToastCard: React.FC<CardProps> = ({ toast, onClose, onViewCustom }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3500);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid #e5e7eb",
        borderRadius: "8px",
        boxShadow: "0 4px 16px rgba(0,0,0,0.12)",
        padding: "12px 14px",
        width: "280px",
        animation: "slideInToast 0.25s ease",
      }}
    >
      <style>{`
        @keyframes slideInToast {
          from { opacity: 0; transform: translateX(30px); }
          to   { opacity: 1; transform: translateX(0); }
        }
      `}</style>

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#22c55e", fontSize: "13px", fontWeight: 500 }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
          Just added !
        </div>
        <button onClick={onClose} style={{ border: "none", background: "none", cursor: "pointer", color: "#9ca3af" }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>

      {/* Product row */}
      <div style={{ display: "flex", gap: "10px", alignItems: "center", marginBottom: "10px" }}>
        <div style={{
          width: "40px", height: "40px", borderRadius: "4px",
          background: "#f3f4f6", overflow: "hidden", flexShrink: 0,
          display: "flex", alignItems: "center", justifyContent: "center"
        }}>
          {toast.imageUrl ? (
            <img src={toast.imageUrl} alt={toast.productName} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          ) : (
            <div style={{ width: "20px", height: "20px", background: "#d1d5db", borderRadius: "2px" }} />
          )}
        </div>
        <div>
          <div style={{ fontSize: "13px", fontWeight: 500, color: "#111827" }}>{toast.productName}</div>
          <div style={{ fontSize: "11px", color: "#6b7280" }}>
            {toast.productCode}
            {toast.metal && ` · ${toast.metal}`}
            {toast.metalColor && ` ${toast.metalColor}`}
          </div>
        </div>
      </div>

      {/* Link */}
      <button
        onClick={onViewCustom}
        style={{
          background: "none", border: "none", cursor: "pointer",
          color: "#2563eb", fontSize: "12px", fontWeight: 500,
          textDecoration: "underline", padding: 0,
        }}
      >
        View Custom Items →
      </button>
    </div>
  );
};

export default CustomAddedToast;
export type { ToastItem };
