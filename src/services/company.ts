import type {
  CompanyApiModel,
  CreateCompanyPayload,
  GetCompanyByIdResponse,
  // CreateCompanyResponse,
  // UpdateCompanyResponse,
} from "../types/company";
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
  companyId: string
): Promise<CompanyApiModel> {
  const res = await fetch(`${API_BASE}/getone-comp/${companyId}`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  const json = await readJsonOrText<GetCompanyByIdResponse & ApiErrorShape>(
    res
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
  formData: FormData
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
  formData: FormData
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

function e164ToThaiLocal(v?: string | null): string {
  if (!v) return "";
  if (v.startsWith("+66")) return "0" + v.slice(3);
  return v;
}

export function mapCompanyApiToForm(api: CompanyApiModel) {
  return {
    companyName: api.comp_name ?? "",
    taxId: api.comp_taxid ?? "",
    email: api.comp_email ?? "",
    phone: e164ToThaiLocal(api.comp_phone),
    companyAddress: api.comp_addr ?? "",
    country: "Thailand",
    province: api.comp_prov ?? "",
    district: api.comp_dist ?? "",
    subDistrict: api.comp_subdist ?? "",
    zipcode: api.comp_zip ?? "",
    contactName: api.comp_person_name ?? "",
    contactPhone: e164ToThaiLocal(api.comp_person_phone),
    contactEmail: api.comp_person_email ?? "",
    companyFile: api.comp_file ?? null,
  };
}

export function mapCompanyFormToPayload(values: {
  companyName: string;
  taxId: string;
  email: string;
  phone: string;
  companyAddress: string;
  province: string;
  district: string;
  subDistrict: string;
  zipcode: string;
  contactName: string;
  contactPhone: string;
  contactEmail: string;
}): CreateCompanyPayload {
  return {
    comp_name: values.companyName,
    comp_addr: values.companyAddress,
    comp_subdist: values.subDistrict,
    comp_dist: values.district,
    comp_prov: values.province,
    comp_zip: values.zipcode,
    comp_email: values.email,
    comp_taxid: values.taxId,
    comp_phone: values.phone,
    comp_person_name: values.contactName,
    comp_person_phone: values.contactPhone,
    comp_person_email: values.contactEmail,
  };
}
