export type AddressSource =
  | "database"
  | "api"
  | "api_and_saved"
  | "api_fallback"
  | "api_empty";

export interface AddressListResponse<T> {
  source: AddressSource;
  data: T;
}

export interface SubDistrictItem {
  sub_district: string;
  zipcode: string;
}
