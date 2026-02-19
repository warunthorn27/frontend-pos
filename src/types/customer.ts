import { formatPhoneForDisplay } from "../utils/phone";

export type BusinessType = "Corporation" | "Individual";
export type CustomerForm = CorporationCustomerForm | IndividualCustomerForm;

// ใช้ร่วมกันทั้ง 2 Business Types
export interface BaseCustomerForm {
  businessType: BusinessType;
  phone: string;
  email?: string;
  note?: string;
  address: Address;

  taxInvoice?: {
    companyName: string;
    taxId: string;
    address: Address;
    useSameAddress: boolean;
  } | null;
}

// Corporation
export interface CorporationCustomerForm extends BaseCustomerForm {
  businessType: "Corporation";
  companyName: string;
  contactPerson: string;
}

// Individual
export interface IndividualCustomerForm extends BaseCustomerForm {
  businessType: "Individual";
  firstName: string;
  lastName: string;
  gender: string;
  birthday: string;
}

// Address
export interface Address {
  address: string;
  country: string;
  province: string;
  district: string;
  subDistrict: string;
  zipcode: string;
}

export interface CreateCustomerPayload {
  business_type: BusinessType;

  customer_name: string;
  customer_phone: string;
  customer_email?: string;
  note?: string;

  company_name?: string;
  contact_person: string;

  customer_gender?: string;
  customer_date?: string;

  addr_province: string;
  addr_district: string;
  addr_sub_district: string;
  addr_zipcode: string;

  tax_addr?: string;
}

// map
export const mapCustomerFormToPayload = (
  form: CustomerForm,
): CreateCustomerPayload => {
  const isCorporation = form.businessType === "Corporation";

  const customerName = isCorporation
    ? form.companyName
    : `${form.firstName} ${form.lastName}`;

  return {
    business_type: form.businessType,

    customer_name: customerName,
    customer_phone: form.phone,
    customer_email: form.email,
    note: form.note,

    company_name: isCorporation ? form.companyName : undefined,
    contact_person: isCorporation ? form.contactPerson : customerName,
    customer_gender: isCorporation ? undefined : form.gender,
    customer_date: isCorporation ? undefined : form.birthday,
    addr_province: form.address.province,
    addr_district: form.address.district,
    addr_sub_district: form.address.subDistrict,
    addr_zipcode: form.address.zipcode,
    tax_addr: form.taxInvoice
      ? JSON.stringify({
          company_name: form.taxInvoice.companyName,
          tax_id: form.taxInvoice.taxId,
          address: {
            address: form.taxInvoice.address.address,
            country: form.taxInvoice.address.country,
            province: form.taxInvoice.address.province,
            district: form.taxInvoice.address.district,
            sub_district: form.taxInvoice.address.subDistrict,
            zipcode: form.taxInvoice.address.zipcode,
          },
        })
      : undefined,
  };
};

// API Response Types (Mirror Backend)
export interface CustomerResponse {
  _id: string;

  customer_id: string;
  business_type: BusinessType;

  customer_name: string;
  company_name?: string;
  contact_person: string;

  customer_email?: string;
  customer_phone: string;

  customer_gender?: string;
  customer_date?: string;

  customer_tax_id?: string;
  tax_addr?: string;

  address: {
    province: string;
    district: string;
    sub_district: string;
    zipcode: string;
  };

  note?: string;

  createdAt: string;
  updatedAt: string;
}

// list
export interface CustomerListItem {
  id: string; // MUST for DataGrid (not show)
  customerId: string; // show on table
  businessType: BusinessType;
  companyName?: string;
  name: string;
  email?: string;
  phone: string;
}

// map
export const mapCustomerResponseToListItem = (
  customer: CustomerResponse,
): CustomerListItem => {
  const isCorporation = customer.business_type === "Corporation";

  return {
    id: customer._id,
    customerId: customer.customer_id,
    businessType: customer.business_type,
    companyName: customer.company_name,

    name: isCorporation
      ? customer.contact_person // ใช้ Contact Person
      : customer.customer_name,

    email: customer.customer_email,
    phone: formatPhoneForDisplay(customer.customer_phone, "TH"),
  };
};
