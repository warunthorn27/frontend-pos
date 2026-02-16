export type BusinessType = "corporation" | "individual";

export interface CustomerListItem {
  id: string;
  businessType: string;
  companyName?: string;
  name: string;
  email?: string;
  phone?: string;
}

export interface Address {
  address: string;
  country: string;
  province: string;
  district: string;
  subDistrict: string;
  zipcode: string;
}

export interface TaxInvoiceAddress extends Address {
  companyName: string;
  taxId: string;
}

export interface BaseCustomer {
  customerId: string;
  phone: string;
  email?: string;
  note?: string;
  address: Address;
}

export interface CorporationCustomer extends BaseCustomer {
  businessType: "corporation";
  companyName: string;
  contactPerson: string;
}

export interface IndividualCustomer extends BaseCustomer {
  businessType: "individual";
  firstName: string;
  lastName: string;
  gender: string;
  birthday: string;
}

export type CustomerFormInput =
  | (IndividualCustomer & {
      taxInvoiceAddress?: TaxInvoiceAddress | null;
    })
  | (CorporationCustomer & {
      taxInvoiceAddress?: TaxInvoiceAddress | null;
    });
