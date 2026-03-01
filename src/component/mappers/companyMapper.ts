import type {
  CompanyApiModel,
  CompanyFormValues,
  CreateCompanyPayload,
} from "../../types/company";

export function mapCompanyApiToForm(api: CompanyApiModel): CompanyFormValues {
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
    companyFile: api.comp_file ?? null,
    currency: api.main_currency ?? "THB",
  };
}

export function mapCompanyFormToPayload(
  values: CompanyFormValues,
): CreateCompanyPayload {
  return {
    comp_name: values.companyName,
    comp_country: values.country,
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
    main_currency: values.currency,
  };
}
