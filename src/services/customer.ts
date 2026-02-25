import type { CountryCode } from "../component/phoneInput/CountryPhoneInput";
import type {
  CustomerForm,
  CreateCustomerPayload,
  CustomerResponse,
  UpdateCustomerPayload,
} from "../types/customer";
import { mapCustomerFormToPayload } from "../types/customer";
import { API_BASE, fetchWithAuth } from "./apiClient";

// API Envelope Types
export interface CustomerApiResponse {
  success: boolean;
  message: string;
  data: CustomerResponse;
}

export interface CustomerListResponse {
  success: boolean;
  data: CustomerResponse[];
  total: number;
  page: number;
  totalPages: number;
}

export const customerService = {
  async createCustomer(form: CustomerForm, country: CountryCode) {
    const payload: CreateCustomerPayload = mapCustomerFormToPayload(
      form,
      country,
    );

    return fetchWithAuth<CustomerApiResponse>(`${API_BASE}/create-customer`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  },

  async listCustomers(
    page = 1,
    limit = 10,
    search = "",
    businessType?: string,
  ) {
    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit),
      ...(search ? { search } : {}),
      ...(businessType ? { business_type: businessType } : {}),
    });

    return fetchWithAuth<CustomerListResponse>(
      `${API_BASE}/all-customer?${params.toString()}`,
    );
  },

  async getCustomer(id: string) {
    return fetchWithAuth<CustomerApiResponse>(`${API_BASE}/one-customer/${id}`);
  },

  async updateCustomer(id: string, payload: UpdateCustomerPayload) {
    return fetchWithAuth<CustomerApiResponse>(
      `${API_BASE}/update-customer/${id}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      },
    );
  },

  async deleteCustomer(id: string) {
    return fetchWithAuth<CustomerApiResponse>(
      `${API_BASE}/delete-customer/${id}`,
      { method: "DELETE" },
    );
  },
};
