export interface CompanyFormValues {
  companyName: string;
  taxId: string;
  currency: string;
  email: string;
  phone: string;

  companyAddress: string;
  country: string;
  province: string;
  district: string;
  subDistrict: string;
  zipcode: string;

  contactName: string;
  contactPhone: string;
  contactEmail: string;

  companyFile?: string | null;
}

export interface CompanyApiModel {
  _id: string;
  comp_name: string;
  comp_addr: string;
  comp_subdist: string;
  comp_dist: string;
  comp_prov: string;
  comp_zip: string;
  comp_email: string;
  comp_taxid: string;
  main_currency: string;
  comp_phone: string;
  comp_person_name: string;
  comp_person_phone: string;
  comp_person_email: string;
  comp_file: string | null;
}

export interface CreateCompanyPayload {
  comp_name: string;
  comp_country: string;
  comp_addr: string;
  comp_subdist: string;
  comp_dist: string;
  comp_prov: string;
  comp_zip: string;
  comp_email: string;
  comp_taxid: string;
  main_currency: string;
  comp_phone: string;
  comp_person_name: string;
  comp_person_phone: string;
  comp_person_email: string;
  comp_file?: string | null;
}

// response ที่คาดจาก backend
export interface GetCompanyByIdResponse {
  success: boolean;
  data: CompanyApiModel;
}

export interface CreateCompanyResponse {
  success: boolean;
  message: string;
  company: CompanyApiModel;
}

export interface UpdateCompanyResponse {
  success: boolean;
  message: string;
  data: CompanyApiModel;
}

export type CompanyProfileViewData = CompanyFormValues & {
  logoUrl?: string;
};
