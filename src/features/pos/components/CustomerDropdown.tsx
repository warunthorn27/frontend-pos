import { useState, useRef, useEffect } from "react";
import type { PosCustomer } from "../../../services/pos/posCustom";

interface Props {
  customers: PosCustomer[];
  value: string;
  onChange: (customerId: string) => void;
  onAddCustomer?: () => void;
}

const CustomerDropdown: React.FC<Props> = ({
  customers,
  value,
  onChange,
  onAddCustomer,
}) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  const selected = customers.find((c) => c._id === value);

  /* Close on outside click */
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
        setSearch("");
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const filtered = customers
    .filter((c) => {
      const q = search.toLowerCase();
      return (
        c.customer_name.toLowerCase().includes(q) ||
        (c.customer_id ?? "").toLowerCase().includes(q) ||
        (c.customer_phone ?? "").includes(q)
      );
    })
    .sort((a, b) => (a.customer_id ?? "").localeCompare(b.customer_id ?? ""));

  const handleSelect = (c: PosCustomer) => {
    onChange(c._id);
    setOpen(false);
    setSearch("");
  };

  return (
    <div ref={containerRef} style={{ position: "relative" }}>
      {/* Trigger */}
      <div
        onClick={() => setOpen((o) => !o)}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          border: "1px solid #d1d5db",
          borderRadius: "4px",
          padding: "0 12px",
          height: "40px",
          fontSize: "13px",
          cursor: "pointer",
          background: "#fff",
          color: selected ? "#111827" : "#9ca3af",
          userSelect: "none",
        }}
      >
        <span>{selected ? selected.customer_name : "Choose a customer"}</span>
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#6b7280"
          strokeWidth="2"
          style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform 0.15s" }}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </div>

      {/* Dropdown panel */}
      {open && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 4px)",
            left: 0,
            right: 0,
            background: "#fff",
            border: "1px solid #e5e7eb",
            borderRadius: "6px",
            boxShadow: "0 8px 24px rgba(0,0,0,0.10)",
            zIndex: 200,
            overflow: "hidden",
          }}
        >
          {/* Search input */}
          <div style={{ padding: "8px 10px", borderBottom: "1px solid #f3f4f6" }}>
            <input
              autoFocus
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search name, ID or phone..."
              style={{
                width: "100%",
                border: "1px solid #e5e7eb",
                borderRadius: "4px",
                padding: "5px 10px",
                fontSize: "12px",
                outline: "none",
                boxSizing: "border-box",
              }}
            />
          </div>

          {/* List */}
          <div style={{ maxHeight: "220px", overflowY: "auto" }}>
            {filtered.length === 0 ? (
              <div style={{ padding: "12px", fontSize: "12px", color: "#9ca3af", textAlign: "center" }}>
                No customers found
              </div>
            ) : (
              filtered.map((c) => (
                <div
                  key={c._id}
                  onClick={() => handleSelect(c)}
                  style={{
                    padding: "10px 14px",
                    cursor: "pointer",
                    background: c._id === value ? "#f0f7ff" : "transparent",
                    borderBottom: "1px solid #f9fafb",
                    transition: "background 0.1s",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLDivElement).style.background = "#f9fafb";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLDivElement).style.background =
                      c._id === value ? "#f0f7ff" : "transparent";
                  }}
                >
                  <div style={{ fontSize: "13px", fontWeight: 500, color: "#111827" }}>
                    {c.customer_name}
                  </div>
                  <div style={{ fontSize: "11px", color: "#9ca3af", marginTop: "2px" }}>
                    {c.customer_id}
                    {c.customer_phone && (
                      <span style={{ marginLeft: "8px" }}>{c.customer_phone}</span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Add Customer footer */}
          <div
            onClick={() => {
              setOpen(false);
              onAddCustomer?.();
            }}
            style={{
              padding: "10px 14px",
              borderTop: "1px solid #f3f4f6",
              fontSize: "13px",
              color: "#2563eb",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              fontWeight: 500,
            }}
          >
            <span style={{ fontSize: "16px", lineHeight: 1 }}>+</span>
            Add Customer
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerDropdown;
