export function digitsOnly(v: string): string {
  return (v || "").replace(/\D/g, "");
}

/** แปลง E.164 → format สำหรับโชว์ (TH) */
export function formatPhoneForDisplay(
  phone?: string,
  country: "TH" = "TH"
): string {
  if (!phone) return "";

  const d = digitsOnly(phone);

  if (country === "TH") {
    // +66xxxxxxxxx → 0xxxxxxxxx
    if (d.startsWith("66") && d.length === 11) {
      return "0" + d.slice(2);
    }
    return d;
  }

  // future: country อื่น
  return phone;
}

/** แปลงจาก input → E.164 (ส่ง backend) */
export function normalizePhoneForApi(
  input?: string,
  country: "TH" = "TH"
): string {
  if (!input) return "";

  const d = digitsOnly(input);

  if (country === "TH") {
    if (d.startsWith("0") && d.length === 10) {
      return "+66" + d.slice(1);
    }
    if (d.startsWith("66")) {
      return "+" + d;
    }
  }

  return input;
}

/** validate เบอร์ */
export function isValidPhone(input?: string, country: "TH" = "TH"): boolean {
  if (!input) return true;

  const d = digitsOnly(input);

  if (country === "TH") {
    return /^0\d{9}$/.test(d) || /^66\d{9}$/.test(d);
  }

  return false;
}
