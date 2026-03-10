export function formatStockUnit(unit?: string) {
  if (!unit) return "-";

  const u = unit.toLowerCase();

  if (u === "pcs") return "Pcs";
  if (u === "g") return "G";

  return unit;
}
