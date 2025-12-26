import { getToken } from "../utils/authStorage";

export const API_BASE =
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3000/api";

export function getAuthHeaders() {
  const token = getToken();
  return {
    "Content-Type": "application/json",
    ...(token ? { authtoken: token } : {}),
  };
}

export async function readJson<T>(res: Response): Promise<T> {
  const text = await res.text();
  try {
    return JSON.parse(text) as T;
  } catch {
    throw new Error(text || "Invalid JSON response");
  }
}
