export interface CustomerListItem {
  id: string;
  customerId: string;
  businessType: string;
  companyName: string;
  name: string;
  email: string;
  phone: string;
  status: "active" | "inactive";
}

export interface CustomerFormInput {
  customerId: string;
  businessType: string;
  companyName: string;
  name: string;
  email: string;
  phone: string;
  status: "active" | "inactive";
}

export interface CustomerModel {
  _id: string;
  customer_id: string;
  business_type: string;
  company_name: string;
  name: string;
  email: string;
  phone: string;
  status: boolean;
  comp_id?: string;
}
