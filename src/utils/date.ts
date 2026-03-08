export function formatDateDisplay(date?: string | Date | null): string {
  if (!date) return "-";

  const d = typeof date === "string" ? new Date(date) : date;

  if (Number.isNaN(d.getTime())) return "-";

  return d.toLocaleDateString("en-GB");
  // 08/03/2026
}

export function formatDateInput(date?: string | Date | null): string {
  if (!date) return "";

  const d = typeof date === "string" ? new Date(date) : date;

  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");

  return `${y}-${m}-${day}`;
}
