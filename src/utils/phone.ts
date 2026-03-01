import type { CountryCode } from "../component/phoneInput/CountryPhoneInput";

export function digitsOnly(v: string): string {
  return (v || "").replace(/\D/g, "");
}

export function formatPhoneForDisplay(phone?: string): string {
  if (!phone) return "";

  const digits = phone.replace(/\D/g, "");

  if (phone.startsWith("+66")) {
    return "0" + digits.slice(2);
  }

  if (phone.startsWith("+81")) {
    return "0" + digits.slice(2);
  }

  if (phone.startsWith("+1")) {
    return digits.slice(1);
  }

  return phone;
}

/** แปลงจาก input → E.164 (ส่ง backend) */
export function normalizePhoneForApi(
  input?: string,
  country: CountryCode = "TH",
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
export function isValidPhone(input?: string): boolean {
  if (!input) return true;

  return /^\+[1-9]\d{7,14}$/.test(input);
}

export const isValidEmail = (email?: string): boolean => {
  if (!email) return true; // optional field

  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

export function buildE164(dialCode: string, raw: string) {
  const digits = raw.replace(/\D/g, "");

  if (!digits) return "";

  if (dialCode === "+66" && digits.startsWith("0")) {
    return dialCode + digits.slice(1);
  }

  if (dialCode === "+81" && digits.startsWith("0")) {
    return dialCode + digits.slice(1);
  }

  return dialCode + digits;
}

export const COUNTRIES: { code: CountryCode; dial: string }[] = [
  { code: "TH", dial: "+66" },
  { code: "US", dial: "+1" },
  { code: "JP", dial: "+81" },
];

export function detectCountryFromPhone(phone?: string): CountryCode {
  if (!phone) return "TH";

  if (phone.startsWith("+66")) return "TH";
  if (phone.startsWith("+1")) return "US";
  if (phone.startsWith("+81")) return "JP";

  return "TH"; // fallback
}
