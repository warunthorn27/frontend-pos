import type { CompanyApiModel, GetCompanyByIdResponse } from "../types/company";
import { API_BASE, getAuthHeaders } from "./apiClient";

type ApiErrorShape = {
  message?: string;
  error?: string;
  success?: boolean;
};

async function readJsonOrText<T>(res: Response): Promise<T> {
  const text = await res.text();
  try {
    return JSON.parse(text) as T;
  } catch {
    // ถ้า backend ส่ง text ล้วน
    return { message: text } as unknown as T;
  }
}

function pickMessage(e: unknown, fallback: string): string {
  if (typeof e === "string") return e;
  if (e && typeof e === "object") {
    const obj = e as ApiErrorShape;
    return obj.message ?? obj.error ?? fallback;
  }
  return fallback;
}
// GET company by id
export async function getCompanyById(
  companyId: string,
): Promise<CompanyApiModel> {
  const res = await fetch(`${API_BASE}/getone-comp/${companyId}`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  const json = await readJsonOrText<GetCompanyByIdResponse & ApiErrorShape>(
    res,
  );

  if (!res.ok) {
    if (res.status === 401)
      throw new Error("Unauthorized. Please login again.");
    throw new Error(pickMessage(json, "Get company failed"));
  }

  // backend ตาม type คือ { success, data }
  if (!("data" in json) || !json.data) {
    throw new Error("Invalid company response");
  }

  return json.data;
}

// CREATE company
export async function createCompany(
  formData: FormData,
): Promise<CompanyApiModel> {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API_BASE}/create-comp`, {
    method: "POST",
    headers: {
      ...(token ? { authtoken: token } : {}),
    },
    body: formData,
  });

  const json = await res.json();

  if (!res.ok) {
    throw new Error(json?.message || "Create company failed");
  }

  return json.data ?? json.company;
}

// UPDATE company
export async function updateCompany(
  companyId: string,
  formData: FormData,
): Promise<CompanyApiModel> {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API_BASE}/update-comp/${companyId}`, {
    method: "PUT",
    headers: {
      ...(token ? { authtoken: token } : {}),
    },
    body: formData,
  });

  const json = await res.json();

  if (!res.ok) {
    if (res.status === 401)
      throw new Error("Unauthorized. Please login again.");
    throw new Error(json?.message || "Update company failed");
  }

  return json.data;
}
