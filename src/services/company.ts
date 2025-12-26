import type {
  CompanyApiModel,
  CreateCompanyPayload,
  GetCompanyByIdResponse,
  CreateCompanyResponse,
  UpdateCompanyResponse,
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
  payload: CreateCompanyPayload
): Promise<CompanyApiModel> {
  // const token = getToken();
  // if (!token) throw new Error("No token. Please login again.");

  const res = await fetch(`${API_BASE}/create-comp`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });

  const json = await readJsonOrText<CreateCompanyResponse & ApiErrorShape>(res);

  if (!res.ok) {
    if (res.status === 401)
      throw new Error("Unauthorized. Please login again.");
    throw new Error(pickMessage(json, "Create company failed"));
  }

  // backend ตาม type คือ { success, company }
  if (!("company" in json) || !json.company) {
    // เผื่อบาง backend ส่ง {data: company}
    const maybe = json as unknown as { data?: CompanyApiModel };
    if (maybe.data) return maybe.data;
    throw new Error("Invalid create company response");
  }

  return json.company;
}

// UPDATE company
export async function updateCompany(
  companyId: string,
  payload: CreateCompanyPayload
): Promise<CompanyApiModel> {
  // const token = getToken();
  // if (!token) throw new Error("No token. Please login again.");

  const res = await fetch(`${API_BASE}/update-comp/${companyId}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });

  const json = await readJsonOrText<UpdateCompanyResponse & ApiErrorShape>(res);

  if (!res.ok) {
    if (res.status === 401)
      throw new Error("Unauthorized. Please login again.");
    throw new Error(pickMessage(json, "Update company failed"));
  }

  if (!("data" in json) || !json.data) {
    throw new Error("Invalid update company response");
  }

  return json.data;
}

// mapping helpers
export function mapCompanyApiToForm(api: CompanyApiModel) {
  return {
    companyName: api.comp_name ?? "",
    taxId: api.comp_taxid ?? "",
    email: api.comp_email ?? "",
    phone: api.comp_phone ?? "",
    companyAddress: api.comp_addr ?? "",
    country: "Thailand",
    province: api.comp_prov ?? "",
    district: api.comp_dist ?? "",
    subDistrict: api.comp_subdist ?? "",
    zipcode: api.comp_zip ?? "",
    contactName: api.comp_person_name ?? "",
    contactPhone: api.comp_person_phone ?? "",
    contactEmail: api.comp_person_email ?? "",
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
