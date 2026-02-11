export function extractId(
  v?: string | { _id?: string; name?: string },
): string {
  if (!v) return "";
  if (typeof v === "string") return v;
  return v._id ?? "";
}

// export function extractLabel(
//   v?: string | { _id?: string; name?: string },
// ): string {
//   if (!v) return "";
//   if (typeof v === "string") return v;
//   return v.name ?? "";
// }

// export function extractLabel(
//   v?: string | { name?: string; master_name?: string },
// ) {
//   if (!v || typeof v === "string") return "";
//   return v.name ?? v.master_name ?? "";
// }
