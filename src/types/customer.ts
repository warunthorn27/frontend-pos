import type { CountryCode } from "../component/phoneInput/CountryPhoneInput";
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
  customer_country: CountryCode;
  customer_email?: string;
  note?: string;

  company_name?: string;
  contact_person: string;

  customer_gender?: string;
  customer_date?: string;

  // Address
  addr_line: string;
  addr_country: string;
  addr_province: string;
  addr_district: string;
  addr_sub_district: string;
  addr_zipcode: string;

  // Tax Invoice Address (ถ้ามี)
  tax_company_name?: string;
  tax_addr_line?: string;
  tax_addr_country?: string;
  tax_addr_province?: string;
  tax_addr_district?: string;
  tax_addr_sub_district?: string;
  tax_addr_zipcode?: string;

  customer_tax_id?: string;
}

// map
export const mapCustomerFormToPayload = (
  form: CustomerForm,
  country: CountryCode,
): CreateCustomerPayload => {
  const isCorporation = form.businessType === "Corporation";

  const customerName = isCorporation
    ? form.companyName
    : `${form.firstName} ${form.lastName}`;

  return {
    business_type: form.businessType,

    customer_name: customerName,
    customer_phone: form.phone,
    customer_country: country,
    customer_email: form.email,
    note: form.note,

    company_name: isCorporation
      ? form.companyName
      : form.taxInvoice?.companyName || "",
    contact_person: isCorporation ? form.contactPerson : customerName,
    customer_gender: isCorporation ? undefined : form.gender,
    customer_date: isCorporation ? undefined : form.birthday,

    addr_line: form.address.address,
    addr_country: form.address.country,
    addr_province: form.address.province,
    addr_district: form.address.district,
    addr_sub_district: form.address.subDistrict,
    addr_zipcode: form.address.zipcode,

    customer_tax_id: form.taxInvoice?.taxId,

    tax_company_name: form.taxInvoice?.companyName,
    tax_addr_line: form.taxInvoice?.address.address,
    tax_addr_country: form.taxInvoice?.address.country,
    tax_addr_province: form.taxInvoice?.address.province,
    tax_addr_district: form.taxInvoice?.address.district,
    tax_addr_sub_district: form.taxInvoice?.address.subDistrict,
    tax_addr_zipcode: form.taxInvoice?.address.zipcode,
  };
};

export interface UpdateCustomerPayload {
  customer_name?: string;
  business_type?: BusinessType;
  company_name?: string;
  contact_person?: string;

  customer_email?: string;
  customer_phone?: string;
  customer_gender?: string;
  customer_date?: string | null;
  customer_tax_id?: string | null;
  note?: string;

  addr_line?: string;
  addr_country?: string;
  addr_province?: string;
  addr_district?: string;
  addr_sub_district?: string;
  addr_zipcode?: string;

  tax_company_name?: string | null;
  tax_addr_line?: string | null;
  tax_addr_country?: string | null;
  tax_addr_province?: string | null;
  tax_addr_district?: string | null;
  tax_addr_sub_district?: string | null;
  tax_addr_zipcode?: string | null;
}

export const mapCustomerToUpdatePayload = (
  c: CustomerResponse,
): UpdateCustomerPayload => {
  const noTax = !c.customer_tax_id && !c.tax_addr;

  return {
    customer_name: c.customer_name,
    business_type: c.business_type,
    company_name: c.company_name,
    contact_person: c.contact_person,

    customer_email: c.customer_email,
    customer_phone: c.customer_phone,
    customer_gender: c.customer_gender,
    customer_date: c.customer_date ?? null,
    note: c.note,

    addr_line: c.address.address_line,
    addr_country: c.address.country,
    addr_province: c.address.province,
    addr_district: c.address.district,
    addr_sub_district: c.address.sub_district,
    addr_zipcode: c.address.zipcode,

    // tax address
    customer_tax_id: noTax ? null : c.customer_tax_id,
    tax_company_name: noTax ? null : c.tax_addr?.company_name,
    tax_addr_line: noTax ? null : c.tax_addr?.address_line,
    tax_addr_country: noTax ? null : c.tax_addr?.country,
    tax_addr_province: noTax ? null : c.tax_addr?.province,
    tax_addr_district: noTax ? null : c.tax_addr?.district,
    tax_addr_sub_district: noTax ? null : c.tax_addr?.sub_district,
    tax_addr_zipcode: noTax ? null : c.tax_addr?.zipcode,
  };
};

export const isSameAddress = (
  a?: CustomerResponse["address"],
  b?: CustomerResponse["tax_addr"],
) => {
  if (!a || !b) return false;

  return (
    a.address_line === b.address_line &&
    a.country === b.country &&
    a.province === b.province &&
    a.district === b.district &&
    a.sub_district === b.sub_district &&
    a.zipcode === b.zipcode
  );
};

export const mapCustomerResponseToForm = (
  c: CustomerResponse,
): CustomerForm => {
  const hasTax =
    Boolean(c.customer_tax_id) || Boolean(c.tax_addr?.address_line);

  const sameAddress = isSameAddress(c.address, c.tax_addr);

  const taxInvoice = hasTax
    ? {
        companyName: c.company_name || "",
        taxId: c.customer_tax_id || "",
        useSameAddress: sameAddress,

        address: {
          address: c.tax_addr?.address_line || "",
          country: c.tax_addr?.country || "Thailand",
          province: c.tax_addr?.province || "",
          district: c.tax_addr?.district || "",
          subDistrict: c.tax_addr?.sub_district || "",
          zipcode: c.tax_addr?.zipcode || "",
        },
      }
    : null;

  if (c.business_type === "Corporation") {
    return {
      businessType: "Corporation",
      phone: c.customer_phone,
      email: c.customer_email,
      note: c.note,

      companyName: c.company_name || "",
      contactPerson: c.contact_person,

      address: {
        address: c.address.address_line || "",
        country: c.address.country || "Thailand",
        province: c.address.province,
        district: c.address.district,
        subDistrict: c.address.sub_district,
        zipcode: c.address.zipcode,
      },

      taxInvoice,
    };
  }

  const [firstName = "", lastName = ""] = c.customer_name.split(" ");

  return {
    businessType: "Individual",
    phone: c.customer_phone,
    email: c.customer_email,
    note: c.note,

    firstName,
    lastName,
    gender: c.customer_gender || "",
    birthday: c.customer_date || "",

    address: {
      address: c.address.address_line || "",
      country: c.address.country || "Thailand",
      province: c.address.province,
      district: c.address.district,
      subDistrict: c.address.sub_district,
      zipcode: c.address.zipcode,
    },

    taxInvoice,
  };
};

// API Response Types
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

  address: {
    address_line: string;
    country: string;
    province: string;
    district: string;
    sub_district: string;
    zipcode: string;
  };

  tax_addr?: {
    company_name?: string;
    address_line?: string;
    country?: string;
    province?: string;
    district?: string;
    sub_district?: string;
    zipcode?: string;
  };

  customer_tax_id?: string;

  note?: string;

  createdAt: string;
  updatedAt: string;
}

// list
export interface CustomerListItem {
  id: string; // MUST for DataGrid (not show)
  index?: number;
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
    phone: formatPhoneForDisplay(customer.customer_phone),
  };
};
